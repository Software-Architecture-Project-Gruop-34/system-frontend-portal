import React from 'react';
import Modal from '../common/Modal';
import type { Reservation } from '../../api/reservations';

interface ReservationDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  reservation?: Reservation;
  loading?: boolean;
}

const formatDate = (iso?: string | null) => {
  if (!iso) return 'N/A';
  try {
    return new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return 'N/A'; }
};

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  isVisible,
  onClose,
  message,
  reservation,
  loading = false,
}) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} width="max-w-lg">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Fetching details…</div>
        ) : reservation ? (
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>
              This reservation (ID: <strong>#{reservation.id}</strong>) was made by User <strong>#{reservation.userId}</strong> for Stall <strong>#{reservation.stallId}</strong>. 
              The reservation was created on <strong>{formatDate(reservation.createdAt)}</strong> with a scheduled date of <strong>{formatDate(reservation.reservationDate)}</strong>.
            </p>
            <p className="mt-2">
              The current status is <strong className={`px-2 py-0.5 rounded text-xs ${
                reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                reservation.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>{reservation.status}</strong>.
              {reservation.confirmationDate && (
                <span> It was confirmed on <strong>{formatDate(reservation.confirmationDate)}</strong>.</span>
              )}
            </p>
            <p className="mt-2">
              The total amount for this reservation is <strong>Rs. {reservation.totalAmount.toFixed(2)}</strong>.
              {reservation.qrCode && (
                <span> QR Code: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">{reservation.qrCode}</code></span>
              )}
            </p>
            {reservation.updatedAt && (
              <p className="mt-2 text-xs text-gray-500">
                Last updated: {formatDate(reservation.updatedAt)}
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-800 whitespace-pre-line">{message || 'No details available'}</div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded border hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReservationDetailsModal;
