import { useState, type FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { YOUTUBE_CATEGORIES } from '@/types/youtube';

interface SearchBarProps {
  onSearch: (query: string, categoryId: string) => void;
  loading: boolean;
  initialQuery?: string;
  initialCategoryId?: string;
}

export function SearchBar({
  onSearch,
  loading,
  initialQuery = '',
  initialCategoryId = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);

  const canSearch = query.trim().length > 0 || categoryId !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSearch) onSearch(query.trim(), categoryId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
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
            placeholder="Palabras clave / Nombre del canal o video"
            disabled={loading}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Nicho / Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-3 text-sm bg-white border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all disabled:opacity-60 cursor-pointer"
            >
              {YOUTUBE_CATEGORIES.map((cat) => (
                <option key={cat.id || 'all'} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-gray-400">
              El nicho usa la categoría de YouTube; no exige que esa palabra esté en el título.
            </p>
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={loading || !canSearch}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
