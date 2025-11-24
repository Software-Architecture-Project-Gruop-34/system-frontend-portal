import React from 'react';

const AdminReservations: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <p className="text-sm text-gray-500">Admin view of all stall reservations.</p>
      </div>

      <div className="border rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-600">Reservation management interface</p>
      </div>
    </div>
  );
};

export default AdminReservations;
