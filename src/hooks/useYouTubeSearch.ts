import { useState, useCallback, useRef } from 'react';
import type { YouTubeVideo, SearchFilters, SortOption } from '@/types/youtube';
import { searchYouTube } from '@/lib/api';

const PAGE_SIZE = 10;

export function useYouTubeSearch() {
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [totalApiCalls, setTotalApiCalls] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const nextPageTokenRef = useRef<string | null>(null);
  const currentQueryRef = useRef<string>('');
  const isLoadingMoreRef = useRef(false);

  const displayedVideos = allVideos.slice(0, displayedCount);
  const hasMore = displayedCount < allVideos.length || nextPageTokenRef.current !== null;

  const applyFilters = useCallback(
    (videos: YouTubeVideo[], filters: SearchFilters): YouTubeVideo[] => {
      return videos.filter((v) => {
        if (filters.language && v.language !== filters.language) return false;

        if (filters.minSubs && v.subscriberCount >= 0) {
          if (v.subscriberCount < parseInt(filters.minSubs, 10)) return false;
        }
        if (filters.maxSubs && v.subscriberCount >= 0) {
          if (v.subscriberCount > parseInt(filters.maxSubs, 10)) return false;
        }

        if (filters.minViews && v.viewCount < parseInt(filters.minViews, 10)) return false;
        if (filters.maxViews && v.viewCount > parseInt(filters.maxViews, 10)) return false;

        if (filters.minDuration && v.durationSeconds < parseInt(filters.minDuration, 10)) return false;
        if (filters.maxDuration && v.durationSeconds > parseInt(filters.maxDuration, 10)) return false;

        if (filters.dateFrom) {
          const videoDate = v.publishedAt.split('T')[0];
          if (videoDate < filters.dateFrom) return false;
        }
        if (filters.dateTo) {
          const videoDate = v.publishedAt.split('T')[0];
          if (videoDate > filters.dateTo) return false;
        }

        return true;
      });
    },
    []
  );

  const sortVideos = useCallback((videos: YouTubeVideo[], sortBy: SortOption): YouTubeVideo[] => {
    const sorted = [...videos];
    switch (sortBy) {
      case 'ratio':
        return sorted.sort((a, b) => b.ratio - a.ratio);
      case 'views':
        return sorted.sort((a, b) => b.viewCount - a.viewCount);
      case 'subs':
        return sorted.sort((a, b) => b.subscriberCount - a.subscriberCount);
      case 'date':
        return sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      default:
        return sorted;
    }
  }, []);

  const search = useCallback(
    async (query: string, filters: SearchFilters, sortBy: SortOption) => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);
      setHasSearched(true);
      currentQueryRef.current = query;

      try {
        const data = await searchYouTube(query);
        nextPageTokenRef.current = data.nextPageToken;
        setTotalResults(data.totalResults);
        setQuotaUsed(data.quotaUsed);
        setTotalApiCalls(data.apiCalls);

        const filtered = applyFilters(data.videos, filters);
        const sorted = sortVideos(filtered, sortBy);
        setAllVideos(sorted);
        setDisplayedCount(Math.min(PAGE_SIZE, sorted.length));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAllVideos([]);
        setDisplayedCount(0);
      } finally {
        setLoading(false);
      }
    },
    [applyFilters, sortVideos]
  );

  const loadMore = useCallback(
    async (filters: SearchFilters, sortBy: SortOption) => {
      if (loading || isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setLoading(true);
      setError(null);

      try {
        if (displayedCount + PAGE_SIZE <= allVideos.length) {
          setDisplayedCount(displayedCount + PAGE_SIZE);
        } else if (nextPageTokenRef.current) {
          const data = await searchYouTube(currentQueryRef.current, nextPageTokenRef.current);
          nextPageTokenRef.current = data.nextPageToken;
          setQuotaUsed((prev) => prev + data.quotaUsed);
          setTotalApiCalls((prev) => prev + data.apiCalls);

          const filtered = applyFilters(data.videos, filters);
          const combined = [...allVideos, ...filtered];
          const sorted = sortVideos(combined, sortBy);
          setAllVideos(sorted);
          setDisplayedCount(Math.min(displayedCount + PAGE_SIZE, sorted.length));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
        isLoadingMoreRef.current = false;
      }
    },
    [allVideos, displayedCount, loading, applyFilters, sortVideos]
  );

  const reapplyFiltersAndSort = useCallback(
    (filters: SearchFilters, sortBy: SortOption) => {
      const filtered = applyFilters(allVideos, filters);
      const sorted = sortVideos(filtered, sortBy);
      setAllVideos(sorted);
      setDisplayedCount(Math.min(displayedCount, sorted.length));
    },
    [allVideos, displayedCount, applyFilters, sortVideos]
  );

  const reset = useCallback(() => {
    setAllVideos([]);
    setDisplayedCount(0);
    setError(null);
    setHasSearched(false);
    setQuotaUsed(0);
    setTotalApiCalls(0);
    setTotalResults(0);
    nextPageTokenRef.current = null;
    currentQueryRef.current = '';
  }, []);

  return {
    displayedVideos,
    loading,
    error,
    hasSearched,
    hasMore,
    quotaUsed,
    totalApiCalls,
    totalResults,
    displayedCount,
    search,
    loadMore,
    reapplyFiltersAndSort,
    reset,
  };
}
