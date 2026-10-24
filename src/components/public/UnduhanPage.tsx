import React, { useState, useMemo } from 'react';
import { useBEM } from '../../context/BEMContext';
import { ArrowLeft, ChevronRight, Search, Download, FileText, FileSpreadsheet, FileCode, Archive, Calendar, HardDrive, CheckCircle } from 'lucide-react';
import { DownloadItem } from '../../types';

interface UnduhanPageProps {
  onBack: () => void;
}

export const UnduhanPage: React.FC<UnduhanPageProps> = ({ onBack }) => {
  const { downloads, siteConfig } = useBEM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'SOP & Regulasi', 'Template Surat', 'Panduan UKT', 'LPJ & Anggaran'];

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [downloads, searchQuery, selectedCategory]);

  const getFileIcon = (fileType: string) => {
    const ft = fileType.toUpperCase();
    if (ft.includes('XLS') || ft.includes('SHEET')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    if (ft.includes('ZIP') || ft.includes('RAR')) {
      return <Archive className="w-5 h-5 text-amber-600" />;
    }
    return <FileText className="w-5 h-5 text-[#800016]" />;
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
            <span>Informasi Publik</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#800016] font-semibold">Unduhan Dokumen</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#800016] via-[#660012] to-[#40000b] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-3 text-rose-100">
            Keterbukaan Informasi & Administrasi
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Pusat Unduhan & Dokumen
          </h1>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl leading-relaxed">
            Akses resmi berkas Standar Operasional Prosedur (SOP), format persuratan ormawa, berkas advokasi UKT, dan arsip pertanggungjawaban BEM FEB UTU.
          </p>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-md p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari nama dokumen, SOP, template persuratan, atau regulasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#800016] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide text-xs pt-2 border-t border-zinc-100">
            <span className="text-zinc-400 font-medium mr-1 text-[11px]">Kategori:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#800016] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DOCUMENTS LIST ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-zinc-500 font-mono">
            Menampilkan <span className="font-bold text-zinc-900">{filteredDownloads.length}</span> berkas dokumen
          </p>
        </div>

        {filteredDownloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDownloads.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-mono font-semibold text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mb-1">
                      {doc.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-950 leading-snug truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1.5">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{doc.fileSize || 'N/A'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{doc.updatedDate || 'Terbaru'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-zinc-500">
                    Format: {doc.fileType}
                  </span>
                  <a
                    href={doc.downloadUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800016] text-white text-xs font-medium rounded-lg hover:bg-[#600010] transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Berkas</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-zinc-300 py-16 px-4 text-center">
            <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-zinc-800 mb-1">
              Tidak ada dokumen yang ditemukan
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori dokumen yang berbeda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
