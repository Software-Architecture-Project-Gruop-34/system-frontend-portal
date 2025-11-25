import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/common/Table";
import type { Column } from "../components/common/Table";
import { showSuccess, showError } from "../components/common/Toast";
import Modal from "../components/common/Modal";
import { getReservationQrCode } from "../api/reservations";

type Reservation = {
  id: number;
  userId: number;
  stallId: number;
  reservationDate: string | null;
  confirmationDate: string | null;
  status: string;
  qrCode?: string | null;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  filterable?: false;
};

const RESERVATION_BASE = "http://localhost:8082";

const MyReservations: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrReservationId, setQrReservationId] = useState<number | null>(null);

  const userIdRaw = localStorage.getItem("userId");
  const userId = userIdRaw ? Number(userIdRaw) : null;

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${RESERVATION_BASE}/api/reservations/user/${userId}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data: Reservation[] = await res.json();
        setReservations(Array.isArray(data) ? data : [data]);
        setError(null);
      } catch (err: unknown) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg || "Failed to load reservations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
    return () => controller.abort();
  }, [userId]);

  const cancelReservation = async (reservation: Reservation) => {
    if (!reservation?.id) return;
    const ok = window.confirm("Cancel this reservation?");
    if (!ok) return;
    try {
      const res = await fetch(
        `${RESERVATION_BASE}/api/reservations/${reservation.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        let msg = `Cancel failed (${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {
            // ignore JSON parse errors
        }
        throw new Error(msg);
      }
      setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
      showSuccess("Reservation cancelled");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showError(msg || "Cancel failed");
    }
  };

  const openQrModal = async (reservation: Reservation) => {
    if (!reservation?.id) return;
    setQrReservationId(reservation.id);
    setQrError(null);
    setQrBase64(null);
    setQrLoading(true);
    setQrOpen(true);
    try {
      const base64 = await getReservationQrCode(reservation.id);
      setQrBase64(base64);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setQrError(msg || "Failed to load QR code");
      showError(msg || "Failed to load QR code");
    } finally {
      setQrLoading(false);
    }
  };

  const downloadQr = () => {
    if (!qrBase64 || !qrReservationId) {
      showError("QR code is not ready to download");
      return;
    }
    const dataUrl = `data:image/png;base64,${qrBase64}`;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `reservation-${qrReservationId}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showSuccess("QR code downloaded");
  };

  const cols: Column<Reservation>[] = [
    { key: "id", header: "ID", width: 60 },
    {
      key: "stallId",
      header: "Stall",
      render: (_v, row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/stalls/${row.stallId}`);
          }}
        >
          {row.stallId}
        </button>
      ),
    },
    {
      key: "reservationDate",
      header: "Reserved On",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      key: "confirmationDate",
      header: "Confirmed On",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    { key: "status", header: "Status" },
    {
      key: "totalAmount",
      header: "Amount",
      render: (v) => (typeof v === "number" ? `Rs.${v.toFixed(2)}` : "-"),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_v, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/stalls/${row.stallId}`);
            }}
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
          >
            View Stall
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              cancelReservation(row);
            }}
            className="px-2 py-1 text-sm bg-red-600 text-white rounded"
            disabled={row.status === "CANCELLED"}
          >
            Cancel
          </button>

          {row.status === "CONFIRMED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQrModal(row);
              }}
              className="px-2 py-1 text-sm bg-emerald-600 text-white rounded"
            >
              View QR
            </button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-3">My Reservations</h2>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Reservations</h2>

      <Table
        columns={cols}
        data={reservations}
        loading={loading}
        pagination
        pageSize={10}
        searchable
        sortable
        filterable={false} 
        emptyMessage="No reservations found"
      />

      <Modal isVisible={qrOpen} onClose={() => setQrOpen(false)} width="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Reservation QR Code</h3>
          {qrLoading && <div className="text-sm text-gray-500">Loading QR...</div>}
          {qrError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">{qrError}</div>
          )}
          {!qrLoading && !qrError && qrBase64 && (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={`data:image/png;base64,${qrBase64}`}
                alt="Reservation QR Code"
                className="rounded border border-gray-200"
              />
              <div className="flex justify-end w-full gap-2">
                <button
                  type="button"
                  onClick={downloadQr}
                  className="px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setQrOpen(false)}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded border hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyReservations;
