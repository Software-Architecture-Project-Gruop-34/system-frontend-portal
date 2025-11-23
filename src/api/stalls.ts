const STALL_BASE = 'http://localhost:8081/api';

export interface Stall {
  id: number;
  stallCode: string;
  stallName: string;
  size: string;
  width: number;
  depth: number;
  category: string;
  x: number;
  y: number;
  rotation: number;
  status: string;
  imgUrl?: string;
  price: number;
}

export const getStallByCode = async (stallCode: string): Promise<Stall> => {
  const code = stallCode.trim();
  if (!code) throw new Error('Stall code required');

  const token = localStorage.getItem('token');
  const res = await fetch(`${STALL_BASE}/stalls/code/${encodeURIComponent(code)}`, {
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch stall (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as Stall;
  return data;
};

export const searchStallsByName = async (stallName: string): Promise<Stall[]> => {
  const name = stallName.trim();
  if (!name) throw new Error('Stall name required');

  const token = localStorage.getItem('token');
  const url = `${STALL_BASE}/stalls/search/name?stallName=${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = `Failed to search stalls (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as Stall[];
  return Array.isArray(data) ? data : [];
};

export const searchStallsByCategory = async (category: string): Promise<Stall[]> => {
  const cat = category.trim();
  if (!cat) throw new Error('Category required');

  const token = localStorage.getItem('token');
  const url = `${STALL_BASE}/stalls/search/category?category=${encodeURIComponent(cat)}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = `Failed to search by category (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as Stall[];
  return Array.isArray(data) ? data : [];
};

export const getStallsBySize = async (size: string): Promise<Stall[]> => {
  const sz = size.trim().toUpperCase();
  if (!sz || !['SMALL','MEDIUM','LARGE'].includes(sz)) throw new Error('Size must be SMALL, MEDIUM or LARGE');

  const token = localStorage.getItem('token');
  const url = `${STALL_BASE}/stalls/size/${encodeURIComponent(sz)}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch stalls by size (${res.status})`;
    try {
      const j = await res.json();
      if (j?.message) message = j.message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as Stall[];
  return Array.isArray(data) ? data : [];
};
