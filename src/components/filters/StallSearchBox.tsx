import React, { useState } from 'react';
import { getStallByCode, searchStallsByName, searchStallsByCategory } from '../../api/stalls';
import type { Stall } from '../../api/stalls';
import LoadingSpinner from '../common/LoadingSpinner';

interface StallSearchBoxProps {
  onFound: (stalls: Stall[]) => void;
  className?: string;
}

const CODE_RE = /^[A-Z0-9-]+$/;

const StallSearchBox: React.FC<StallSearchBoxProps> = ({ onFound, className = '' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const doSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setCount(null);
    const q = query.trim();
    if (!q) { setError('Enter stall code, name or category'); return; }

    setLoading(true);
    try {
      const looksLikeCode = CODE_RE.test(q.toUpperCase()) && !q.includes(' ');

      if (looksLikeCode) {
        try {
          const s = await getStallByCode(q.toUpperCase());
          onFound([s]);
          setCount(1);
          return;
        } catch (err) {
        }
      }

      const [byName, byCategory] = await Promise.all([
        searchStallsByName(q).catch(() => []),
        searchStallsByCategory(q).catch(() => []),
      ]);
      const mergedMap = new Map<number, Stall>();
      for (const s of [...byName, ...byCategory]) mergedMap.set(s.id, s);
      const merged = Array.from(mergedMap.values());
      onFound(merged);
      setCount(merged.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 w-2/4 ${className}`}>
      <form onSubmit={doSearch} className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by code, name or category"
          className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={100}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {loading && <LoadingSpinner size={20} label="Searching..." />}
      {error && <div className="text-xs text-red-600">{error}</div>}
      {count !== null && !loading && !error && (
        <div className="text-xs text-gray-600">{count} result{count === 1 ? '' : 's'}</div>
      )}
    </div>
  );
};

export default StallSearchBox;
