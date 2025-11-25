export interface Reservation {
  id: number;
  userId: number;
  stallId: number;
  reservationDate: string;
  confirmationDate: string | null; 
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | string;
  qrCode: string | null;
  totalAmount: number;
  createdAt: string; 
  updatedAt: string; 
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

export const confirmReservation = async (id: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');

  const res = await fetch(`${BASE}/reservations/${id}/confirm`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = `Failed to confirm reservation (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const data = await res.json();
    return { message: data?.message || 'Reservation confirmed' };
  } catch {
    return { message: 'Reservation confirmed' };
  }
};

export const getReservationQrCode = async (id: number): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');

  const res = await fetch(`${BASE}/reservations/${id}/qr-code`, {
    headers: {
      Accept: 'text/plain,application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch QR code (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const text = await res.text();
    return text.trim();
  } catch {
    throw new Error('Failed to parse QR code response');
  }
};

export const verifyReservationByQr = async (
  qrCode: string
): Promise<{ message: string; status?: number; timestamp?: string; reservation?: Reservation }> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required. Please log in.');

  const url = `${BASE}/reservations/verify-qr?qrCode=${encodeURIComponent(qrCode)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  let message = `Verification failed (${res.status})`;
  let payload: any = { message, status: res.status };
  try {
    const j = await res.json();
    if (j && typeof j === 'object') {
      payload = j;
      if (typeof j.message === 'string') message = j.message;
      if (j.id && j.userId && j.stallId) {
        return { message: '', reservation: j as Reservation };
      }
    }
  } catch {
  }

  return { message, status: payload.status, timestamp: payload.timestamp };
};
