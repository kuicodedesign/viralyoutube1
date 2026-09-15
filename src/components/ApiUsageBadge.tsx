import { Zap } from 'lucide-react';

interface ApiUsageBadgeProps {
  quotaUsed: number;
  apiCalls: number;
  displayedCount: number;
}

export function ApiUsageBadge({ quotaUsed, apiCalls, displayedCount }: ApiUsageBadgeProps) {
  if (quotaUsed === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-700">
        <Zap className="w-3.5 h-3.5" />
        <span className="font-semibold">{quotaUsed}</span>
        <span>quota units usadas</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600">
        <span className="font-semibold">{apiCalls}</span>
        <span>llamadas a la API</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600">
        <span className="font-semibold">{displayedCount}</span>
        <span>videos mostrados</span>
      </div>
    </div>
  );
}
