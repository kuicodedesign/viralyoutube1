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

export type ApiOrder = 'relevance' | 'viewCount' | 'date';
export type VideoDurationFilter = '' | 'short' | 'medium' | 'long';

export interface YouTubeSearchParams {
  query: string;
  categoryId?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  videoDuration?: Exclude<VideoDurationFilter, ''>;
  order?: ApiOrder;
  pageToken?: string;
}

export interface SearchFilters {
  language: string;
  minSubs: string;
  maxSubs: string;
  minViews: string;
  maxViews: string;
  videoDuration: VideoDurationFilter;
  dateFrom: string;
  dateTo: string;
  order: ApiOrder;
}

export type SortOption = 'ratio' | 'views' | 'subs' | 'date';

export const DEFAULT_FILTERS: SearchFilters = {
  language: '',
  minSubs: '',
  maxSubs: '',
  minViews: '',
  maxViews: '',
  videoDuration: '',
  dateFrom: '',
  dateTo: '',
  order: 'relevance',
};

export const YOUTUBE_CATEGORIES: { id: string; label: string }[] = [
  { id: '', label: 'Todos los nichos' },
  { id: '1', label: 'Cine y animación' },
  { id: '2', label: 'Autos y vehículos' },
  { id: '10', label: 'Música' },
  { id: '15', label: 'Mascotas y animales' },
  { id: '17', label: 'Deportes' },
  { id: '19', label: 'Viajes y eventos' },
  { id: '20', label: 'Videojuegos' },
  { id: '22', label: 'Personas y blogs' },
  { id: '23', label: 'Comedia' },
  { id: '24', label: 'Entretenimiento' },
  { id: '25', label: 'Noticias y política' },
  { id: '26', label: 'Cómo hacerlo y estilo' },
  { id: '27', label: 'Educación' },
  { id: '28', label: 'Ciencia y tecnología' },
  { id: '29', label: 'ONG y activismo' },
];
