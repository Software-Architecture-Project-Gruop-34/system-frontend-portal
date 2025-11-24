export interface Reservation {
  id: number;
  userId: number;
  stallId: number;
  reservationDate: string; // ISO
  confirmationDate: string | null; // ISO or null
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | string;
  qrCode: string | null;
  totalAmount: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const BASE = 'http://localhost:8082/api';

export const getReservations = async (): Promise<Reservation[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const res = await fetch(`${BASE}/reservations`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch reservations (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as Reservation[];
  return Array.isArray(data) ? data : [];
};
