
import React, { useState, useCallback } from 'react';
import { Attendee } from '../types';
import { UploadCloudIcon } from './icons/StatusIcons';

interface FileUploadProps {
  onFileUpload: (data: Attendee[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onProcessingStart: () => void;
}

// UPDATE: Only include the columns that are strictly required by the database schema.
const REQUIRED_COLUMNS = ["Name", "Year", "Amount paid", "Balance need to pay", "Email"];

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, setLoading, setError, onProcessingStart }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    onProcessingStart();
    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError("Invalid file type. Please upload an Excel file (.xlsx, .xls).");
        return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
    
    try {
      // 1. Parse Excel file in the browser
      const data = await file.arrayBuffer();
      const workbook = (window as any).XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = (window as any).XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) throw new Error("The uploaded file is empty or has no data.");
      
      const headers = Object.keys(jsonData[0]);
      const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      
      // 2. Send the parsed data to the Next.js API Route
      console.log(`Sending ${jsonData.length} records to Next.js API route...`);
      const response = await fetch(`/api/attendees/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendees: jsonData }),
          signal: controller.signal // Add abort signal for timeout
      });

      clearTimeout(timeoutId); // Clear the timeout if the request succeeds

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.message || `Server responded with status ${response.status}`);
      }
      
      console.log("API Route response:", result);
      onFileUpload(result.data); // Use data returned from the server

    } catch (error) {
      clearTimeout(timeoutId); // Also clear timeout on error
      if ((error as Error).name === 'AbortError') {
        setError('Error: The request timed out. The server might be busy or down.');
      } else if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      // DO NOT call onFileUpload([]) on failure. This was the source of the bug.
    } finally {
      setLoading(false);
    }
  }, [onFileUpload, setLoading, setError, onProcessingStart]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Upload Attendee List</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Upload an Excel file to save attendees to the database.</p>
        <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
            ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <UploadCloudIcon className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500"/>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Excel file (.xlsx, .xls)</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, .xls" />
        </label>
    </div>
  );
};

export default FileUpload;