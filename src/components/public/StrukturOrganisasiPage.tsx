import React from 'react';
import { useBEM } from '../../context/BEMContext';
import { ArrowLeft, ChevronRight, Users, Shield, Award, Building2, ExternalLink, UserCheck } from 'lucide-react';
import { formatLeaderDisplay } from '../../utils/leaderUtils';
import { PublicPage } from '../../App';
import { CabinetMember } from '../../types';

interface StrukturOrganisasiPageProps {
  onNavigate: (page: PublicPage) => void;
  onBack: () => void;
}

export const StrukturOrganisasiPage: React.FC<StrukturOrganisasiPageProps> = ({ onNavigate, onBack }) => {
  const { siteConfig, departments, cabinetMembers } = useBEM();

  // Presidium Ketua & Wakil from siteConfig
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

  // BPH / Teras members
  const bphMembers = cabinetMembers.filter(
    (m) => m.departmentId === 'dept-bph' || m.departmentName?.toLowerCase().includes('bph')
  );

  // Helper to find specific role in BPH or fallback
  const getBphMember = (roleKeywords: string[], defaultRole: string, defaultName: string) => {
    const found = bphMembers.find((m) =>
      roleKeywords.some((kw) => m.role.toLowerCase().includes(kw.toLowerCase()))
    );
    if (found) return found;

    return {
      id: `fallback-${defaultRole}`,
      name: defaultName,
      role: defaultRole,
      departmentId: 'dept-bph',
      departmentName: 'Teras / Badan Pengurus Harian (BPH)',
      prodi: defaultRole.includes('Bendahara') ? 'S1 Akuntansi' : 'S1 Manajemen',
      generation: '2023',
    } as CabinetMember;
  };

  const sekum = getBphMember(['sekretaris umum', 'sekum'], 'Sekretaris Umum', 'Sekretaris Umum');
  const wasekum = getBphMember(['wakil sekretaris umum', 'wasekum', 'wakil sekretaris'], 'Wakil Sekretaris Umum', 'Wakil Sekretaris Umum');
  const bendum = getBphMember(['bendahara umum', 'bendum'], 'Bendahara Umum', 'Bendahara Umum');
  const wabendum = getBphMember(['wakil bendahara umum', 'wabendum', 'wakil bendahara'], 'Wakil Bendahara Umum', 'Wakil Bendahara Umum');

  // Filter regular departments (excluding BPH from general department cards)
  const regularDepartments = departments.filter((d) => d.id !== 'dept-bph' && d.category !== 'Badan Pengurus Harian');

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
            <span className="text-[#800016] font-semibold">Struktur Organisasi</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#800016] via-[#660012] to-[#40000b] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-3 text-rose-100">
            Hierarki & Tata Kelola Kepemimpinan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Struktur Organisasi
          </h1>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl leading-relaxed">
            Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Teuku Umar — Kabinet {siteConfig.cabinetName} ({siteConfig.period})
          </p>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* ── 1. TERAS / BADAN PENGURUS HARIAN (BPH) ── */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-[#800016] font-bold uppercase tracking-wider">
              Pucuk Pimpinan & Supervisi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              Teras / Badan Pengurus Harian (BPH)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Poros utama kepemimpinan eksekutif BEM FEB UTU yang menjalankan fungsi koordinasi, supervisi, administrasi kesekretariatan, dan kebendaharaan.
            </p>
          </div>

          {/* Level 1: Presidium (Ketua & Wakil) */}
          <div className="mb-8">
            <div className="text-center mb-3">
              <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 bg-rose-50 text-[#800016] border border-rose-200 rounded-full">
                Presidium Mahasiswa FEB UTU
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Ketua BEM */}
              <div className="bg-white rounded-xl border-2 border-rose-200/80 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 opacity-50" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#800016] to-[#50000e] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 border-2 border-rose-100">
                    {ketua.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                      {ketua.role}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-950">{ketua.name}</h3>
                    {ketua.nim && (
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">NIM {ketua.nim}</p>
                    )}
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">Fakultas Ekonomi dan Bisnis UTU</p>
                  </div>
                </div>
              </div>

              {/* Wakil Ketua BEM */}
              <div className="bg-white rounded-xl border-2 border-rose-200/80 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 opacity-50" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#800016] to-[#50000e] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 border-2 border-rose-100">
                    {wakil.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                      {wakil.role}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-950">{wakil.name}</h3>
                    {wakil.nim && (
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">NIM {wakil.nim}</p>
                    )}
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">Fakultas Ekonomi dan Bisnis UTU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level 2: Kesekretariatan & Kebendaharaan (Sekum, Wasekum, Bendum, Wabendum) */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-full">
                Kesekretariatan & Kebendaharaan Umum
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {/* Sekretaris Umum */}
              <BphCard
                role="Sekretaris Umum"
                subRole="Pimpinan Kesekretariatan"
                name={sekum.name}
                nim={sekum.nim}
                prodi={sekum.prodi}
                photoUrl={sekum.photoUrl}
              />

              {/* Wakil Sekretaris Umum */}
              <BphCard
                role="Wakil Sekretaris Umum"
                subRole="Administrasi & Persuratan"
                name={wasekum.name}
                nim={wasekum.nim}
                prodi={wasekum.prodi}
                photoUrl={wasekum.photoUrl}
              />

              {/* Bendahara Umum */}
              <BphCard
                role="Bendahara Umum"
                subRole="Pimpinan Kebendaharaan"
                name={bendum.name}
                nim={bendum.nim}
                prodi={bendum.prodi}
                photoUrl={bendum.photoUrl}
              />

              {/* Wakil Bendahara Umum */}
              <BphCard
                role="Wakil Bendahara Umum"
                subRole="Anggaran & Finansial"
                name={wabendum.name}
                nim={wabendum.nim}
                prodi={wabendum.prodi}
                photoUrl={wabendum.photoUrl}
              />
            </div>
          </div>
        </section>

        {/* ── 2. DAFTAR DEPARTEMEN & BIRO ── */}
        <section className="pt-8 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs text-[#800016] font-bold uppercase tracking-wider">
                Satuan Kerja Operasional
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1 tracking-tight">
                Departemen & Biro BEM FEB UTU
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Unit pelaksana program kerja dan aspirasi kemahasiswaan di lingkungan Fakultas Ekonomi dan Bisnis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularDepartments.map((dept) => {
              const memberCount = cabinetMembers.filter(
                (m) => m.departmentId === dept.id
              ).length;

              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between hover:border-[#800016]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-[#800016] bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                        {dept.code}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {dept.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-950 mb-2 group-hover:text-[#800016] transition-colors">
                      {dept.name}
                    </h3>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                      {dept.description}
                    </p>

                    <div className="pt-3 border-t border-zinc-100 space-y-1.5 mb-5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Kepala Satuan:</span>
                        <span className="font-semibold text-zinc-800">{dept.kadepName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Fokus Kerja:</span>
                        <span className="font-medium text-zinc-700 truncate max-w-[180px]">{dept.focus}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Jumlah Anggota:</span>
                        <span className="font-mono text-zinc-700">{memberCount} orang</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate({ type: 'departemen', deptId: dept.id })}
                    className="w-full py-2 px-3 bg-zinc-50 hover:bg-[#800016] hover:text-white text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 hover:border-[#800016] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Halaman Departemen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

interface BphCardProps {
  role: string;
  subRole: string;
  name: string;
  nim?: string;
  prodi?: string;
  photoUrl?: string;
}

const BphCard: React.FC<BphCardProps> = ({ role, subRole, name, nim, prodi, photoUrl }) => (
  <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col items-center text-center hover:border-zinc-300 hover:shadow-sm transition-all">
    {photoUrl ? (
      <img
        src={photoUrl}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border-2 border-zinc-100 mb-3 shadow-xs"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 text-[#800016] border border-rose-200 flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
        {name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
      </div>
    )}

    <span className="text-[10px] font-bold uppercase tracking-wider text-[#800016] mb-0.5">
      {role}
    </span>
    <p className="text-[10px] text-zinc-400 font-mono mb-2">{subRole}</p>
    <h4 className="font-bold text-sm text-zinc-950 leading-tight mb-1">{name}</h4>
    {nim && <p className="text-[11px] text-zinc-500 font-mono">NIM {nim}</p>}
    {prodi && <p className="text-[10px] text-zinc-400 mt-0.5">{prodi}</p>}
  </div>
);
