export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  viewCount: number;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  language: string;
  url: string;
  ratio: number;
}

export interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
  totalResults: number;
  apiCalls: number;
  quotaUsed: number;
}

export interface SearchFilters {
  language: string;
  minSubs: string;
  maxSubs: string;
  minViews: string;
  maxViews: string;
  minDuration: string;
  maxDuration: string;
  dateFrom: string;
  dateTo: string;
}

export type SortOption = 'ratio' | 'views' | 'subs' | 'date';

export const DEFAULT_FILTERS: SearchFilters = {
  language: '',
  minSubs: '',
  maxSubs: '',
  minViews: '',
  maxViews: '',
  minDuration: '',
  maxDuration: '',
  dateFrom: '',
  dateTo: '',
};
