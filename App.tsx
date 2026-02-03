
import React, { useState, useCallback } from 'react';
import { Attendee } from './types';
import { CheckCircleIcon, XCircleIcon } from './components/icons/StatusIcons';
import { BrandIcon } from './components/icons/BrandIcon';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ApiPage from './pages/ApiPage';

type Page = 'home' | 'admin' | 'api';

const App: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('home');

  const handleFileUpload = useCallback((data: Attendee[]) => {
    setAttendees(data);
    setSuccess(`${data.length} attendees loaded successfully.`);
    setError(null);
    setPage('home'); // Switch to home page after successful upload
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSendTicket = useCallback((attendee: Attendee) => {
    setSendingEmailId(attendee._id);
    setSuccess(null);
    setError(null);

    setTimeout(() => {
      console.log(`Simulating sending ticket to ${attendee.Email}`);
      setSendingEmailId(null);
      setSelectedAttendee(attendee);
      setSuccess(`Ticket sent to ${attendee.Name} (${attendee.Email})`);
    }, 1500);
  }, []);
  
  const handleCloseModal = () => {
    setSelectedAttendee(null);
  };

  const NavLink: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BrandIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Event Dashboard
            </h1>
          </div>
          <nav className="flex items-center space-x-2">
            <NavLink active={page === 'home'} onClick={() => setPage('home')}>Home</NavLink>
            <NavLink active={page === 'admin'} onClick={() => setPage('admin')}>Admin</NavLink>
            <NavLink active={page === 'api'} onClick={() => setPage('api')}>Backend API</NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
           {isLoading && (
            <div className="text-center p-8 text-indigo-600 dark:text-indigo-400">
              <p>Processing...</p>
            </div>
          )}
          
          {error && (
            <div className="my-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg flex items-center space-x-3">
              <XCircleIcon className="h-5 w-5"/>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="my-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5"/>
              <span>{success}</span>
            </div>
          )}

          {page === 'home' && (
            <HomePage
              attendees={attendees}
              onSendTicket={handleSendTicket}
              sendingEmailId={sendingEmailId}
              selectedAttendee={selectedAttendee}
              onCloseModal={handleCloseModal}
              onNavigateToAdmin={() => setPage('admin')}
            />
          )}

          {page === 'admin' && (
            <AdminPage
              attendees={attendees}
              onFileUpload={handleFileUpload}
              setLoading={setIsLoading}
              setError={setError}
              onProcessingStart={clearMessages}
            />
          )}

          {page === 'api' && (
            <ApiPage />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
