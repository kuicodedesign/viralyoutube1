import { useState, type FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialQuery?: string;
}

export function SearchBar({ onSearch, loading, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-gray-400 group-focus-within:text-red-500 transition-colors">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar videos en YouTube..."
          disabled={loading}
          className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
