import React from 'react';
import { useBEM } from '../../context/BEMContext';
import { ArrowLeft, ChevronRight, Shield, Target, Compass, Award, Users, BookOpen } from 'lucide-react';
import { formatLeaderDisplay } from '../../utils/leaderUtils';
import { PublicPage } from '../../App';

interface TentangKamiPageProps {
  onNavigate: (page: PublicPage) => void;
  onBack: () => void;
}

export const TentangKamiPage: React.FC<TentangKamiPageProps> = ({ onNavigate, onBack }) => {
  const { siteConfig } = useBEM();

  const ketua = formatLeaderDisplay(
    siteConfig.sambutan.ketuaName,
    siteConfig.sambutan.ketuaRole,
    siteConfig.sambutan.ketuaNim,
    'Ketua BEM FEB UTU'
  );
  const wakil = formatLeaderDisplay(
    siteConfig.sambutan.wakilName,
    siteConfig.sambutan.wakilRole,
    siteConfig.sambutan.wakilNim,
    'Wakil Ketua BEM FEB UTU'
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── BREADCRUMB / TOP BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200">
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
            <span className="text-[#800016] font-semibold">{siteConfig.cabinetName}</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#800016] via-[#660012] to-[#40000b] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-3 text-rose-100">
            Profil & Landasan Gerak Kabinet
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Kabinet {siteConfig.cabinetName}
          </h1>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl leading-relaxed mb-6">
            Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Teuku Umar — Masa Bakti {siteConfig.period}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('struktur-organisasi')}
              className="px-4 py-2 bg-white text-[#800016] font-bold rounded hover:bg-rose-50 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Struktur Organisasi & Teras</span>
            </button>
            <button
              onClick={() => onNavigate('program-kerja')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-medium rounded transition-colors border border-white/30 cursor-pointer flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>Program Kerja Kabinet</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Sambutan Presidium */}
        <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto Presidium Card */}
            <div className="lg:col-span-5">
              <div className="rounded-lg overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100">
                <img
                  src={siteConfig.sambutan.leadersImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'}
                  alt="Presidium BEM FEB UTU"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-4/3 object-cover"
                />
                <div className="p-4 bg-gradient-to-r from-[#800016] to-[#5a000f] text-white border-t border-rose-900/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border-b sm:border-b-0 sm:border-r border-rose-800/60 pb-2 sm:pb-0 sm:pr-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-300">
                        {ketua.role}
                      </span>
                      <p className="font-bold text-white text-sm leading-snug">
                        {ketua.name}
                      </p>
                      {ketua.nim && (
                        <p className="text-rose-200 text-[10px] font-mono mt-0.5">
                          NIM {ketua.nim}
                        </p>
                      )}
                    </div>
                    <div className="sm:pl-1 sm:text-right">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-300">
                        {wakil.role}
                      </span>
                      <p className="font-bold text-white text-sm leading-snug">
                        {wakil.name}
                      </p>
                      {wakil.nim && (
                        <p className="text-rose-200 text-[10px] font-mono mt-0.5">
                          NIM {wakil.nim}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pesan & Visi Kepemimpinan */}
            <div className="lg:col-span-7">
              <div className="text-xs text-[#800016] font-bold uppercase tracking-wider mb-2">
                Sambutan Pimpinan Eksekutif Mahasiswa
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mb-4">
                Menghubungkan Aspirasi, Menghadirkan Solusi Nyata
              </h2>

              <blockquote className="py-2 pl-4 border-l-3 border-[#800016] text-zinc-800 text-sm sm:text-base italic mb-5 leading-relaxed bg-rose-50/40 rounded-r">
                {siteConfig.sambutan.quote}
              </blockquote>

              <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-normal whitespace-pre-line">
                {siteConfig.sambutan.fullMessage}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Fakultas</span>
                  <span className="font-semibold text-zinc-900">{siteConfig.facultyName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Universitas</span>
                  <span className="font-semibold text-zinc-900">{siteConfig.universityName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Masa Bakti</span>
                  <span className="font-semibold text-zinc-900">{siteConfig.period}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#800016] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#800016] font-bold uppercase tracking-wider">Arah Gerak</span>
            <h3 className="text-xl font-bold text-zinc-950 mt-1 mb-4">Visi Kabinet</h3>
            <p className="text-sm text-zinc-700 leading-relaxed bg-rose-50/60 p-4 rounded-lg border border-rose-100 font-medium">
              &ldquo;{siteConfig.visi}&rdquo;
            </p>
          </div>

          <div className="md:col-span-7 bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#800016] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#800016] font-bold uppercase tracking-wider">Rencana Strategis</span>
            <h3 className="text-xl font-bold text-zinc-950 mt-1 mb-4">Misi Kabinet</h3>
            <div className="space-y-3">
              {siteConfig.misi.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/80">
                  <span className="font-mono text-xs text-[#800016] font-bold shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nilai-Nilai Dasar & Makna Filosofis */}
        <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs text-[#800016] font-bold uppercase tracking-wider">Prinsip Kerja</span>
            <h3 className="text-2xl font-bold text-zinc-950 mt-1">Nilai-Nilai Dasar BEM FEB UTU</h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Fondasi moral, etika, dan integritas yang memandu seluruh fungsionaris dalam melayani mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
              <div className="w-9 h-9 rounded-md bg-[#800016] text-white flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1.5">Integritas & Transparansi</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Menjunjung tinggi kejujuran dalam administrasi, keterbukaan laporan keuangan publik, dan akuntabilitas amanah kemahasiswaan.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
              <div className="w-9 h-9 rounded-md bg-[#800016] text-white flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1.5">Responsif & Berpihak</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Sigap merespons setiap keluhan, kendala sarana, maupun advokasi UKT mahasiswa melalui pendampingan nyata yang berkeadilan.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
              <div className="w-9 h-9 rounded-md bg-[#800016] text-white flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-zinc-900 mb-1.5">Kolaboratif & Prestatif</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Menjalin sinergi erat dengan Dekanat, Himpunan Mahasiswa Jurusan (HMJ), serta mendorong iklim riset dan kompetisi ilmiah.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
