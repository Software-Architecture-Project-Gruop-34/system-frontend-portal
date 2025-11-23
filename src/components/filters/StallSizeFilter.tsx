import React, { useState } from 'react';
import { getStallsBySize } from '../../api/stalls';
import type { Stall } from '../../api/stalls';
import LoadingSpinner from '../common/LoadingSpinner';

interface StallSizeFilterProps {
  onFilter: (stalls: Stall[] | null) => void;
  className?: string;
}

const StallSizeFilter: React.FC<StallSizeFilterProps> = ({ onFilter, className = '' }) => {
  const [size, setSize] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const apply = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setCount(null);
    if (!size) { onFilter(null); return; }
    setLoading(true);
    try {
      const list = await getStallsBySize(size);
      onFilter(list);
      setCount(list.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Size fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setSize('');
    setCount(null);
    setError('');
    onFilter(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={apply} className="flex items-center gap-2">
        <select
          value={size}
          onChange={e => setSize(e.target.value)}
          className="px-3 py-2 text-sm border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All sizes</option>
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Apply'}
        </button>
        {size && (
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

export default StallSizeFilter;
