import React, { useState, useEffect } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  Phone,
  Mail,
  CloudSun,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ShieldCheck,
  Settings,
  Menu,
  X,
} from 'lucide-react';

import { VisualCustomization } from '../../types';
import { initialVisuals } from '../../data/initialData';
import { PublicPage } from '../../App';

interface PublicNavbarProps {
  onNavigate?: (page: PublicPage) => void;
  currentPage?: PublicPage;
  onAdminClick?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onNavigate, currentPage, onAdminClick }) => {
  const { siteConfig, setIsLaporModalOpen, laporTickets, departments } = useBEM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const visuals: VisualCustomization = {
    ...initialVisuals,
    ...(siteConfig.visuals || {}),
  };

  const accentColor = visuals.logoEmblemBg || '#800016';

  const pendingTicketsCount = laporTickets.filter(
    (t) => t.status === 'Menunggu Verifikasi'
  ).length;

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    // If we're on a sub-page, navigate home first then scroll
    const isSubPage = currentPage && currentPage !== 'home';
    if (isSubPage && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateTo = (page: PublicPage) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Beranda', id: 'beranda', page: 'home' as PublicPage },
    {
      label: 'Tentang Kami', id: 'tentang-kabinet', dropdown: 'tentang', page: 'tentang-kami' as PublicPage,
      children: [
        { label: `Kabinet ${siteConfig.cabinetName}`, page: 'tentang-kami' as PublicPage },
        { label: 'Struktur Organisasi & Teras BPH', page: 'struktur-organisasi' as PublicPage },
        { label: 'Program Kerja Kabinet', page: 'program-kerja' as PublicPage },
      ],
    },
    { label: 'Departemen', id: 'tentang-kabinet', dropdown: 'dept', isDept: true },
    {
      label: 'Informasi Publik', id: 'berita-artikel', dropdown: 'info', page: 'informasi-publik' as PublicPage,
      children: [
        { label: 'Semua Publikasi', page: 'informasi-publik' as PublicPage },
        { label: 'Warta & Kabar Kampus', page: 'informasi-publik-kabar-kampus' as PublicPage },
        { label: 'Kajian & Opini', page: 'informasi-publik-kajian' as PublicPage },
        { label: 'Siaran Pers Resmi', page: 'informasi-publik-siaran-pers' as PublicPage },
        { label: '—', divider: true },
        { label: 'Unduhan SOP & Dokumen', page: 'unduhan-dokumen' as PublicPage },
      ],
    },
  ];

  return (
    <>
      {/* ── TOP UTILITY BAR ── */}
      {visuals.topBarEnabled !== false && (
        <div
          style={{
            backgroundColor: visuals.topBarBackground || '#f4f4f5',
            color: visuals.topBarTextColor || '#52525b',
          }}
          className="border-b border-zinc-200 text-[11px] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
            {/* Left: contact info */}
            <div className="hidden md:flex items-center gap-5 font-normal">
              <a
                href={`tel:${(visuals.topBarPhone || '+6285260123456').replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Phone className="w-3 h-3 opacity-60 shrink-0" />
                <span className="font-mono">{visuals.topBarPhone || '+62 852-6012-3456'}</span>
              </a>
              <span className="text-zinc-300">|</span>
              <a
                href={`mailto:${visuals.topBarEmail || siteConfig.contact.email}`}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Mail className="w-3 h-3 opacity-60 shrink-0" />
                <span className="truncate max-w-[180px]">{visuals.topBarEmail || siteConfig.contact.email}</span>
              </a>
            </div>

            {/* Right: location + socials + admin */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-1.5 opacity-80">
                <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-mono hidden sm:inline">{visuals.topBarLocation || 'Meulaboh · BEM FEB UTU'}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2.5 opacity-70">
                {[
                  { href: visuals.facebookUrl || 'https://facebook.com', icon: <Facebook className="w-3 h-3" />, title: 'Facebook' },
                  { href: visuals.twitterUrl || 'https://twitter.com', icon: <Twitter className="w-3 h-3" />, title: 'Twitter' },
                  { href: visuals.instagramUrl || `https://instagram.com/${siteConfig.contact.instagram.replace('@', '')}`, icon: <Instagram className="w-3 h-3" />, title: 'Instagram' },
                  { href: visuals.youtubeUrl || 'https://youtube.com', icon: <Youtube className="w-3 h-3" />, title: 'YouTube' },
                ].map((s) => (
                  <a key={s.title} href={s.href} target="_blank" rel="noreferrer"
                    className="hover:opacity-100 transition-opacity" title={s.title}>
                    {s.icon}
                  </a>
                ))}
              </div>

              <div className="w-px h-4 bg-zinc-300 hidden sm:block" />
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN HEADER ── */}
      <header
        style={{ backgroundColor: visuals.headerBackground || '#ffffff', color: visuals.headerTextColor || '#09090b' }}
        className={`sticky top-0 z-40 border-b border-zinc-200/80 transition-all duration-200 ${
          scrolled ? 'shadow-md backdrop-blur-md bg-white/95' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">

          {/* ── LOGO AREA ── */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group shrink-0 select-none"
          >
            {/* Emblem */}
            {(!visuals.logoUrl || visuals.showEmblemWithLogo) && (
              <div
                style={{ backgroundColor: accentColor }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform shrink-0"
              >
                <span>{visuals.logoEmblemText || 'UTU'}</span>
              </div>
            )}
            {visuals.logoUrl && (
              <img
                src={visuals.logoUrl}
                alt={visuals.headerTitle1 || 'Logo BEM FEB'}
                style={{ maxHeight: `${Math.min(Math.max(visuals.logoHeight || 40, 28), 56)}px` }}
                className="w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
              />
            )}

            {/* Brand text */}
            <div className="flex items-center gap-2.5">
              <div className="leading-tight">
                <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-tight leading-tight">
                  {visuals.headerTitle1 || 'Badan Eksekutif Mahasiswa'}
                </p>
                <p className="text-[10px] sm:text-[11px] opacity-60 tracking-tight font-medium">
                  {visuals.headerSubtitle1 || 'Universitas Teuku Umar'}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-start pl-2.5 border-l border-zinc-200">
                <p style={{ color: accentColor }} className="text-[12px] sm:text-[13px] font-bold uppercase tracking-tight leading-tight">
                  {visuals.headerTitle2 || 'Fakultas'}
                </p>
                <p className="text-[10px] sm:text-[11px] opacity-70 tracking-tight font-medium">
                  {visuals.headerSubtitle2 || 'Ekonomi & Bisnis'}
                </p>
              </div>
            </div>
          </a>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-0.5 text-[12.5px] font-medium shrink-0">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown ? setActiveDropdown(item.dropdown) : undefined}
                onMouseLeave={() => item.dropdown ? setActiveDropdown(null) : undefined}
              >
                <button
                  onClick={() => {
                    if (item.page) navigateTo(item.page);
                    else scrollTo(item.id);
                  }}
                  className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-md text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  {item.dropdown && <ChevronDown className="w-3 h-3 opacity-50 mt-px" />}
                </button>

                {/* Dropdown panel */}
                {item.dropdown && activeDropdown === item.dropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white text-zinc-900 rounded-lg border border-zinc-200 shadow-xl py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-100"
                    style={{ minWidth: item.isDept ? '240px' : '210px' }}>
                    {item.isDept ? (
                      <div className="max-h-64 overflow-y-auto">
                        {departments.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              setActiveDropdown(null);
                              setMobileMenuOpen(false);
                              if (onNavigate) onNavigate({ type: 'departemen', deptId: d.id });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-3"
                          >
                            <span className="truncate text-zinc-800">{d.name.split('(')[0].trim()}</span>
                            <span className="font-mono text-[10px] text-zinc-400 uppercase shrink-0 bg-zinc-100 px-1.5 py-0.5 rounded">
                              {d.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      item.children?.map((child, ci) => {
                        if ('divider' in child && child.divider) {
                          return <div key={`div-${ci}`} className="my-1 border-t border-zinc-100" />;
                        }
                        const c = child as { label: string; page?: PublicPage; id?: string };
                        return (
                          <button
                            key={c.label}
                            onClick={() => {
                              if (c.page) navigateTo(c.page);
                              else if (c.id) scrollTo(c.id);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                          >
                            {c.label}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Lapor BEM — highlighted nav item */}
            <button
              onClick={() => scrollTo('lapor-bem')}
              style={{ color: accentColor }}
              className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-md font-semibold hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap ml-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lapor BEM FEB</span>
            </button>
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Login Admin button */}
            <button
              onClick={onAdminClick}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-zinc-700 text-[12px] font-semibold rounded-full border border-zinc-300 bg-white hover:border-zinc-500 hover:text-zinc-950 shadow-sm transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Login Admin</span>
              {pendingTicketsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Mobile-only compact Login */}
            <button
              onClick={onAdminClick}
              className="sm:hidden flex items-center gap-1 px-3 py-1.5 text-zinc-700 text-[11px] font-semibold rounded-full border border-zinc-300 bg-white cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Hamburger — hidden on lg+ */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white text-zinc-900 animate-in slide-in-from-top-2 duration-150 shadow-lg max-h-[80vh] overflow-y-auto">
            {/* Lapor CTA full-width */}
            <div className="px-4 py-3 border-b border-zinc-100">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsLaporModalOpen(true); }}
                style={{ backgroundColor: accentColor }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buat Aduan Mahasiswa (Lapor BEM)</span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="px-4 py-2">
              {[
                { label: 'Beranda', action: () => { setMobileMenuOpen(false); if (onNavigate) onNavigate('home'); window.scrollTo({top:0}); } },
                { label: `Kabinet ${siteConfig.cabinetName}`, action: () => navigateTo('tentang-kami') },
                { label: 'Struktur Organisasi & Teras BPH', action: () => navigateTo('struktur-organisasi') },
                { label: 'Program Kerja Kabinet', action: () => navigateTo('program-kerja') },
                { label: `Departemen & Biro (${departments.length})`, action: () => navigateTo('struktur-organisasi') },
                { label: 'Semua Informasi Publik', action: () => navigateTo('informasi-publik') },
                { label: 'Kabar & Warta Kampus', action: () => navigateTo('informasi-publik-kabar-kampus') },
                { label: 'Kajian & Opini', action: () => navigateTo('informasi-publik-kajian') },
                { label: 'Siaran Pers Resmi', action: () => navigateTo('informasi-publik-siaran-pers') },
                { label: 'Unduhan SOP & Dokumen', action: () => navigateTo('unduhan-dokumen') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center w-full text-left py-3 px-1 text-sm text-zinc-700 border-b border-zinc-50 hover:text-zinc-950 transition-colors last:border-0"
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => scrollTo('lapor-bem')}
                style={{ color: accentColor }}
                className="flex items-center justify-between w-full text-left py-3 px-1 text-sm font-bold border-b border-zinc-50"
              >
                <span>Lapor BEM FEB</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </nav>

            {/* Footer row */}
            <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => { setMobileMenuOpen(false); if (onAdminClick) onAdminClick(); }}
                style={{ color: accentColor }}
                className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Dashboard Admin WP</span>
              </button>
              <div className="flex items-center gap-3 opacity-60">
                <a href={visuals.instagramUrl || '#'} target="_blank" rel="noreferrer"><Instagram className="w-4 h-4" /></a>
                <a href={visuals.youtubeUrl || '#'} target="_blank" rel="noreferrer"><Youtube className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
