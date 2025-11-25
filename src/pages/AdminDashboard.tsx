import React from 'react';
import { StallSummary, ReservationSummary } from '../components/Dashboard';

const AdminDashboard: React.FC = () => {
  // const handleLogout = () => {
  //   localStorage.clear();
  //   window.location.href = '/login';
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {/* <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button> */}
        </div>

        <div className="space-y-6">
          <StallSummary />
          <ReservationSummary />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
