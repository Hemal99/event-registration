
import React from 'react';
// FIX: Import shared VerificationStatus type and remove Attendee import which is no longer used.
import { VerificationStatus } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons/StatusIcons';

// FIX: Removed local VerificationStatus type definition. It's now imported from types.ts.

interface VerificationResultProps {
  status: VerificationStatus;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ status }) => {
  const { data, error } = status;

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg">
        <div className="flex items-center">
          <XCircleIcon className="h-6 w-6 mr-3" />
          <div>
            <p className="font-bold">Verification Failed</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  
  const hasBalance = data['Balance need to pay'] > 0;

  return (
    <div className={`mt-6 p-4 border-l-4 rounded-r-lg ${hasBalance ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500' : 'bg-green-100 dark:bg-green-900/30 border-green-500'}`}>
        <div className="flex items-center">
            <CheckCircleIcon className={`h-8 w-8 mr-4 ${hasBalance ? 'text-yellow-500' : 'text-green-500'}`} />
            <div>
                <p className={`text-sm font-medium ${hasBalance ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200'}`}>
                    Attendee Verified
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.Name}</h3>
            </div>
        </div>

        <div className="mt-4 pl-12 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Year:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{data.Year}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Amount Paid:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${data['Amount paid'].toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Balance Due:</span>
                <span className={`font-bold ${hasBalance ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    ${data['Balance need to pay'].toFixed(2)}
                </span>
            </div>
        </div>
    </div>
  );
};

export default VerificationResult;
