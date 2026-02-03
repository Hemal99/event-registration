
import React, { useState, useCallback } from 'react';
import { Attendee, VerificationStatus } from '../types';
import FileUpload from '../components/FileUpload';
import QRScanner from '../components/QRScanner';
import VerificationResult from '../components/VerificationResult';

interface AdminPageProps {
  attendees: Attendee[];
  onFileUpload: (data: Attendee[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onProcessingStart: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ attendees, onFileUpload, setLoading, setError, onProcessingStart }) => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    setIsScanning(false);
    setLoading(true);
    setError(null);
    console.log(`Scanned ID: ${decodedText}`);

    try {
        console.log(`Verifying ID ${decodedText} with Next.js API route...`);
        const response = await fetch(`/api/attendees/verify/${decodedText}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Server responded with status ${response.status}`);
        }

        setVerificationStatus({ data: result });

    } catch (error) {
        if (error instanceof Error) {
            setVerificationStatus({ data: null, error: error.message });
        } else {
            setVerificationStatus({ data: null, error: 'An unknown verification error occurred.' });
        }
    } finally {
        setLoading(false);
    }
  }, [setLoading, setError]);

  const handleScanError = useCallback((errorMessage: string) => {
    // console.error(`QR Scanner Error: ${errorMessage}`);
  }, []);
  
  const handleStartScan = () => {
    setVerificationStatus(null);
    setError(null);
    setIsScanning(true);
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
  };

  return (
    <div className="space-y-8">
      <FileUpload
        onFileUpload={onFileUpload}
        setLoading={setLoading}
        setError={setError}
        onProcessingStart={onProcessingStart}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">QR Code Verification</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Scan an attendee's ticket to verify their registration details.</p>
        
        {attendees.length === 0 ? (
          <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            Please upload an attendee list first to enable QR code scanning.
          </p>
        ) : (
          <>
            <QRScanner
              isScanning={isScanning}
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
            />

            {verificationStatus && <VerificationResult status={verificationStatus} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
