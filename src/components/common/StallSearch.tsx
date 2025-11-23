import React, { useState } from 'react';
import { getStallByCode } from '../../api/stalls';
import type { Stall } from '../../api/stalls';
import LoadingSpinner from './LoadingSpinner';

interface StallSearchProps {
  onFound: (stall: Stall) => void;
  className?: string;
}

const StallSearch: React.FC<StallSearchProps> = ({ onFound, className = '' }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Stall | null>(null);

  const doSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setResult(null);
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Enter a stall code');
      return;
    }
    setLoading(true);
    try {
      const stall = await getStallByCode(trimmed);
      setResult(stall);
      onFound(stall);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>      
      <form onSubmit={doSearch} className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Search stall code (e.g. S001)"
          className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={20}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {loading && <LoadingSpinner size={24} label="Searching..." />}
      {error && <div className="text-xs text-red-600">{error}</div>}
     
    </div>
  );
};

export default StallSearch;
