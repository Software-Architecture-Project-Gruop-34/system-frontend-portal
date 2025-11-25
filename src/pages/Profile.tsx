import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../api/auth';
import type { User } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from localStorage (stored during login as 'userId')
      const userIdStr = localStorage.getItem('userId');
      if (!userIdStr) {
        throw new Error('User not found. Please log in again.');
      }

      const userId = parseInt(userIdStr, 10);
      if (isNaN(userId)) {
        throw new Error('Invalid user ID. Please log in again.');
      }

      const profileData = await getUserProfile(userId);
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-full p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">User Profile</h1>
          {/* <button
            onClick={fetchUserProfile}
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button> */}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Email Address:</label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            {user.role !== 'ADMIN' && (
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 w-40">Business Name:</label>
                <p className="text-gray-900">{user.businessName}</p>
              </div>
            )}

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Contact Person:</label>
              <p className="text-gray-900">{user.contactPerson}</p>
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Phone Number:</label>
              <p className="text-gray-900">{user.phoneNumber}</p>
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">User ID:</label>
              <p className="text-gray-900">#{user.id}</p>
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Role:</label>
              <p className="text-gray-900">{user.role}</p>
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Account Status:</label>
              <p className="text-gray-900">{user.status || 'Active'}</p>
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 w-40">Member Since:</label>
              <p className="text-gray-900">{formatDate(user.createdAt)}</p>
            </div>

            <div className="flex items-center md:col-span-2">
              <label className="text-sm font-medium text-gray-700 w-40">Address:</label>
              <p className="text-gray-900">{user.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
