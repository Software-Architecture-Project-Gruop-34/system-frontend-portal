import React, { useState } from 'react';
import { searchStallsByName } from '../../api/stalls';
import type { Stall } from '../../api/stalls';
import LoadingSpinner from './LoadingSpinner';

interface StallNameSearchProps {
  onFound: (stalls: Stall[]) => void;
  className?: string;
}

const StallNameSearch: React.FC<StallNameSearchProps> = ({ onFound, className = '' }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Stall[] | null>(null);

  const doSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setResults(null);
    const q = name.trim();
    if (!q) { setError('Enter a stall name'); return; }
    setLoading(true);
    try {
      const list = await searchStallsByName(q);
      setResults(list);
      onFound(list);
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
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Search by name (e.g. Corner)"
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
      {results && (
        <div className="text-xs text-gray-600">
          {results.length} result{results.length === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
};

export default StallNameSearch;
