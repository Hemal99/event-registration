
import React from 'react';
import { Attendee } from '../types';
import AttendeeTable from '../components/AttendeeTable';
import TicketModal from '../components/TicketModal';
import { UsersIcon } from '../components/icons/ActionIcons';

interface HomePageProps {
  attendees: Attendee[];
  onSendTicket: (attendee: Attendee) => void;
  sendingEmailId: string | null;
  selectedAttendee: Attendee | null;
  onCloseModal: () => void;
  onNavigateToAdmin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  attendees,
  onSendTicket,
  sendingEmailId,
  selectedAttendee,
  onCloseModal,
  onNavigateToAdmin,
}) => {
  return (
    <>
      {attendees.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Attendee List</h2>
          <AttendeeTable 
            attendees={attendees} 
            onSendTicket={onSendTicket}
            sendingEmailId={sendingEmailId}
          />
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Attendees Found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started by uploading your attendee list on the admin page.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Admin Page
            </button>
          </div>
        </div>
      )}
      <TicketModal
        attendee={selectedAttendee}
        onClose={onCloseModal}
      />
    </>
  );
};

export default HomePage;
