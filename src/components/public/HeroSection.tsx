import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageCircle,
} from 'lucide-react';

import { VisualCustomization } from '../../types';
import { initialVisuals } from '../../data/initialData';

export const HeroSection: React.FC = () => {
  const { siteConfig, setIsLaporModalOpen, setIsTrackerModalOpen, laporTickets, programKerja, departments } = useBEM();

  const visuals: VisualCustomization = {
    ...initialVisuals,
    ...(siteConfig.visuals || {}),
  };

  const slides = siteConfig.magazineSlides && siteConfig.magazineSlides.length > 0
    ? siteConfig.magazineSlides
    : [
        {
          id: 'slide-1',
          hashtag: '#e-magazine ECONOMIA FEB UTU',
          title: 'Telah Terbit ECONOMIA Edisi 03',
          subtitle: 'Majalah Berkala Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Teuku Umar',
          ctaText: 'Selengkapnya',
          ctaLink: '#berita-artikel',
          secondaryCtaText: 'Lapor BEM FEB',
          magazineHeader: 'MAJALAH DWI BULANAN MAHASISWA FEB UNIVERSITAS TEUKU UMAR',
          magazineName: 'ECONOMIA',
          edition: 'EDISI 03 | 2026',
          articleHeadline: 'Rangkaian Sinergi Marwah: Pelatihan Kepemimpinan & Inkubasi Bisnis Mahasiswa Menuju Prestasi Nasional',
          studentName: 'Shafa Haura',
          studentRole: 'Duta Mahasiswa FEB UTU',
          studentHeadline: 'Shafa Haura Buktikan Mahasiswa FEB UTU Siap Berperan dalam Karya & Prestasi Nasional',
          coverImage: '/src/assets/images/magazine_cover_student_1792267862943.jpg',
        },
      ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to convert hex to rgba for translucent red gradient
  const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex) return `rgba(220, 38, 38, ${alpha})`;
    const clean = hex.replace('#', '').trim();
    let r = 220, g = 38, b = 38;
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16) || 220;
      g = parseInt(clean[1] + clean[1], 16) || 38;
      b = parseInt(clean[2] + clean[2], 16) || 38;
    } else if (clean.length >= 6) {
      r = parseInt(clean.substring(0, 2), 16) || 220;
      g = parseInt(clean.substring(2, 4), 16) || 38;
      b = parseInt(clean.substring(4, 6), 16) || 38;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const heroBgImage = siteConfig.heroImage || '/src/assets/images/bem_hero_campus_1792265588786.jpg';

  return (
    <div id="beranda" className="relative">
      {/* =========================================================================
          HERO BANNER (Vibrant Translucent Red Gradient & Visible Background Photo)
          ========================================================================= */}
      <section
        className="relative text-white overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 transition-colors duration-300 min-h-[480px] flex items-center"
      >
        {/* 1. Latar Belakang Foto Kampus / Gambar Utama (Jelas & Terlihat Indah) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700 transform scale-100 filter brightness-95 contrast-105"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />

        {/* 2. Overlay Gradasi Merah Memikat & Bernyawa (Dipadukan Harmonis dengan Foto Latar Belakang) */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(visuals.heroBgGradientStart || '#dc2626', 0.52)} 0%, ${hexToRgba(visuals.heroBgGradientMiddle || '#ba0f23', 0.64)} 40%, ${hexToRgba(visuals.heroBgGradientEnd || '#800016', 0.78)} 75%, rgba(55, 0, 10, 0.88) 100%)`,
          }}
        />

        {/* 3. Radial Lighting Glow (Kilau Merah Ruby & Aksen Emas yang Menyatu Lembut) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 35%, rgba(255, 75, 95, 0.28) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.16) 0%, transparent 55%)',
          }}
        />

        {/* 4. Vignette Halus untuk Kedalaman Visual & Keterbacaan Teks Maksimal */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* 5. Pattern overlay geometris halus */}
        {visuals.heroOverlayPattern !== false && (
          <div className="absolute inset-0 opacity-12 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-5 text-center lg:text-left items-center lg:items-start">
              {/* Hashtag / Category Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/25 text-rose-100 text-xs sm:text-sm font-semibold tracking-wide">
                <span>{currentSlide.hashtag}</span>
              </div>

              {/* Huge Bold Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.2] [text-wrap:balance] drop-shadow-sm">
                {currentSlide.title}
              </h1>

              {/* Subtitle / Excerpt */}
              <p className="text-white/90 text-xs sm:text-base font-normal leading-relaxed max-w-lg drop-shadow-2xs">
                {currentSlide.subtitle}
              </p>

              {/* Action Buttons with high touch targets for all devices */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <button
                  onClick={() => scrollTo('berita-artikel')}
                  className="px-6 py-3 sm:py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg border border-white/40 backdrop-blur-xs active:scale-95 text-center"
                >
                  {currentSlide.ctaText || 'Selengkapnya'}
                </button>

                <button
                  onClick={() => setIsLaporModalOpen(true)}
                  className="px-6 py-3 sm:py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 text-xs sm:text-sm font-extrabold rounded-full transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                  <span>{currentSlide.secondaryCtaText || 'Ajukan Laporan (Lapor BEM)'}</span>
                </button>
              </div>

              {/* Slide Dots */}
              {slides.length > 1 && (
                <div className="flex items-center gap-2 pt-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Magazine Cover Mockup with Navigation Arrows */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 relative">
              {/* Magazine Cover Container */}
              <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border-2 sm:border-4 border-white/90 transform hover:-translate-y-1 transition-transform duration-300">
                {/* Magazine Inner Layout */}
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden flex flex-col justify-between p-3.5 sm:p-5 text-white">
                  {/* Background Full Student Photo */}
                  <img
                    src={currentSlide.coverImage}
                    alt={currentSlide.studentHeadline}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />

                  {/* Dark gradient overlays for magazine readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/25 to-black/90 pointer-events-none"></div>

                  {/* Header Area */}
                  <div className="relative z-10 space-y-1">
                    <p className="text-[8px] sm:text-[10px] text-white/90 tracking-wider uppercase font-semibold font-mono">
                      {currentSlide.magazineHeader}
                    </p>

                    <div className="flex items-baseline justify-between border-b border-white/30 pb-1">
                      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tighter text-white drop-shadow-md">
                        {currentSlide.magazineName}
                      </h2>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-tight text-amber-300">
                        {currentSlide.edition}
                      </span>
                    </div>

                    {/* Article Teaser on the left */}
                    <div className="pt-1.5 sm:pt-2 max-w-[70%]">
                      <p className="text-[11px] sm:text-sm font-bold text-amber-300 leading-snug drop-shadow-sm">
                        {currentSlide.articleHeadline}
                      </p>
                    </div>

                    {/* Inset Thumbnail Box */}
                    <div className="mt-1.5 sm:mt-2 w-20 h-14 sm:w-24 sm:h-16 rounded border border-white/80 overflow-hidden shadow-md bg-black/40">
                      <img
                        src={currentSlide.insetThumbnail || '/src/assets/images/bem_activity_forum_1792265589704.jpg'}
                        alt="Aktivitas BEM FEB UTU"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Bottom Teaser Headline Banner */}
                  <div className="relative z-10 pt-2 sm:pt-4">
                    <div className="bg-black/60 backdrop-blur-xs p-2 sm:p-2.5 rounded border border-white/20">
                      <p className="text-[11px] sm:text-sm font-semibold text-white leading-snug line-clamp-2 sm:line-clamp-none">
                        {currentSlide.studentHeadline}
                      </p>
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-300 font-mono mt-1 pt-1 border-t border-white/20">
                        <span className="truncate mr-2">{currentSlide.studentName} · {currentSlide.studentRole}</span>
                        <span className="text-amber-300 shrink-0">BEM FEB UTU</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Navigation Buttons: (←) and (→) */}
              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/80 hover:border-white text-white hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-90"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/80 hover:border-white text-white hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-90"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK STATS STRIP (Customizable Background & Numbers by Admin)
          ========================================================================= */}
      <div
        style={{ backgroundColor: visuals.statsBackground || '#ffffff' }}
        className="border-b border-zinc-200 py-6 px-4 sm:px-8 transition-colors"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: `${visuals.logoEmblemBg || '#800016'}15`,
                color: visuals.logoEmblemBg || '#800016',
                borderColor: `${visuals.logoEmblemBg || '#800016'}30`,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0 border"
            >
              {visuals.stat1Number || '60+'}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">{visuals.stat1Title || 'Aduan Selesai'}</p>
              <p className="text-[11px] text-zinc-500 font-normal">{visuals.stat1Desc || 'Kesejahteraan & UKT Mahasiswa'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: `${visuals.logoEmblemBg || '#800016'}15`,
                color: visuals.logoEmblemBg || '#800016',
                borderColor: `${visuals.logoEmblemBg || '#800016'}30`,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0 border"
            >
              {visuals.stat2Number || String(departments.length)}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">{visuals.stat2Title || 'Satuan Departemen & Biro'}</p>
              <p className="text-[11px] text-zinc-500 font-normal">{visuals.stat2Desc || 'BPH, Adkesma, ELD, dll'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: `${visuals.logoEmblemBg || '#800016'}15`,
                color: visuals.logoEmblemBg || '#800016',
                borderColor: `${visuals.logoEmblemBg || '#800016'}30`,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0 border"
            >
              {visuals.stat3Number || '48+'}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">{visuals.stat3Title || 'Pengurus & Fungsionaris'}</p>
              <p className="text-[11px] text-zinc-500 font-normal">{visuals.stat3Desc || 'Sinergi Marwah Mahasiswa'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: `${visuals.logoEmblemBg || '#800016'}15`,
                color: visuals.logoEmblemBg || '#800016',
                borderColor: `${visuals.logoEmblemBg || '#800016'}30`,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0 border"
            >
              {visuals.stat4Number || String(programKerja.length)}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">{visuals.stat4Title || 'Program Kerja Terencana'}</p>
              <p className="text-[11px] text-zinc-500 font-normal">{visuals.stat4Desc || 'Agenda & Inovasi Kemahasiswaan'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLOATING ACTION BUTTONS (Customizable by Admin)
          ========================================================================= */}
      <aside aria-label="Floating Shortcuts" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
        {/* Language / Accessibility circular button */}
        {visuals.accessibilityButtonEnabled !== false && (
          <button
            onClick={() => alert('Mode Aksesibilitas BEM FEB Universitas Teuku Umar aktif (Format Standar).')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200 shadow-md hover:shadow-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 cursor-pointer"
            title="Pengaturan Aksesibilitas & Teks"
          >
            <span className="font-sans font-bold">文A</span>
          </button>
        )}

        {/* Live Support / Tracker circular button */}
        {visuals.trackerButtonEnabled !== false && (
          <button
            onClick={() => setIsTrackerModalOpen(true)}
            style={{ color: visuals.logoEmblemBg || '#800016' }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-zinc-200 shadow-md hover:shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            title="Lacak Tiket Aduan Mahasiswa"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* WhatsApp pill */}
        {visuals.whatsappButtonEnabled !== false && (
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappAdvokesma.replace(/[^0-9]/g, '')}?text=Halo%20Advokesma%20BEM%20FEB%20Universitas%20Teuku%20Umar,%20saya%20ingin%20berkonsultasi.`}
            target="_blank"
            rel="noreferrer"
            style={{ backgroundColor: visuals.whatsappButtonBg || '#25D366' }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span className="hidden sm:inline">{visuals.whatsappButtonText || 'WhatsApp Kami'}</span>
            <span className="sm:hidden">WA</span>
          </a>
        )}
      </aside>
    </div>
  );
};
