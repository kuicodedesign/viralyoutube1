import { Youtube, Search } from 'lucide-react';

interface EmptyStateProps {
  hasSearched: boolean;
}

export function EmptyState({ hasSearched }: EmptyStateProps) {
  if (hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron resultados</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Intenta con otra búsqueda o ajusta los filtros para ampliar los criterios.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-500/30 mb-6">
        <Youtube className="w-10 h-10 text-white" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Busca videos en YouTube</h2>
      <p className="text-gray-500 max-w-md leading-relaxed">
        Busca por palabras clave o por nicho (categoría de YouTube) y analiza el
        rendimiento: views, suscriptores, ratio views/subs, duración e idioma.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-2xl">
        <FeatureBadge label="Ratio Views/Subs" />
        <FeatureBadge label="Filtros avanzados" />
        <FeatureBadge label="Datos del canal" />
        <FeatureBadge label="Ordenamiento" />
      </div>
    </div>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <div className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl">
      {label}
    </div>
  );
}
