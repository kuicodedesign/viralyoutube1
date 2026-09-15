import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { VideoList } from '@/components/VideoList';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ApiUsageBadge } from '@/components/ApiUsageBadge';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';
import { isApiKeyConfigured } from '@/lib/api';
import { DEFAULT_FILTERS, type SearchFilters, type SortOption } from '@/types/youtube';

function App() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('ratio');
  const [searchQuery, setSearchQuery] = useState('');

  const apiKeyMissing = !isApiKeyConfigured();

  const {
    displayedVideos,
    loading,
    error,
    hasSearched,
    hasMore,
    quotaUsed,
    totalApiCalls,
    displayedCount,
    search,
    loadMore,
    reapplyFiltersAndSort,
  } = useYouTubeSearch();

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      search(query, filters, sortBy);
    },
    [search, filters, sortBy]
  );

  const handleFiltersChange = useCallback(
    (newFilters: SearchFilters) => {
      setFilters(newFilters);
      if (hasSearched) reapplyFiltersAndSort(newFilters, sortBy);
    },
    [hasSearched, sortBy, reapplyFiltersAndSort]
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSortBy(newSort);
      if (hasSearched) reapplyFiltersAndSort(filters, newSort);
    },
    [hasSearched, filters, reapplyFiltersAndSort]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    if (hasSearched) reapplyFiltersAndSort(DEFAULT_FILTERS, sortBy);
  }, [hasSearched, sortBy, reapplyFiltersAndSort]);

  const handleLoadMore = useCallback(() => {
    loadMore(filters, sortBy);
  }, [loadMore, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {apiKeyMissing && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 shrink-0">
              <span className="text-amber-600 font-bold text-sm">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Falta la API key de YouTube</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Añade tu API key de YouTube Data API v3 en la variable{' '}
                <code className="px-1.5 py-0.5 bg-amber-100 rounded text-xs font-mono">
                  VITE_YOUTUBE_API_KEY
                </code>{' '}
                del archivo <code className="px-1.5 py-0.5 bg-amber-100 rounded text-xs font-mono">.env</code> para empezar a buscar.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {!hasSearched && (
            <div className="text-center mb-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Investigador de YouTube
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Encuentra videos y analiza su rendimiento con métricas detalladas:
                ratio views/suscriptores, duración, idioma y más.
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto w-full">
            <SearchBar onSearch={handleSearch} loading={loading} initialQuery={searchQuery} />
          </div>

          {hasSearched && (
            <div className="flex flex-col gap-4">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onReset={handleResetFilters}
              />
              <ApiUsageBadge
                quotaUsed={quotaUsed}
                apiCalls={totalApiCalls}
                displayedCount={displayedCount}
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          {error ? (
            <ErrorState message={error} />
          ) : displayedVideos.length === 0 && !loading ? (
            <EmptyState hasSearched={hasSearched} />
          ) : (
            <VideoList
              videos={displayedVideos}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
