import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50/50" style={{ height: 'calc(100vh - 70px)' }}>
          <div className="flex-1 p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
