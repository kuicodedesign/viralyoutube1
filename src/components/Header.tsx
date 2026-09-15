import { Youtube } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
              <Youtube className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none tracking-tight">
                YouTube Researcher
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Análisis de videos y canales</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
