import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Scale, 
  HelpCircle 
} from 'lucide-react';
import { REGULATION_ARTICLES_EXPLORER, SENA_IDENTITY } from '../data/senaData';

export const RegulationExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = ['todos', 'Generalidades', 'Derechos', 'Deberes', 'Prohibiciones', 'Faltas', 'Medidas', 'Comité', 'Etapas'];

  const filteredArticles = REGULATION_ARTICLES_EXPLORER.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Consulta Rápida de Normativa
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00324D] dark:text-slate-100 font-display">
              Explorador del Reglamento del Aprendiz
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Filtra y consulta en lenguaje claro los capítulos y artículos principales del nuevo reglamento SENA.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Scale className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Vigencia Plena en todo el territorio nacional
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palabra clave: plagio, carné, inasistencia, deserción, comité..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 focus:border-transparent outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Values & Symbols Quick Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-5 shadow-xs transition-colors duration-200">
        <h3 className="text-sm font-bold text-[#00324D] dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
          Código de Integridad Institucional SENA (7 Valores Fundamentales)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {SENA_IDENTITY.values.map((val, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/90 p-2.5 rounded-lg border border-emerald-200/60 dark:border-slate-700 shadow-2xs text-center">
              <span className="text-xs font-extrabold text-[#297a00] dark:text-emerald-400 block">{val.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{val.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art, idx) => (
          <div 
            key={idx}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#297a00] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {art.code}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {art.category}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#00324D] dark:text-slate-100">
              {art.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {art.content}
            </p>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-medium">No se encontraron artículos con el término ingresado.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('todos');
            }}
            className="text-xs font-bold text-[#39A900] dark:text-emerald-400 underline"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </div>
  );
};
