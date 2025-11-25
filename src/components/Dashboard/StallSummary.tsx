import React, { useEffect, useState } from 'react';
import { getStallsByStatus, getStallsBySize } from '../../api/stalls';
import LoadingSpinner from '../common/LoadingSpinner';

interface StallStats {
  available: number;
  reserved: number;
  blocked: number;
  small: number;
  medium: number;
  large: number;
  total: number;
}

export const StallSummary: React.FC = () => {
  const [stallStats, setStallStats] = useState<StallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStallStats();
  }, []);

  const fetchStallStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [available, reserved, blocked, small, medium, large] = await Promise.all([
        getStallsByStatus('AVAILABLE'),
        getStallsByStatus('RESERVED'),
        getStallsByStatus('BLOCKED'),
        getStallsBySize('SMALL'),
        getStallsBySize('MEDIUM'),
        getStallsBySize('LARGE'),
      ]);

      const stats: StallStats = {
        available: available.length,
        reserved: reserved.length,
        blocked: blocked.length,
        small: small.length,
        medium: medium.length,
        large: large.length,
        total: available.length + reserved.length + blocked.length,
      };

      setStallStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stall statistics');
    } finally {
      setLoading(false);
    }
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
          <p className="font-medium">Error loading stall statistics</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchStallStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stallStats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📊</span>
        Stall Summary
      </h2>

      {/* Status Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">By Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Stalls</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stallStats.total}</p>
              </div>
              <div className="text-4xl">🏪</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Available</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stallStats.available}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-green-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.available / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Reserved</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{stallStats.reserved}</p>
              </div>
              <div className="text-4xl">🔒</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-yellow-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.reserved / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Blocked</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{stallStats.blocked}</p>
              </div>
              <div className="text-4xl">🚫</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-red-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.blocked / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Distribution */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">By Size</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Small</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stallStats.small}</p>
              </div>
              <div className="text-4xl">🏪</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-purple-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.small / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Medium</p>
                <p className="text-3xl font-bold text-indigo-900 mt-2">{stallStats.medium}</p>
              </div>
              <div className="text-5xl">🏪</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-indigo-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.medium / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 uppercase tracking-wide">Large</p>
                <p className="text-3xl font-bold text-pink-900 mt-2">{stallStats.large}</p>
              </div>
              <div className="text-6xl">🏪</div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-pink-700">
                <span className="font-medium">{stallStats.total > 0 ? ((stallStats.large / stallStats.total) * 100).toFixed(1) : 0}%</span>
                <span className="ml-1">of total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
