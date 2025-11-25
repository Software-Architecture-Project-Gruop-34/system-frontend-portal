import React, { useState } from 'react';
import { getStallsByStatus } from '../../api/stalls';
import type { Stall } from '../../api/stalls';
import LoadingSpinner from '../common/LoadingSpinner';

interface StallStatusFilterProps {
  onFilter: (stalls: Stall[] | null) => void;
  className?: string;
}

const StallStatusFilter: React.FC<StallStatusFilterProps> = ({ onFilter, className = '' }) => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const apply = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setCount(null);
    if (!status) { onFilter(null); return; }
    setLoading(true);
    try {
      const list = await getStallsByStatus(status);
      onFilter(list);
      setCount(list.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Status fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setStatus('');
    setCount(null);
    setError('');
    onFilter(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={apply} className="flex items-center gap-2">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 text-sm border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All status</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Apply'}
        </button>
        {status && (
          <button type="button" onClick={clear} className="px-2 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200">Clear</button>
        )}
      </form>
      {loading && <LoadingSpinner size={18} />}
      {error && <div className="text-xs text-red-600">{error}</div>}
      {count !== null && !loading && !error && (
        <div className="text-xs text-gray-600">{count} match{count === 1 ? '' : 'es'}</div>
      )}
    </div>
  );
};

export default StallStatusFilter;
