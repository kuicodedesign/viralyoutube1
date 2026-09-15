import { Loader2 } from 'lucide-react';
import type { YouTubeVideo } from '@/types/youtube';
import { VideoCard } from './VideoCard';

interface VideoListProps {
  videos: YouTubeVideo[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function VideoList({ videos, loading, hasMore, onLoadMore }: VideoListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      )}

      {!loading && hasMore && videos.length > 0 && (
        <div className="flex justify-center py-6">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
          >
            Cargar más videos
          </button>
        </div>
      )}
    </div>
  );
}
