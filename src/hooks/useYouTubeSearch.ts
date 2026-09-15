import { useState, useCallback, useRef } from 'react';
import type {
  YouTubeVideo,
  SearchFilters,
  SortOption,
  YouTubeSearchParams,
} from '@/types/youtube';
import { searchYouTube } from '@/lib/api';

function toSearchParams(
  query: string,
  categoryId: string,
  filters: SearchFilters,
  pageToken?: string
): YouTubeSearchParams {
  return {
    query,
    categoryId: categoryId || undefined,
    publishedAfter: filters.dateFrom || undefined,
    publishedBefore: filters.dateTo || undefined,
    videoDuration: filters.videoDuration || undefined,
    order: filters.order,
    pageToken,
  };
}

export function useYouTubeSearch() {
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [rawVideos, setRawVideos] = useState<YouTubeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [totalApiCalls, setTotalApiCalls] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const currentQueryRef = useRef('');
  const currentCategoryRef = useRef('');
  const currentApiFiltersRef = useRef<SearchFilters | null>(null);
  const rawVideosRef = useRef<YouTubeVideo[]>([]);
  const isLoadingMoreRef = useRef(false);

  const hasMore = nextPageToken !== null;

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
    async (query: string, categoryId: string, filters: SearchFilters, sortBy: SortOption) => {
      if (!query.trim() && !categoryId) return;
      setLoading(true);
      setError(null);
      setHasSearched(true);
      currentQueryRef.current = query;
      currentCategoryRef.current = categoryId;
      currentApiFiltersRef.current = filters;
      setNextPageToken(null);

      try {
        const data = await searchYouTube(toSearchParams(query, categoryId, filters));
        setNextPageToken(data.nextPageToken);
        setTotalResults(data.totalResults);
        setQuotaUsed(data.quotaUsed);
        setTotalApiCalls(data.apiCalls);

        rawVideosRef.current = data.videos;
        setRawVideos(data.videos);
        const filtered = applyFilters(data.videos, filters);
        setAllVideos(sortVideos(filtered, sortBy));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        rawVideosRef.current = [];
        setAllVideos([]);
        setRawVideos([]);
        setNextPageToken(null);
      } finally {
        setLoading(false);
      }
    },
    [applyFilters, sortVideos]
  );

  const loadMore = useCallback(
    async (filters: SearchFilters, sortBy: SortOption) => {
      if (loading || isLoadingMoreRef.current || !nextPageToken) return;
      isLoadingMoreRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const apiFilters = currentApiFiltersRef.current ?? filters;
        const data = await searchYouTube(
          toSearchParams(
            currentQueryRef.current,
            currentCategoryRef.current,
            apiFilters,
            nextPageToken
          )
        );
        setNextPageToken(data.nextPageToken);
        setQuotaUsed((prev) => prev + data.quotaUsed);
        setTotalApiCalls((prev) => prev + data.apiCalls);

        const seen = new Set(rawVideosRef.current.map((v) => v.videoId));
        const incoming = data.videos.filter((v) => !seen.has(v.videoId));
        const combinedRaw = [...rawVideosRef.current, ...incoming];
        rawVideosRef.current = combinedRaw;
        setRawVideos(combinedRaw);
        setAllVideos(sortVideos(applyFilters(combinedRaw, filters), sortBy));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
        isLoadingMoreRef.current = false;
      }
    },
    [loading, nextPageToken, applyFilters, sortVideos]
  );

  const reapplyFiltersAndSort = useCallback(
    (filters: SearchFilters, sortBy: SortOption) => {
      const filtered = applyFilters(rawVideos, filters);
      setAllVideos(sortVideos(filtered, sortBy));
    },
    [rawVideos, applyFilters, sortVideos]
  );

  const reset = useCallback(() => {
    rawVideosRef.current = [];
    setAllVideos([]);
    setRawVideos([]);
    setError(null);
    setHasSearched(false);
    setQuotaUsed(0);
    setTotalApiCalls(0);
    setTotalResults(0);
    setNextPageToken(null);
    currentQueryRef.current = '';
    currentCategoryRef.current = '';
    currentApiFiltersRef.current = null;
  }, []);

  return {
    displayedVideos: allVideos,
    loading,
    error,
    hasSearched,
    hasMore,
    nextPageToken,
    quotaUsed,
    totalApiCalls,
    totalResults,
    displayedCount: allVideos.length,
    search,
    loadMore,
    reapplyFiltersAndSort,
    reset,
  };
}
