import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { updateUserProfile } from '../../api/auth';
import type { UpdateProfileData } from '../../types';
import type { User } from '../../types';
import { toast } from 'react-toastify';

interface UpdateProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdate: (updatedUser: User) => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isVisible,
  onClose,
  currentUser,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateProfileData>({
    businessName: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current user data when modal opens
  useEffect(() => {
    if (isVisible && currentUser) {
      setFormData({
        businessName: currentUser.businessName || '',
        contactPerson: currentUser.contactPerson || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
      });
      setError(null);
    }
  }, [isVisible, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove businessName if user is ADMIN
      const dataToSubmit = currentUser.role === 'ADMIN' 
        ? { 
            contactPerson: formData.contactPerson,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
          }
        : formData;

      const updatedUser = await updateUserProfile(dataToSubmit);
      toast.success('Profile updated successfully!');
      onUpdate(updatedUser);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} width="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Update Profile</h2>
        <p className="text-sm text-gray-600 mt-1">Update your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name - Only show for non-admin users */}
        {currentUser.role !== 'ADMIN' && (
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter business name"
            />
          </div>
        )}

        {/* Contact Person */}
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter contact person name"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter address"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProfileModal;
