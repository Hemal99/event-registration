
import React, { useEffect, useRef } from 'react';
import { CameraIcon, StopCircleIcon } from './icons/ActionIcons';

declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

interface QRScannerProps {
  isScanning: boolean;
  onScanSuccess: (decodedText: string) => void;
  onScanError: (errorMessage: string) => void;
  onStartScan: () => void;
  onStopScan: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isScanning, onScanSuccess, onScanError, onStartScan, onStopScan }) => {
  const scannerRef = useRef<any>(null);
  const readerId = "qr-reader";

  useEffect(() => {
    if (!scannerRef.current) {
        scannerRef.current = new window.Html5Qrcode(readerId);
    }
    const html5QrCode = scannerRef.current;
    
    if (isScanning) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
        .catch((err: any) => {
          onScanError(`Unable to start scanning: ${err}`);
          onStopScan(); // Ensure isScanning state is reset on error
        });
    } else {
        if (html5QrCode.isScanning) {
            html5QrCode.stop().catch((err: any) => console.error("Failed to stop scanner:", err));
        }
    }
    
    return () => {
       if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err: any) => {
            // This can sometimes fail if the component unmounts quickly.
            // console.error("Cleanup failed to stop scanner:", err);
        });
      }
    };
  }, [isScanning, onScanSuccess, onScanError, onStopScan]);

  return (
    <div>
      <div id={readerId} style={{ display: isScanning ? 'block' : 'none', width: '100%', maxWidth: '500px', margin: '0 auto' }} />
      
      {!isScanning && (
        <button
          onClick={onStartScan}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <CameraIcon className="-ml-1 mr-2 h-5 w-5" />
          Start Scanning
        </button>
      )}

      {isScanning && (
        <button
          onClick={onStopScan}
          className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <StopCircleIcon className="-ml-1 mr-2 h-5 w-5" />
          Stop Scanning
        </button>
      )}
    </div>
  );
};

export default QRScanner;
