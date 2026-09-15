import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import type { ApiOrder, SearchFilters, SortOption, VideoDurationFilter } from '@/types/youtube';
import { DEFAULT_FILTERS } from '@/types/youtube';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (updater: (prev: SearchFilters) => SearchFilters) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'ratio', label: 'Ratio Views/Subs' },
  { value: 'views', label: 'Más Vistas' },
  { value: 'subs', label: 'Más Suscriptores' },
  { value: 'date', label: 'Más Recientes' },
];

const API_ORDER_OPTIONS: { value: ApiOrder; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'viewCount', label: 'Más vistas' },
  { value: 'date', label: 'Más recientes' },
];

const DURATION_OPTIONS: { value: VideoDurationFilter; label: string }[] = [
  { value: '', label: 'Cualquiera' },
  { value: 'short', label: 'Cortos (< 4 min)' },
  { value: 'medium', label: 'Medios (4–20 min)' },
  { value: 'long', label: 'Largos (> 20 min)' },
];

export function FilterPanel({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  onReset,
}: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof SearchFilters, value: string) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilterCount = Object.entries(filters).filter(([key, v]) => {
    if (key === 'order') return v !== DEFAULT_FILTERS.order;
    return v !== '';
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          <span className="text-xs font-medium text-gray-400">idioma, subs, views</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">Ordenar resultados:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 border-t border-gray-100">
        <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-red-500">
          En la petición a YouTube
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Fecha, duración y orden se envían a la API al pulsar Buscar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
          <FilterSelect
            label="Orden de YouTube"
            value={filters.order}
            onChange={(v) => update('order', v)}
            options={API_ORDER_OPTIONS}
          />
          <FilterSelect
            label="Duración"
            value={filters.videoDuration}
            onChange={(v) => update('videoDuration', v)}
            options={DURATION_OPTIONS}
          />
          <FilterInput
            label="Publicados desde"
            value={filters.dateFrom}
            onChange={(v) => update('dateFrom', v)}
            type="date"
          />
          <FilterInput
            label="Publicados hasta"
            value={filters.dateTo}
            onChange={(v) => update('dateTo', v)}
            type="date"
          />
        </div>

        {expanded && (
          <>
            <p className="pt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sobre los resultados cargados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
              <FilterInput
                label="Idioma"
                value={filters.language}
                onChange={(v) => update('language', v)}
                placeholder="ej: en, es, fr"
              />
              <FilterInput
                label="Suscriptores mín."
                value={filters.minSubs}
                onChange={(v) => update('minSubs', v)}
                placeholder="0"
                type="number"
              />
              <FilterInput
                label="Suscriptores máx."
                value={filters.maxSubs}
                onChange={(v) => update('maxSubs', v)}
                placeholder="sin límite"
                type="number"
              />
              <FilterInput
                label="Views mín."
                value={filters.minViews}
                onChange={(v) => update('minViews', v)}
                placeholder="0"
                type="number"
              />
              <FilterInput
                label="Views máx."
                value={filters.maxViews}
                onChange={(v) => update('maxViews', v)}
                placeholder="sin límite"
                type="number"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value || 'any'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
