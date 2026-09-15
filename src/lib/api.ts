import type { YouTubeSearchResponse } from '@/types/youtube';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface SearchItem {
  id: { videoId: string };
  snippet: {
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
  };
}

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
    defaultLanguage?: string;
    defaultAudioLanguage?: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

interface ChannelItem {
  id: string;
  statistics: {
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
  };
}

function getApiKey(): string {
  return import.meta.env.VITE_YOUTUBE_API_KEY ?? '';
}

export function isApiKeyConfigured(): boolean {
  return getApiKey().trim().length > 0;
}

function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export async function searchYouTube(
  query: string,
  pageToken?: string
): Promise<YouTubeSearchResponse> {
  const apiKey = getApiKey();
  if (!apiKey.trim()) {
    throw new Error('Falta la API key de YouTube. Configura VITE_YOUTUBE_API_KEY en el archivo .env');
  }

  let apiCalls = 0;
  let quotaUsed = 0;

  const searchParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    type: 'video',
    maxResults: '50',
    q: query,
  });
  if (pageToken) searchParams.set('pageToken', pageToken);

  const searchRes = await fetch(`${BASE_URL}/search?${searchParams}`);
  apiCalls++;
  quotaUsed += 100;

  if (!searchRes.ok) {
    const errBody = await searchRes.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `YouTube search failed (${searchRes.status})`);
  }

  const searchData = await searchRes.json();
  const searchItems: SearchItem[] = searchData.items || [];

  if (searchItems.length === 0) {
    return { videos: [], nextPageToken: null, totalResults: 0, apiCalls, quotaUsed };
  }

  const videoIds = searchItems.map((v) => v.id.videoId).filter(Boolean);
  const channelIds = [...new Set(searchItems.map((v) => v.snippet.channelId))];

  const videoParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
  });

  const videoRes = await fetch(`${BASE_URL}/videos?${videoParams}`);
  apiCalls++;
  quotaUsed += 1;

  if (!videoRes.ok) {
    const errBody = await videoRes.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `YouTube videos fetch failed (${videoRes.status})`);
  }

  const videoData = await videoRes.json();
  const videos: VideoItem[] = videoData.items || [];

  const channelParams = new URLSearchParams({
    key: apiKey,
    part: 'statistics',
    id: channelIds.join(','),
  });

  const channelRes = await fetch(`${BASE_URL}/channels?${channelParams}`);
  apiCalls++;
  quotaUsed += 1;

  let channelMap: Record<string, number> = {};
  if (channelRes.ok) {
    const channelData = await channelRes.json();
    const channelItems: ChannelItem[] = channelData.items || [];
    for (const ch of channelItems) {
      if (!ch.statistics.hiddenSubscriberCount) {
        channelMap[ch.id] = parseInt(ch.statistics.subscriberCount, 10);
      } else {
        channelMap[ch.id] = -1;
      }
    }
  }

  const results = videos.map((v) => {
    const subs = channelMap[v.snippet.channelId] ?? 0;
    const views = parseInt(v.statistics.viewCount, 10);
    const durationSeconds = parseDuration(v.contentDetails.duration);
    const language =
      v.snippet.defaultLanguage ||
      v.snippet.defaultAudioLanguage ||
      'Unknown';

    return {
      videoId: v.id,
      title: v.snippet.title,
      thumbnail:
        v.snippet.thumbnails?.medium?.url ||
        v.snippet.thumbnails?.high?.url ||
        v.snippet.thumbnails?.default?.url ||
        '',
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      subscriberCount: subs,
      viewCount: views,
      duration: formatDuration(durationSeconds),
      durationSeconds,
      publishedAt: v.snippet.publishedAt,
      language,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      ratio: subs > 0 ? views / subs : 0,
    };
  });

  return {
    videos: results,
    nextPageToken: searchData.nextPageToken || null,
    totalResults: searchData.pageInfo?.totalResults || 0,
    apiCalls,
    quotaUsed,
  };
}
