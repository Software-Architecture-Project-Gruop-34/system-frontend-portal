import React, { useState } from 'react';
import Modal from '../common/Modal';
import { toast } from 'react-toastify';
import { confirmReservation } from '../../api/reservations';

interface ConfirmReservationModalProps {
  isVisible: boolean;
  reservationId: number | null;
  onClose: () => void;
  onConfirmed: (id: number) => void;
}

const ConfirmReservationModal: React.FC<ConfirmReservationModalProps> = ({ isVisible, reservationId, onClose, onConfirmed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (reservationId == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await confirmReservation(reservationId);
      toast.success(res.message || 'Reservation confirmed');
      onConfirmed(reservationId);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to confirm reservation';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} width="max-w-md" closeOnBackdrop>
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirm Reservation</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to confirm reservation <span className="font-medium">#{reservationId}</span>? This will finalize the booking.</p>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmReservationModal;
