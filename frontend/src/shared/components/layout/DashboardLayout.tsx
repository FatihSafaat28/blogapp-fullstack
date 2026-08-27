import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full animate-slideInLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
