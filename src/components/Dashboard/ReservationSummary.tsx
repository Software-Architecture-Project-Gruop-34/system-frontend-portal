import React, { useEffect, useState } from 'react';
import { getReservations } from '../../api/reservations';
import type { Reservation } from '../../api/reservations';
import LoadingSpinner from '../common/LoadingSpinner';

interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: number;
  recentPending: Reservation[];
}

export const ReservationSummary: React.FC = () => {
  const [reservationStats, setReservationStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservationStats();
  }, []);

  const fetchReservationStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const reservations = await getReservations();

      const pending = reservations.filter(r => r.status === 'PENDING');
      const confirmed = reservations.filter(r => r.status === 'CONFIRMED');
      const cancelled = reservations.filter(r => r.status === 'CANCELLED');
      const totalRevenue = reservations
        .filter(r => r.status === 'CONFIRMED')
        .reduce((sum, r) => sum + r.totalAmount, 0);

      // Get 5 most recent pending reservations
      const recentPending = pending
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const stats: ReservationStats = {
        total: reservations.length,
        pending: pending.length,
        confirmed: confirmed.length,
        cancelled: cancelled.length,
        totalRevenue,
        recentPending,
      };

      setReservationStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservation statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(amount);
};

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading reservation statistics</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchReservationStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reservationStats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        Reservation Summary
      </h2>

      {/* Reservation Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total Card - Modern Shadow Style */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">📋</div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
                </div>
                <p className="text-4xl font-bold text-gray-900">{reservationStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Reservations</p>
              </div>
            </div>
          </div>

          {/* Pending Card - Icon Circle Style */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">⏳</div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
                </div>
                <p className="text-4xl font-bold text-yellow-600">{reservationStats.pending}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${reservationStats.total > 0 ? ((reservationStats.pending / reservationStats.total) * 100) : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {reservationStats.total > 0 ? ((reservationStats.pending / reservationStats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed Card - Success Badge Style */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✅</div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</p>
                </div>
                <p className="text-4xl font-bold text-green-600">{reservationStats.confirmed}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${reservationStats.total > 0 ? ((reservationStats.confirmed / reservationStats.total) * 100) : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {reservationStats.total > 0 ? ((reservationStats.confirmed / reservationStats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancelled Card - Alert Style */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">❌</div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancelled</p>
                </div>
                <p className="text-4xl font-bold text-red-600">{reservationStats.cancelled}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${reservationStats.total > 0 ? ((reservationStats.cancelled / reservationStats.total) * 100) : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {reservationStats.total > 0 ? ((reservationStats.cancelled / reservationStats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Card - Premium Highlight Style */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">💵</div>
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-white mt-1">{formatCurrency(reservationStats.totalRevenue)}</p>
                <p className="text-xs text-white/80 mt-2">From confirmed bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Pending Reservations */}
      {reservationStats.recentPending.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Pending Reservations</h3>
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Reservation ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Stall ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Reserved Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservationStats.recentPending.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{reservation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        #{reservation.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        #{reservation.stallId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(reservation.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(reservation.reservationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {reservationStats.pending > 5 && (
            <p className="mt-3 text-sm text-gray-600 text-center">
              Showing 5 of {reservationStats.pending} pending reservations
            </p>
          )}
        </div>
      )}

      {reservationStats.recentPending.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg font-medium text-gray-700">No pending reservations</p>
          <p className="text-sm text-gray-500 mt-1">All reservations are processed!</p>
        </div>
      )}
    </div>
  );
};
