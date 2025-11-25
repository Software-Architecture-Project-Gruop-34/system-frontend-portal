import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { getReservations, type Reservation } from '../api/reservations';
import { getUserProfile } from '../api/auth';
import { getStallsByStatus } from '../api/stalls';
import type { Column } from '../components/common/Table';
import Table from '../components/common/Table';

const UserDashboard: React.FC = () => {
   const userIdRaw = localStorage.getItem('userId');
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stallStats, setStallStats] = useState<{ available: number; reserved: number; blocked: number }>({ available: 0, reserved: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return '—'; }
};

  useEffect(() => {
    const load = async () => {
      if (!userId) { setError('User not found in session'); setLoading(false); return; }
      try {
        setLoading(true);
        const [allReservations, profile, available, reserved, blocked] = await Promise.all([
          getReservations(),
          getUserProfile(userId),
          getStallsByStatus('AVAILABLE'),
          getStallsByStatus('RESERVED'),
          getStallsByStatus('BLOCKED'),
        ]);
        setReservations(allReservations.filter(r => r.userId === userId));
        setUser(profile);
        setStallStats({ available: available.length, reserved: reserved.length, blocked: blocked.length });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const nextReservation = reservations
    .filter(r => r.status === 'CONFIRMED')
    .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime())[0];

  const requiredFields: (keyof User)[] = ['contactPerson', 'phoneNumber', 'address'];
  if (user && user.role === 'USER') requiredFields.unshift('businessName');

  return (
    <div className="space-y-8 min-h-screen bg-gray-100 p-6">
          {/* Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome back{user ? `, ${user.contactPerson || user.businessName || 'User'}` : ''}</h2>
              <p className="text-sm text-gray-500">Quick overview of your activity</p>
            </div>
            
          </div>

          {/* Upcoming & Availability */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 flex items-center justify-between">Upcoming Reservation <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{nextReservation ? nextReservation.status : 'NONE'}</span></h3>
              {nextReservation ? (
                <div className="mt-3 space-y-1 text-sm">
                  <div className="font-semibold text-gray-900">Stall #{nextReservation.stallId}</div>
                  <div className="text-gray-600">Date: {formatDate(nextReservation.reservationDate)}</div>
                  <div className="text-gray-600">Booked: {formatDate(nextReservation.createdAt)}</div>
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-500">No confirmed reservations yet.</div>
              )}
            </div>
            <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-2">
              <h3 className="text-sm font-medium text-gray-700">Stall Availability</h3>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded border border-green-200 bg-green-50">
                  <div className="text-xs text-green-700">Available</div>
                  <div className="text-xl font-semibold text-green-700">{stallStats.available}</div>
                </div>
                <div className="p-3 rounded border border-blue-200 bg-blue-50">
                  <div className="text-xs text-blue-700">Reserved</div>
                  <div className="text-xl font-semibold text-blue-700">{stallStats.reserved}</div>
                </div>
                <div className="p-3 rounded border border-gray-300 bg-gray-100">
                  <div className="text-xs text-gray-700">Blocked</div>
                  <div className="text-xl font-semibold text-gray-700">{stallStats.blocked}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent reservations */}
          <div className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Reservations</h3>
            {reservations.length === 0 && (
              <div className="text-sm text-gray-500">You have not made any reservations yet.</div>
            )}
            {reservations.length > 0 && (
              (() => {
                const recent = reservations
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5);
                const columns: Column<Reservation>[] = [
                  { key: 'id', header: 'ID', sortable: false, render: (v: number) => <span className="font-medium text-gray-900">{v}</span> },
                  { key: 'stallId', header: 'Stall', sortable: false, render: (v: number) => <span>{v}</span> },
                  { key: 'status', header: 'Status', sortable: false, render: (v: Reservation['status']) => (
                    <span className={`text-xs px-2 py-1 rounded-full border inline-block ${
                      v === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' :
                      v === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      v === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>{v}</span>
                  ) },
                  { key: 'reservationDate', header: 'Date', sortable: false, render: (v: string) => <span className="text-gray-600">{formatDate(v)}</span> },
                  { key: 'totalAmount', header: 'Amount', sortable: false, render: (v: number) => <span className="text-gray-900 font-medium">LKR {Number(v).toLocaleString()}</span> },
                ];
                return <Table columns={columns} data={recent} searchable={false} pagination={false} sortable={false} hover striped compact />;
              })()
            )}
          </div>
    </div>
  );
};

export default UserDashboard;
