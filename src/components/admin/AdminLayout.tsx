import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, ShieldAlert, Calendar,
  Users, Sliders, ExternalLink, LogOut, RotateCcw,
  Menu, X, FolderOpen, UserCog,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onGoToPublic: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onGoToPublic, onLogout }) => {
  const { siteConfig, adminTab, setAdminTab, laporTickets, departments, resetSiteConfig } = useBEM();
  const { currentUser } = useAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingLaporCount = laporTickets.filter(t => t.status === 'Menunggu Verifikasi').length;

  const handleSelectTab = (tab: any) => {
    setAdminTab(tab);
    setMobileSidebarOpen(false);
  };

  const handleConfirmReset = () => {
    if (window.confirm('Reset seluruh data website ke pengaturan bawaan? Tindakan ini tidak bisa dibatalkan.')) {
      resetSiteConfig();
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm('Keluar dari dashboard admin?')) {
      onLogout();
    }
  };

  const navItems = [
    { tab: 'dashboard',       icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />,         label: 'Dashboard Ringkasan',      badge: null },
    { tab: 'lapor',           icon: <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-300" />, label: 'Lapor BEM FEB',             badge: pendingLaporCount > 0 ? pendingLaporCount : null },
    { tab: 'posts',           icon: <FileText className="w-3.5 h-3.5 shrink-0" />,                label: 'Warta & Informasi Publik',  badge: null },
    { tab: 'proker',          icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,                label: 'Program Kerja & Agenda',    badge: null },
    { tab: 'downloads',       icon: <FolderOpen className="w-3.5 h-3.5 shrink-0 text-emerald-300" />, label: 'Bank Dokumen & Unduhan', badge: null },
    { tab: 'cabinet',         icon: <Users className="w-3.5 h-3.5 shrink-0" />,                   label: 'Departemen & Pengurus',     badge: departments.length },
  ];

  const appearanceItems = [
    { tab: 'customizer',      icon: <Sliders className="w-3.5 h-3.5 shrink-0 text-amber-300" />,  label: 'Kustomisasi Website' },
    { tab: 'dept-customizer', icon: <Sliders className="w-3.5 h-3.5 shrink-0 text-violet-300" />, label: 'Tampilan Halaman Dept.' },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans text-zinc-900">

      {/* ── Top bar ── */}
      <header className="bg-[#1f0006] text-rose-200/80 text-xs h-11 px-3 sm:px-4 flex items-center justify-between border-b border-rose-950/60 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1 text-rose-200 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 font-medium text-white">
            {siteConfig.visuals?.logoUrl ? (
              <img src={siteConfig.visuals.logoUrl} alt="Logo" className="h-5 w-auto object-contain brightness-125" />
            ) : (
              <span className="w-4 h-4 rounded bg-[#800016] text-white flex items-center justify-center text-[9px] font-bold">W</span>
            )}
            <span className="text-xs font-semibold">{siteConfig.shortName} Admin</span>
          </div>

          <span className="text-rose-900 hidden sm:inline">/</span>
          <button
            onClick={onGoToPublic}
            className="hidden sm:flex items-center gap-1.5 text-rose-200/70 hover:text-white transition-colors text-[11px]"
          >
            <ExternalLink className="w-3 h-3 text-rose-400" />
            <span>Lihat Portal Publik</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current user */}
          {currentUser && (
            <button
              onClick={() => handleSelectTab('account')}
              className={`hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded transition-colors ${
                adminTab === 'account'
                  ? 'bg-rose-900/60 text-white'
                  : 'text-rose-200/70 hover:text-white hover:bg-rose-950/40'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#800016] flex items-center justify-center text-white text-[8px] font-bold">
                {currentUser.displayName.charAt(0)}
              </div>
              <span>{currentUser.displayName}</span>
            </button>
          )}

          <button
            onClick={onGoToPublic}
            className="sm:hidden flex items-center gap-1 text-rose-200/80 hover:text-white text-[11px]"
          >
            <ExternalLink className="w-3 h-3 text-rose-400" /> Portal
          </button>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#800016] hover:bg-[#680012] text-white text-[11px] transition-colors shadow-xs"
          >
            <LogOut className="w-3 h-3 text-rose-200" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ── Workspace ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`w-64 md:w-60 bg-[#140004] text-rose-100/70 flex flex-col shrink-0 border-r border-rose-950/60 transition-transform duration-200 z-50 ${
            mobileSidebarOpen
              ? 'fixed inset-y-11 left-0 translate-x-0'
              : 'fixed inset-y-11 left-0 -translate-x-full md:relative md:inset-y-0 md:translate-x-0'
          }`}
        >
          {/* Sidebar header */}
          <div className="p-3.5 border-b border-rose-950/60 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-rose-300 uppercase tracking-tight truncate">{siteConfig.cabinetName}</div>
              <div className="font-semibold text-xs text-white truncate mt-0.5">Panel Pengurus BEM FEB</div>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden p-1 text-rose-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto text-xs">
            {navItems.map(item => (
              <button
                key={item.tab}
                onClick={() => handleSelectTab(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors cursor-pointer text-left ${
                  adminTab === item.tab
                    ? 'bg-[#800016] text-white font-medium'
                    : 'text-rose-100/70 hover:bg-rose-950/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">{item.icon}<span>{item.label}</span></div>
                {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 bg-amber-400 text-black font-mono text-[10px] rounded tabular-nums font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 pb-1 px-3 text-[10px] font-mono text-rose-400/50 uppercase tracking-tight">Tampilan</div>

            {appearanceItems.map(item => (
              <button
                key={item.tab}
                onClick={() => handleSelectTab(item.tab)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors cursor-pointer text-left ${
                  adminTab === item.tab
                    ? 'bg-[#800016] text-white font-medium'
                    : 'text-rose-100/70 hover:bg-rose-950/50 hover:text-white'
                }`}
              >
                {item.icon}<span>{item.label}</span>
              </button>
            ))}

            <div className="pt-3 pb-1 px-3 text-[10px] font-mono text-rose-400/50 uppercase tracking-tight">Akun</div>

            <button
              onClick={() => handleSelectTab('account')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors cursor-pointer text-left ${
                adminTab === 'account'
                  ? 'bg-[#800016] text-white font-medium'
                  : 'text-rose-100/70 hover:bg-rose-950/50 hover:text-white'
              }`}
            >
              <UserCog className="w-3.5 h-3.5 shrink-0 text-sky-300" />
              <span>Akun & Keamanan</span>
            </button>
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t border-rose-950/60 space-y-1">
            <button
              onClick={handleConfirmReset}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] text-rose-300/60 hover:text-rose-200 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /><span>Reset Data Bawaan</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-zinc-50">
          {children}
        </main>
      </div>
    </div>
  );
};
