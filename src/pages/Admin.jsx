import React, { useState } from 'react';
import VerificationTable from './VerificationTable';
import ProfileEditPage from '../components/Profile';

// --- Placeholder Components (same as before) ---
const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
    <p className="mt-4 text-gray-600">Welcome to your dashboard. Key metrics and summaries will be shown here.</p>
  </div>
);



function AdminPanel() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'verification':
        return <VerificationTable />;
      case 'profile':
        return <ProfileEditPage />;
      default:
        return <Dashboard />;
    }
  };
  
  const getNavClasses = (pageName) => {
    const baseClasses = "w-full text-left p-3 rounded-md transition-colors duration-200 text-lg";
    if (activePage === pageName) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
  };

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    if (window.innerWidth < 768) { // md breakpoint in Tailwind
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    }
  };

  return (
    <div className="relative min-h-screen md:flex font-sans">
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-4 z-30
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My App</h2>
            {/* Close button (mobile only) */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <nav className="mt-10 flex flex-col space-y-2">
          <button onClick={() => handleNavClick('dashboard')} className={getNavClasses('dashboard')}>
            Dashboard
          </button>
          <button onClick={() => handleNavClick('verification')} className={getNavClasses('verification')}>
            Verification
          </button>
          <button onClick={() => handleNavClick('profile')} className={getNavClasses('profile')}>
            Profile
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8">
        {/* Hamburger Menu Button (mobile only) */}
        <button onClick={() => setSidebarOpen(true)} className="md:hidden mb-4 p-2 rounded-md bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>

        {renderPage()}
      </main>
    </div>
  );
}

export default AdminPanel;