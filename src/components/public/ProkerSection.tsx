import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Calendar, MapPin } from 'lucide-react';

export const ProkerSection: React.FC = () => {
  const { programKerja, siteConfig } = useBEM();
  const [statusFilter, setStatusFilter] = useState('Semua');

  const filteredProkers = programKerja.filter(
    (p) => statusFilter === 'Semua' || p.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terlaksana':
        return 'text-emerald-700 bg-emerald-50/70 border-emerald-200';
      case 'Sedang Berjalan':
        return 'text-blue-700 bg-blue-50/70 border-blue-200';
      case 'Akan Datang':
      default:
        return 'text-zinc-600 bg-zinc-100 border-zinc-200';
    }
  };

  return (
    <section
      id="program-kerja"
      style={{ backgroundColor: siteConfig.visuals?.prokerSectionBackground || '#ffffff' }}
      className="py-14 sm:py-20 border-b border-zinc-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">
              Kalender Kegiatan
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight [text-wrap:balance]">
              Program Kerja Unggulan
            </h2>
          </div>

          <div className="flex flex-wrap gap-1">
            {['Semua', 'Akan Datang', 'Sedang Berjalan', 'Terlaksana'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-zinc-950 text-white font-medium'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProkers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-400 text-sm bg-zinc-50 rounded border border-dashed border-zinc-200">
              Tidak ada program kerja untuk filter ini.
            </div>
          ) : (
            filteredProkers.map((proker) => (
              <div
                key={proker.id}
                className="p-5 bg-white border border-zinc-200/80 rounded hover:border-zinc-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono text-zinc-500 font-medium truncate mr-2">
                      {proker.department}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${getStatusBadge(
                        proker.status
                      )}`}
                    >
                      {proker.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-950 mb-1.5">{proker.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-4 font-normal">
                    {proker.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-zinc-700">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{proker.targetDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-700">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{proker.location}</span>
                    </span>
                  </div>

                  {proker.indicator && (
                    <div className="text-[10px] text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-200/60 font-sans">
                      <strong className="text-zinc-800 font-medium">Target: </strong>
                      <span>{proker.indicator}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
