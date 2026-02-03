
import React, { useEffect, useRef } from 'react';
import { Attendee } from '../types';

interface TicketModalProps {
  attendee: Attendee | null;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ attendee, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (attendee && canvasRef.current) {
      (window as any).QRCode.toCanvas(canvasRef.current, attendee._id, { width: 220, margin: 2 }, (error: Error) => {
        if (error) console.error("QR Code generation failed:", error);
      });
    }
  }, [attendee]);

  if (!attendee) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto transform transition-all duration-300 scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 text-center">
            <div className="bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-3 -mx-8 -mt-8 mb-8 rounded-t-xl">
                EVENT TICKET
            </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{attendee.Name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{attendee.Email}</p>

          <div className="flex justify-center items-center my-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <canvas ref={canvasRef} />
          </div>

          <div className="text-left space-y-3">
            <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Amount Paid:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">${attendee['Amount paid'].toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Balance Due:</span>
                <span className={`font-semibold ${attendee['Balance need to pay'] > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>${attendee['Balance need to pay'].toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Unique ID:</span>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{attendee._id}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
