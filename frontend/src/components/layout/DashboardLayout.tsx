import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (id: string) => {
    setActiveNavItem(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar activeItem={activeNavItem} onNavigate={handleNavigate} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar activeItem={activeNavItem} onNavigate={handleNavigate} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={handleMenuClick} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
