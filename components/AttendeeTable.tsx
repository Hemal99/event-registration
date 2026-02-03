
import React from 'react';
import { Attendee } from '../types';
import { MailIcon } from './icons/ActionIcons';
import { LoaderIcon } from './icons/StatusIcons';

interface AttendeeTableProps {
  attendees: Attendee[];
  onSendTicket: (attendee: Attendee) => void;
  sendingEmailId: string | null;
}

const AttendeeTable: React.FC<AttendeeTableProps> = ({ attendees, onSendTicket, sendingEmailId }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount Paid</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Send Ticket</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {attendees.map((attendee) => (
              <tr key={attendee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{attendee.Name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Year: {attendee.Year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{attendee.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        ${attendee['Amount paid'].toFixed(2)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attendee['Balance need to pay'] > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                        ${attendee['Balance need to pay'].toFixed(2)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onSendTicket(attendee)}
                    disabled={sendingEmailId === attendee._id}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    {sendingEmailId === attendee._id ? (
                      <>
                        <LoaderIcon className="animate-spin -ml-0.5 mr-2 h-4 w-4"/>
                        Sending...
                      </>
                    ) : (
                      <>
                        <MailIcon className="-ml-0.5 mr-2 h-4 w-4"/>
                        Send Ticket
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendeeTable;
