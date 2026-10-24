import React from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  ShieldAlert,
  FileText,
  Calendar,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    siteConfig,
    laporTickets,
    posts,
    programKerja,
    setAdminTab,
  } = useBEM();

  const pendingTickets = laporTickets.filter((t) => t.status === 'Menunggu Verifikasi');
  const inProgressTickets = laporTickets.filter(
    (t) => t.status === 'Diproses Advokesma' || t.status === 'Audiensi Dekanat'
  );
  const resolvedTickets = laporTickets.filter((t) => t.status === 'Selesai Ditindaklanjuti');
  const publishedPosts = posts.filter((p) => p.status === 'published');

  return (
    <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Dashboard</div>
          <h1 className="text-xl font-semibold text-zinc-950 tracking-tight">
            Dashboard Pengurus & Manajemen Konten
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ringkasan status portal {siteConfig.cabinetName} ({siteConfig.period}) Universitas Teuku Umar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('lapor')}
            className="px-3 py-1.5 bg-[#800016] hover:bg-[#680012] text-white rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kelola Lapor BEM ({laporTickets.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('customizer')}
            className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <span>Kustomisasi Web</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if there are pending tickets */}
      {pendingTickets.length > 0 && (
        <div className="p-3.5 bg-zinc-100 border border-zinc-300 rounded flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-semibold text-zinc-900">
              {pendingTickets.length} Laporan Mahasiswa Baru
            </span>
            <span className="text-zinc-500">· Menunggu verifikasi awal Biro Advokesma.</span>
          </div>
          <button
            onClick={() => setAdminTab('lapor')}
            className="text-zinc-950 underline hover:text-black font-medium text-xs cursor-pointer"
          >
            Tinjau Sekarang →
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lapor Masuk */}
        <div className="p-4 bg-white rounded border border-zinc-200">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-500">Total Aduan Masuk</span>
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div className="text-xl font-medium font-mono text-zinc-950 tabular-nums">
            {laporTickets.length}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 font-mono">
            <span>{pendingTickets.length} verifikasi</span>
            <span>·</span>
            <span>{inProgressTickets.length} diproses</span>
          </div>
        </div>

        {/* Lapor Selesai */}
        <div className="p-4 bg-white rounded border border-zinc-200">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-500">Tuntas Advokasi</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-medium font-mono text-zinc-950 tabular-nums">
            {resolvedTickets.length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Transparan di portal publik
          </div>
        </div>

        {/* Total Artikel */}
        <div className="p-4 bg-white rounded border border-zinc-200">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-500">Artikel Warta</span>
            <FileText className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div className="text-xl font-medium font-mono text-zinc-950 tabular-nums">
            {publishedPosts.length} Pos
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">
            {posts.reduce((acc, p) => acc + p.views, 0)} tayangan pembaca
          </div>
        </div>

        {/* Proker Aktif */}
        <div className="p-4 bg-white rounded border border-zinc-200">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-500">Program Kerja</span>
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div className="text-xl font-medium font-mono text-zinc-950 tabular-nums">
            {programKerja.length} Agenda
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {programKerja.filter((p) => p.status === 'Terlaksana').length} terlaksana
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col Left: Recent Tickets Table */}
        <div className="lg:col-span-7 bg-white rounded border border-zinc-200 overflow-hidden">
          <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-900">Aduan Mahasiswa Terkini</h3>
            <button
              onClick={() => setAdminTab('lapor')}
              className="text-[11px] text-zinc-600 hover:text-zinc-950 font-medium cursor-pointer"
            >
              Lihat Semua ({laporTickets.length}) →
            </button>
          </div>

          <div className="divide-y divide-zinc-100 text-xs">
            {laporTickets.slice(0, 5).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setAdminTab('lapor')}
                className="p-3 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 mb-0.5">
                    <span className="font-semibold text-zinc-800">{ticket.id}</span>
                    <span>·</span>
                    <span>{ticket.category}</span>
                  </div>
                  <p className="font-medium text-zinc-900 truncate text-xs">{ticket.title}</p>
                  <p className="text-zinc-400 text-[10px] truncate">
                    {ticket.reporterName} ({ticket.reporterProdi})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border border-zinc-200 text-zinc-700 bg-zinc-50">
                    {ticket.status}
                  </span>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {ticket.createdAt.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col Right: Quick Actions & Recent Posts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded border border-zinc-200 p-4">
            <h3 className="text-xs font-semibold text-zinc-900 mb-2.5">Aksi Cepat Pengurus</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setAdminTab('posts')}
                className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-zinc-900 mb-0.5">+ Pos Baru</div>
                <div className="text-[10px] text-zinc-400">Tulis warta atau kajian</div>
              </button>

              <button
                onClick={() => setAdminTab('proker')}
                className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-zinc-900 mb-0.5">+ Proker Baru</div>
                <div className="text-[10px] text-zinc-400">Jadwalkan agenda</div>
              </button>

              <button
                onClick={() => setAdminTab('cabinet')}
                className="p-2.5 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 rounded text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-[#800016] mb-0.5">+ Dept & Kadep</div>
                <div className="text-[10px] text-zinc-500">Tambah departemen & ketua</div>
              </button>

              <button
                onClick={() => setAdminTab('customizer')}
                className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-zinc-900 mb-0.5">Warna & Tema</div>
                <div className="text-[10px] text-zinc-400">Sesuaikan tampilan web</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded border border-zinc-200 overflow-hidden">
            <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-900">Publikasi Terkini</h3>
              <button
                onClick={() => setAdminTab('posts')}
                className="text-[11px] text-zinc-600 hover:text-zinc-950 font-medium cursor-pointer"
              >
                Kelola Pos →
              </button>
            </div>
            <div className="divide-y divide-zinc-100 text-xs">
              {posts.slice(0, 4).map((post) => (
                <div key={post.id} className="p-2.5 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-0.5">
                    <span>{post.category}</span>
                    <span>{post.views} pembaca</span>
                  </div>
                  <h4 className="font-medium text-zinc-900 line-clamp-1">{post.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
