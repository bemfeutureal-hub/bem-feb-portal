import React, { useState, useMemo } from 'react';
import { useBEM } from '../../context/BEMContext';
import { ArrowLeft, ChevronRight, Search, Target, Calendar, MapPin, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ProgramKerjaPageProps {
  onBack: () => void;
}

export const ProgramKerjaPage: React.FC<ProgramKerjaPageProps> = ({ onBack }) => {
  const { programKerja, siteConfig, departments } = useBEM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Filtered proker
  const filteredProkers = useMemo(() => {
    return programKerja.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.picName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === 'Semua' || item.department === selectedDept;
      const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [programKerja, searchQuery, selectedDept, selectedStatus]);

  // Unique departments from actual proker + list of departments
  const deptOptions = useMemo(() => {
    const list = Array.from(new Set(programKerja.map((p) => p.department))).filter(Boolean);
    departments.forEach((d) => {
      if (!list.includes(d.name)) list.push(d.name);
    });
    return ['Semua', ...list];
  }, [programKerja, departments]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terlaksana':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Terlaksana
          </span>
        );
      case 'Sedang Berjalan':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Sedang Berjalan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Calendar className="w-3 h-3" />
            Akan Datang
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── TOP BAR / BREADCRUMB ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 hover:text-[#800016] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <span>Beranda</span>
            <ChevronRight className="w-3 h-3" />
            <span>Tentang Kami</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#800016] font-semibold">Program Kerja</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#800016] via-[#660012] to-[#40000b] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-3 text-rose-100">
            Katalog Agenda & Inovasi
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Program Kerja Kabinet
          </h1>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl leading-relaxed">
            Daftar lengkap program kerja, sasaran capaian, dan agenda nyata BEM FEB UTU ({siteConfig.period}) untuk kemaslahatan civitas akademika.
          </p>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-md p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari program kerja, indikator, atau penanggung jawab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#800016] focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <span className="text-zinc-400 font-medium mr-1 text-[11px]">Status:</span>
              {['Semua', 'Akan Datang', 'Sedang Berjalan', 'Terlaksana'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedStatus === st
                      ? 'bg-[#800016] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Department dropdown filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-zinc-400 font-medium text-[11px] shrink-0">Satuan:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full sm:w-64 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#800016]"
              >
                {deptOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRAM KERJA LIST ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-zinc-500 font-mono">
            Menampilkan <span className="font-bold text-zinc-900">{filteredProkers.length}</span> program kerja
          </p>
        </div>

        {filteredProkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProkers.map((proker) => (
              <div
                key={proker.id}
                className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] font-semibold text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-100 truncate max-w-[170px]">
                      {proker.department}
                    </span>
                    {getStatusBadge(proker.status)}
                  </div>

                  <h3 className="text-base font-bold text-zinc-950 mb-2 leading-snug">
                    {proker.title}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                    {proker.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
                  {proker.indicator && (
                    <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 mb-2">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                        Indikator Keberhasilan:
                      </span>
                      <p className="text-xs text-zinc-700 italic font-normal">
                        &ldquo;{proker.indicator}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{proker.targetDate || 'Jadwal Menyusul'}</span>
                    </span>
                    {proker.location && (
                      <span className="flex items-center gap-1.5 truncate max-w-[130px]">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{proker.location}</span>
                      </span>
                    )}
                  </div>

                  {proker.picName && (
                    <div className="flex items-center gap-1.5 text-zinc-500 pt-1">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>PIC: <strong className="text-zinc-700">{proker.picName}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-zinc-300 py-16 px-4 text-center">
            <Target className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-zinc-800 mb-1">
              Tidak ada program kerja yang cocok
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian, filter departemen, atau status pelaksanaan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
