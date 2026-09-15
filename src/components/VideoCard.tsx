import { ExternalLink, Users, Eye, Clock, Calendar, Globe, TrendingUp } from 'lucide-react';
import type { YouTubeVideo } from '@/types/youtube';

interface VideoCardProps {
  video: YouTubeVideo;
}

function formatNumber(n: number): string {
  if (n < 0) return 'Oculto';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function VideoCard({ video }: VideoCardProps) {
  const ratioPercent = (video.ratio * 100).toFixed(1);
  const ratioColor =
    video.ratio >= 0.5
      ? 'text-emerald-600 bg-emerald-50'
      : video.ratio >= 0.1
      ? 'text-amber-600 bg-amber-50'
      : 'text-gray-600 bg-gray-100';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-black/80 rounded-md backdrop-blur-sm">
          {video.duration}
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300"
        >
          <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors leading-snug mb-2"
        >
          {video.title}
        </a>

        <p className="text-xs text-gray-500 mb-3">{video.channelTitle}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <Stat icon={Eye} label="Views" value={formatNumber(video.viewCount)} />
          <Stat icon={Users} label="Subs" value={formatNumber(video.subscriberCount)} />
          <Stat icon={Clock} label="Duración" value={video.duration} />
          <Stat icon={Calendar} label="Fecha" value={formatDate(video.publishedAt)} />
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Globe className="w-3.5 h-3.5" />
            <span>{video.language}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${ratioColor}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {ratioPercent}%
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <span className="font-medium text-gray-900">{value}</span>
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
