import React, { useEffect, useState } from 'react';
import Table from '../components/common/Table';
import type { Column } from '../components/common/Table';
import { getReservations } from '../api/reservations';
import type { Reservation } from '../api/reservations';
import { toast } from 'react-toastify';
import ConfirmReservationModal from '../components/Modals/ConfirmReservationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminReservations: React.FC = () => {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [confirmModalId, setConfirmModalId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const list = await getReservations();
        if (mounted) setData(list);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load reservations');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  const columns: Column<Reservation>[] = [
    { key: 'id', header: 'ID', sortable: true, width: 80 },
    { key: 'userId', header: 'User', sortable: true },
    { key: 'stallId', header: 'Stall', sortable: true },
    {
      key: 'reservationDate', header: 'Reservation Date', sortable: true,
      render: (v) => v ? new Date(v).toLocaleString() : '-'
    },
    {
      key: 'confirmationDate', header: 'Confirmed At', sortable: true,
      render: (v) => v ? new Date(v).toLocaleString() : '-'
    },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          v === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
          v === 'PENDING' ? 'bg-amber-100 text-amber-700' :
          v === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>{v}</span>
      )
    },
    {
      key: 'totalAmount', header: 'Amount', sortable: true,
      render: (v: number) => `Rs.${(Number(v) || 0).toFixed(2)}`
    },
    {
      key: 'actions', header: 'Actions', sortable: false,
      render: (_: any, row) => (
        row.status === 'PENDING' ? (
          <button
            type="button"
            onClick={() => setConfirmModalId(row.id)}
            className="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
          >
            Confirm
          </button>
        ) : <span className="text-xs text-gray-400">—</span>
      )
    },
   // { key: 'createdAt', header: 'Created', sortable: true, render: (v) => v ? new Date(v).toLocaleString() : '-' },
    //{ key: 'updatedAt', header: 'Updated', sortable: true, render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <p className="text-sm text-gray-500">Admin view of all stall reservations</p>
      </div>

      {error && (
        <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 p-6 bg-white rounded-lg border">
          <LoadingSpinner />
          <span>Loading reservations…</span>
        </div>
      ) : (
        <Table
          columns={columns}
          data={data}
          //searchable
          //sortable
          //filterable
          pagination
          pageSize={10}
          className=""
          emptyMessage="No reservations found"
        />
      )}

      <ConfirmReservationModal
        isVisible={confirmModalId !== null}
        reservationId={confirmModalId}
        onClose={() => setConfirmModalId(null)}
        onConfirmed={(id) => {
          setData(prev => prev.map(r => r.id === id ? { ...r, status: 'CONFIRMED', confirmationDate: new Date().toISOString(), updatedAt: new Date().toISOString() } : r));
        }}
      />
    </div>
  );
};

export default AdminReservations;
