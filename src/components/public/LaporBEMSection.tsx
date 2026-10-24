import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { ShieldCheck, Search, Lock, Clock, CheckCircle, ArrowUpRight, Send } from 'lucide-react';

const STEPS = [
  { num: '01', key: 'PELAPORAN',   title: 'Isi Laporan',         desc: 'Sampaikan aduan sarpras, akademik, atau UKT — dengan opsi anonim terjamin.' },
  { num: '02', key: 'VERIFIKASI',  title: 'Verifikasi Adkesma',  desc: 'Tim Adkesma BEM FEB UTU meninjau dalam waktu < 24 jam kerja.' },
  { num: '03', key: 'AUDIENSI',    title: 'Audiensi Dekanat',    desc: 'Pengawalan aspirasi ke Dekan, Wakil Dekan, atau Bagian Sarpras Kampus.' },
  { num: '04', key: 'RESOLUSI',    title: 'Resolusi Tercatat',   desc: 'Hasil penanganan dicatat dan dapat dilacak secara privat menggunakan kode tiket.' },
];

export const LaporBEMSection: React.FC = () => {
  const { siteConfig, setIsLaporModalOpen, setIsTrackerModalOpen, setTrackingTicketId } = useBEM();
  const [searchCode, setSearchCode] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setTrackingTicketId(searchCode.trim().toUpperCase());
      setIsTrackerModalOpen(true);
    }
  };

  const visuals        = siteConfig.visuals;
  const sectionBg      = visuals?.laporSectionBackground || '#fcfcfd';
  const laporTitle     = visuals?.laporTitle    || 'Lapor BEM FEB Universitas Teuku Umar';
  const laporSubtitle  = visuals?.laporSubtitle || 'Layanan Advokasi Mahasiswa FEB UTU';
  const laporDesc      = visuals?.laporDescription
    || 'Kanal resmi pelaporan fasilitas sarana kampus, kendala akademik, audiensi banding UKT, dan pendampingan advokasi mahasiswa FEB UTU — aman, privat, dan dapat dilacak hanya oleh Anda.';
  const laporBtn       = visuals?.laporCtaButtonText || '+ Buat Aduan';
  const accentColor    = visuals?.logoEmblemBg || '#800016';

  return (
    <section
      id="lapor-bem"
      style={{ backgroundColor: sectionBg }}
      className="py-14 sm:py-20 border-b border-zinc-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div style={{ color: accentColor }} className="text-xs font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{laporSubtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mb-3 [text-wrap:balance]">
              {laporTitle}
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">{laporDesc}</p>

            {/* Privacy badge */}
            <div className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3" />
              Pelacakan status bersifat privat — hanya Anda yang dapat melihat dengan kode tiket Anda
            </div>
          </div>

          <button
            onClick={() => setIsLaporModalOpen(true)}
            style={{ backgroundColor: accentColor }}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{laporBtn}</span>
          </button>
        </div>

        {/* ── 4 Steps ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className="relative bg-white p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all group"
            >
              {/* connector line on lg */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-7 -right-2 w-4 h-px bg-zinc-200 z-10" />
              )}
              <span className="font-mono text-[10px] font-bold block mb-2" style={{ color: accentColor }}>
                {step.num} / {step.key}
              </span>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">{step.title}</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Private Tracker ── */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: tracker input */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-zinc-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Lock className="w-4 h-4" style={{ color: accentColor }} />
                <h3 className="text-sm font-bold text-zinc-950">Lacak Status Aduan Anda</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                Masukkan kode tiket yang Anda terima setelah mengajukan aduan.
                Status aduan <strong className="text-zinc-800">hanya dapat dilihat oleh Anda</strong> — tidak tampil ke publik.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kode tiket, contoh: ADU-UTU-123"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-mono uppercase bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#800016] text-zinc-900 tracking-wider transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: accentColor }}
                  className="w-full py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Cari & Verifikasi Identitas
                </button>
              </form>

              <p className="text-[11px] text-zinc-400 mt-3 text-center">
                Belum punya aduan?{' '}
                <button onClick={() => setIsLaporModalOpen(true)} style={{ color: accentColor }} className="font-semibold hover:underline">
                  Buat aduan baru
                </button>
              </p>
            </div>

            {/* Right: highlights */}
            <div className="p-6 sm:p-8 bg-zinc-50/60">
              <h3 className="text-sm font-bold text-zinc-950 mb-4">Mengapa Lapor BEM FEB?</h3>
              <ul className="space-y-3.5">
                {[
                  { icon: <Lock className="w-4 h-4" />,          title: 'Privasi Terjamin',       desc: 'Opsi anonim tersedia. Status aduan hanya bisa dilihat pemilik tiket.' },
                  { icon: <Clock className="w-4 h-4" />,          title: 'Respons < 24 Jam',       desc: 'Adkesma BEM FEB UTU memverifikasi setiap laporan dalam 1 hari kerja.' },
                  { icon: <CheckCircle className="w-4 h-4" />,    title: 'Ditindaklanjuti Nyata',  desc: 'Setiap aduan dikawal hingga audiensi dengan pimpinan dekanat.' },
                  { icon: <ArrowUpRight className="w-4 h-4" />,   title: 'Lacak Progres Real-time', desc: 'Pantau status dari verifikasi hingga resolusi kapan saja.' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{item.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
