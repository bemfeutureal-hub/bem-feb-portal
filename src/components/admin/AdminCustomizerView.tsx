import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  Sliders,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Palette,
  Image as ImageIcon,
  Layout,
  Layers,
  Phone,
  ShieldAlert,
  Users,
  BarChart3,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { VisualCustomization, MagazineSlide } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';

export const AdminCustomizerView: React.FC = () => {
  const { siteConfig, updateSiteConfig, resetSiteConfig, showToast } = useBEM();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<
    'backgrounds' | 'hero_magazine' | 'header_topbar' | 'stats_floating' | 'lapor_advokasi' | 'identity_presidium' | 'contact_footer'
  >('backgrounds');

  // Form State
  const [formData, setFormData] = useState(siteConfig);

  // Active slide index for magazine editor
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  // Ensure visuals object exists
  const visuals: VisualCustomization = formData.visuals || {
    pageBackground: '#ffffff',
    pageTextColor: '#18181b',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'md',
    topBarBackground: '#f8f9fa',
    topBarTextColor: '#374151',
    topBarPhone: '+62 852-6012-3456 / +62 822-7345-8901',
    topBarEmail: formData.contact.email,
    topBarLocation: 'Meulaboh · BEM FEB UTU',
    topBarEnabled: true,
    facebookUrl: 'https://facebook.com',
    twitterUrl: 'https://twitter.com',
    instagramUrl: `https://instagram.com/${formData.contact.instagram.replace('@', '')}`,
    youtubeUrl: 'https://youtube.com',
    headerBackground: '#ffffff',
    headerTextColor: '#09090b',
    logoEmblemText: 'UTU',
    logoEmblemBg: '#800016',
    headerTitle1: 'Badan Eksekutif Mahasiswa',
    headerSubtitle1: 'Universitas Teuku Umar',
    headerTitle2: 'Fakultas',
    headerSubtitle2: 'Ekonomi & Bisnis',
    headerCtaText: 'Ajukan Aduan',
    headerCtaBg: '#800016',
    heroBgGradientStart: '#ba0f23',
    heroBgGradientMiddle: '#cc142a',
    heroBgGradientEnd: '#990d1c',
    heroOverlayPattern: true,
    statsBackground: '#ffffff',
    laporSectionBackground: '#fcfcfd',
    aboutSectionBackground: '#ffffff',
    postsSectionBackground: '#fcfcfd',
    prokerSectionBackground: '#ffffff',
    downloadsSectionBackground: '#fcfcfd',
    footerBackground: '#09090b',
    footerTextColor: '#a1a1aa',
    footerAccentBg: '#800016',
    whatsappButtonEnabled: true,
    whatsappButtonText: 'Layanan 24 Jam',
    whatsappButtonBg: '#25D366',
    accessibilityButtonEnabled: true,
    trackerButtonEnabled: true,
    stat1Number: '60+',
    stat1Title: 'Aduan Selesai',
    stat1Desc: 'Kesejahteraan & UKT Mahasiswa',
    stat2Number: '7',
    stat2Title: 'Satuan Departemen & Biro',
    stat2Desc: 'BPH, Adkesma, ELD, dll',
    stat3Number: '48+',
    stat3Title: 'Pengurus & Fungsionaris',
    stat3Desc: 'Sinergi Marwah Mahasiswa',
    stat4Number: '15+',
    stat4Title: 'Program Kerja Terencana',
    stat4Desc: 'Agenda & Inovasi Kemahasiswaan',
    laporTitle: 'Lapor BEM FEB Universitas Teuku Umar',
    laporSubtitle: 'Layanan Advokasi Mahasiswa FEB UTU',
    laporDescription: 'Kanal resmi pelaporan fasilitas sarana kampus, kendala akademik perkuliahan, audiensi banding UKT, dan pendampingan advokasi mahasiswa FEB UTU secara aman, transparan, dan dapat dilacak.',
    laporCtaButtonText: '+ Buat Aduan Mahasiswa',
  };

  const updateVisualField = (key: keyof VisualCustomization, value: any) => {
    setFormData((prev) => ({
      ...prev,
      visuals: {
        ...(prev.visuals || visuals),
        [key]: value,
      },
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteConfig(formData);
    showToast('Seluruh kustomisasi website berhasil disimpan!');
  };

  // Preset Gradients for Hero Banner
  const heroGradients = [
    { label: 'Maroon Resmi UTU', start: '#ba0f23', middle: '#cc142a', end: '#990d1c' },
    { label: 'Crimson Flame', start: '#b91c1c', middle: '#dc2626', end: '#991b1b' },
    { label: 'Deep Navy Blue', start: '#0f172a', middle: '#1e3a8a', end: '#0c4a6e' },
    { label: 'Emerald Forest', start: '#064e3b', middle: '#059669', end: '#047857' },
    { label: 'Obsidian Night', start: '#09090b', middle: '#18181b', end: '#27272a' },
    { label: 'Royal Burgundy', start: '#4c0519', middle: '#881337', end: '#701a75' },
  ];

  // Preset Page Backgrounds
  const pageBackgroundPresets = [
    { label: 'Putih Bersih', bg: '#ffffff', text: '#18181b' },
    { label: 'Off-White Minimal', bg: '#fafafa', text: '#18181b' },
    { label: 'Slate Soft (Sejuk)', bg: '#f8fafc', text: '#0f172a' },
    { label: 'Zinc Netral', bg: '#f4f4f5', text: '#18181b' },
    { label: 'Mode Gelap (Dark)', bg: '#09090b', text: '#f4f4f5' },
    { label: 'Obsidian Slate Dark', bg: '#0f172a', text: '#f8fafc' },
  ];

  // Magazine Slides Handler
  const currentSlides = formData.magazineSlides || [];

  const handleUpdateSlideField = (index: number, field: keyof MagazineSlide, val: string) => {
    const updated = [...currentSlides];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: val };
      setFormData({ ...formData, magazineSlides: updated });
    }
  };

  const handleAddSlide = () => {
    const newSlide: MagazineSlide = {
      id: `slide-${Date.now()}`,
      hashtag: '#e-magazine BEM FEB UTU',
      title: 'Judul Baru E-Magazine FEB',
      subtitle: 'Publikasi berkala seputar dinamika kemahasiswaan dan keilmuan ekonomi.',
      ctaText: 'Selengkapnya',
      ctaLink: '#berita-artikel',
      secondaryCtaText: 'Lapor BEM FEB',
      magazineHeader: 'MAJALAH DWI BULANAN MAHASISWA FEB UNIVERSITAS TEUKU UMAR',
      magazineName: 'ECONOMIA',
      edition: `EDISI ${currentSlides.length + 1} | 2026`,
      articleHeadline: 'Gagasan Solutif Pemuda Mahasiswa Menjawab Isu Ekonomi Regional',
      studentName: 'Aktivis FEB UTU',
      studentRole: 'Pengurus BEM FEB UTU',
      studentHeadline: 'Integritas dan dedikasi untuk kebaikan bersama.',
      coverImage: '/src/assets/images/magazine_cover_student_1792267862943.jpg',
    };
    const updated = [...currentSlides, newSlide];
    setFormData({ ...formData, magazineSlides: updated });
    setSelectedSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (currentSlides.length <= 1) {
      alert('Minimal harus menyisakan 1 slide.');
      return;
    }
    const updated = currentSlides.filter((_, idx) => idx !== index);
    setFormData({ ...formData, magazineSlides: updated });
    setSelectedSlideIndex(0);
  };

  // Misi Handlers
  const handleMisiChange = (index: number, val: string) => {
    const updated = [...formData.misi];
    updated[index] = val;
    setFormData({ ...formData, misi: updated });
  };

  const handleAddMisi = () => {
    setFormData({ ...formData, misi: [...formData.misi, 'Misi baru BEM FEB UTU...'] });
  };

  const handleRemoveMisi = (index: number) => {
    const updated = formData.misi.filter((_, idx) => idx !== index);
    setFormData({ ...formData, misi: updated });
  };

  return (
    <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
      {/* Top Header & Fast Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Kustomisasi Total</div>
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#800016]" />
            <span>Kustomisasi Penuh Website (Full Website Customizer)</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ubah latar belakang (background), warna, header, hero majalah, tombol mengambang, teks, dan seluruh konten portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Gunakan tombol "Lihat Portal Publik" di atas untuk pratinjau.')}
            className="px-3.5 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            <span>Lihat Website</span>
          </button>

          <button
            onClick={() => handleSave()}
            className="px-4 py-1.5 bg-[#800016] hover:bg-[#680012] text-white rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200 text-xs">
        <button
          onClick={() => setActiveTab('backgrounds')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'backgrounds'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Latar Belakang & Tampilan</span>
        </button>

        <button
          onClick={() => setActiveTab('hero_magazine')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'hero_magazine'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Hero & Majalah E-Magazine</span>
        </button>

        <button
          onClick={() => setActiveTab('header_topbar')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'header_topbar'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Header & Bilah Atas</span>
        </button>

        <button
          onClick={() => setActiveTab('stats_floating')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'stats_floating'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Statistik & Tombol WA</span>
        </button>

        <button
          onClick={() => setActiveTab('lapor_advokasi')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lapor_advokasi'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Seksi Lapor BEM</span>
        </button>

        <button
          onClick={() => setActiveTab('identity_presidium')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'identity_presidium'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Presidium & Visi Misi</span>
        </button>

        <button
          onClick={() => setActiveTab('contact_footer')}
          className={`px-3.5 py-2 rounded-t font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'contact_footer'
              ? 'bg-white text-[#800016] border-t-2 border-[#800016] border-x border-zinc-200 -mb-[1px] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Kontak & Footer</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: LATAR BELAKANG & TAMPILAN GLOBAL (BACKGROUNDS & STYLING)
          ========================================================================= */}
      {activeTab === 'backgrounds' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-6 text-xs">
          {/* Section: Page Background */}
          <div>
            <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#800016]" />
              <span>Latar Belakang Halaman (Global Page Background)</span>
            </h3>
            <p className="text-zinc-500 mb-3">
              Pilih warna latar belakang keseluruhan halaman website atau gunakan kode warna hex kustom.
            </p>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
              {pageBackgroundPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    updateVisualField('pageBackground', preset.bg);
                    updateVisualField('pageTextColor', preset.text);
                  }}
                  className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                    visuals.pageBackground === preset.bg
                      ? 'border-[#800016] ring-2 ring-[#800016]/20 font-bold'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="w-full h-5 rounded mb-1.5 border border-black/10" style={{ backgroundColor: preset.bg }} />
                  <p className="text-[11px] text-zinc-900 truncate">{preset.label}</p>
                </button>
              ))}
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-zinc-50 rounded border border-zinc-200">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Warna Background Kustom</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.pageBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('pageBackground', e.target.value)}
                    className="w-9 h-8 rounded border border-zinc-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={visuals.pageBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('pageBackground', e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white border border-zinc-300 rounded font-mono text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Warna Teks Utama Halaman</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.pageTextColor || '#18181b'}
                    onChange={(e) => updateVisualField('pageTextColor', e.target.value)}
                    className="w-9 h-8 rounded border border-zinc-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={visuals.pageTextColor || '#18181b'}
                    onChange={(e) => updateVisualField('pageTextColor', e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white border border-zinc-300 rounded font-mono text-zinc-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Typography Font Family */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-950 mb-1">Pilihan Tipografi Font Minimalis</h3>
            <p className="text-zinc-500 mb-3">Semua teks pada situs akan menggunakan font pilihan Anda.</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(['Plus Jakarta Sans', 'Inter', 'DM Sans', 'Outfit', 'System'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => updateVisualField('fontFamily', font)}
                  className={`p-3 rounded border text-center cursor-pointer transition-all ${
                    visuals.fontFamily === font
                      ? 'border-[#800016] bg-rose-50/50 text-[#800016] font-bold ring-1 ring-[#800016]'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                  }`}
                >
                  <span className="text-sm block mb-0.5">Aa</span>
                  <span className="text-[11px]">{font}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Hero Banner Gradient Colors */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-950 mb-1">Warna Background Hero Banner (Gradasi 3 Warna)</h3>
            <p className="text-zinc-500 mb-3">
              Hero banner menggunakan gradasi horizontal 3 warna. Pilih preset resmi atau atur warna sendiri.
            </p>

            {/* Gradient Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-4">
              {heroGradients.map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    updateVisualField('heroBgGradientStart', g.start);
                    updateVisualField('heroBgGradientMiddle', g.middle);
                    updateVisualField('heroBgGradientEnd', g.end);
                  }}
                  className="p-2.5 rounded border border-zinc-200 hover:border-zinc-400 text-left cursor-pointer transition-all"
                >
                  <div
                    className="w-full h-6 rounded mb-1.5 shadow-xs"
                    style={{ background: `linear-gradient(to right, ${g.start}, ${g.middle}, ${g.end})` }}
                  />
                  <p className="text-[11px] font-semibold text-zinc-800 truncate">{g.label}</p>
                </button>
              ))}
            </div>

            {/* 3 Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-zinc-50 rounded border border-zinc-200">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">1. Warna Awal (Kiri)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.heroBgGradientStart || '#ba0f23'}
                    onChange={(e) => updateVisualField('heroBgGradientStart', e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={visuals.heroBgGradientStart || '#ba0f23'}
                    onChange={(e) => updateVisualField('heroBgGradientStart', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">2. Warna Tengah</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.heroBgGradientMiddle || '#cc142a'}
                    onChange={(e) => updateVisualField('heroBgGradientMiddle', e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={visuals.heroBgGradientMiddle || '#cc142a'}
                    onChange={(e) => updateVisualField('heroBgGradientMiddle', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">3. Warna Akhir (Kanan)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.heroBgGradientEnd || '#990d1c'}
                    onChange={(e) => updateVisualField('heroBgGradientEnd', e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={visuals.heroBgGradientEnd || '#990d1c'}
                    onChange={(e) => updateVisualField('heroBgGradientEnd', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="heroPattern"
                checked={visuals.heroOverlayPattern !== false}
                onChange={(e) => updateVisualField('heroOverlayPattern', e.target.checked)}
                className="w-4 h-4 text-[#800016] rounded border-zinc-300"
              />
              <label htmlFor="heroPattern" className="text-zinc-700 font-medium cursor-pointer">
                Tampilkan pola overlay titik-titik halus pada background hero
              </label>
            </div>
          </div>

          {/* Section: Per-section Background Customization */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#800016]" />
              <span>Background Tiap Bagian Halaman (Per-Section Backgrounds)</span>
            </h3>
            <p className="text-zinc-500 mb-3">
              Kustomisasi warna background spesifik untuk setiap seksi di halaman utama website.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Bar Statistik Bawah Hero</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.statsBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('statsBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.statsBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('statsBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Seksi Lapor BEM FEB</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.laporSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('laporSectionBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.laporSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('laporSectionBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Seksi Profil & Kabinet</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.aboutSectionBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('aboutSectionBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.aboutSectionBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('aboutSectionBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Seksi Warta & Kajian</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.postsSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('postsSectionBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.postsSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('postsSectionBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Seksi Program Kerja</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.prokerSectionBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('prokerSectionBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.prokerSectionBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('prokerSectionBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <label className="block font-semibold text-zinc-800 mb-1">Seksi Unduhan Dokumen SOP</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.downloadsSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('downloadsSectionBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.downloadsSectionBackground || '#fcfcfd'}
                    onChange={(e) => updateVisualField('downloadsSectionBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: HERO & MAJALAH E-MAGAZINE (SLIDER & CONTENT)
          ========================================================================= */}
      {activeTab === 'hero_magazine' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-6 text-xs">
          {/* Hero Banner Background Image */}
          <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-3">
            <div>
              <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#800016]" />
                <span>Foto Latar Belakang Kampus Hero (Campus Banner)</span>
              </h4>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                Foto gedung kampus / rektorat UTU yang menjadi latar belakang sinergis di bagian atas hero banner website.
              </p>
            </div>
            <ImageUploadField
              label="Foto Kampus Utama (Hero Campus Image)"
              description="Gambar lanskap beresolusi tinggi untuk latar belakang hero banner"
              recommendedSize="Rasio 16:9 atau 21:9 Landscape (disarankan 1920x1080, maks 8MB)"
              aspectRatio="banner"
              value={formData.heroImage || ''}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              allowGallery={true}
            />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 pt-2">
            <div>
              <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#800016]" />
                <span>Manajemen Slide Hero & Majalah E-Magazine ({currentSlides.length} Slide)</span>
              </h3>
              <p className="text-zinc-500 mt-0.5">
                Kelola mockup majalah, teks berita, foto duta mahasiswa, edisi, dan tombol CTA.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSlide}
              className="px-3 py-1.5 bg-[#800016] hover:bg-[#680012] text-white rounded font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Slide Baru</span>
            </button>
          </div>

          {/* Slide selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {currentSlides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                type="button"
                onClick={() => setSelectedSlideIndex(idx)}
                className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  selectedSlideIndex === idx
                    ? 'bg-[#800016] text-white font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <span>Slide 0{idx + 1}: {slide.magazineName}</span>
                {currentSlides.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(idx);
                    }}
                    className="hover:text-red-300 p-0.5"
                    title="Hapus Slide"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Active Slide Form */}
          {currentSlides[selectedSlideIndex] && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Hashtag / Kicker Kiri</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].hashtag}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'hashtag', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded font-mono text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Nama Majalah (Display Title)</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].magazineName}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'magazineName', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded font-bold text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Judul Utama Hero (Kolom Kiri)</label>
                <input
                  type="text"
                  value={currentSlides[selectedSlideIndex].title}
                  onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded font-semibold text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Subjudul / Deskripsi Hero</label>
                <textarea
                  rows={2}
                  value={currentSlides[selectedSlideIndex].subtitle}
                  onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'subtitle', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Teks Tombol 1</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].ctaText}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'ctaText', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Teks Tombol 2 (Lapor BEM)</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].secondaryCtaText || ''}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'secondaryCtaText', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                  />
                </div>
              </div>

              {/* Magazine Cover Card Details */}
              <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-3.5">
                <h4 className="font-bold text-zinc-900 border-b border-zinc-200 pb-1.5">
                  Pengaturan Kartu Sampul Majalah (Kolom Kanan)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-700 mb-1">Header Atas Majalah</label>
                    <input
                      type="text"
                      value={currentSlides[selectedSlideIndex].magazineHeader}
                      onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'magazineHeader', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 mb-1">Tag Edisi / Tanggal</label>
                    <input
                      type="text"
                      value={currentSlides[selectedSlideIndex].edition}
                      onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'edition', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded font-mono text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Judul Berita Utama Sampul</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].articleHeadline}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'articleHeadline', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-700 mb-1">Nama Mahasiswa Sampul</label>
                    <input
                      type="text"
                      value={currentSlides[selectedSlideIndex].studentName}
                      onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'studentName', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 mb-1">Peran / Jabatan Duta</label>
                    <input
                      type="text"
                      value={currentSlides[selectedSlideIndex].studentRole}
                      onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'studentRole', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Kutipan / Headline Mahasiswa di Bawah</label>
                  <input
                    type="text"
                    value={currentSlides[selectedSlideIndex].studentHeadline}
                    onChange={(e) => handleUpdateSlideField(selectedSlideIndex, 'studentHeadline', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-200 space-y-3">
                  <ImageUploadField
                    label="Foto Sampul Majalah Mahasiswa (Cover Image)"
                    description="Foto profil duta mahasiswa atau isu utama pada sampul majalah"
                    recommendedSize="Rasio 3:4 atau Portrait (JPG/PNG/WebP, maks 8MB)"
                    aspectRatio="portrait"
                    value={currentSlides[selectedSlideIndex].coverImage}
                    onChange={(url) => handleUpdateSlideField(selectedSlideIndex, 'coverImage', url)}
                    allowGallery={true}
                  />

                  <ImageUploadField
                    label="Foto Miniatur / Inset Aktivitas Mahasiswa"
                    description="Foto kotak kecil di dalam sampul majalah (menampilkan aktivitas forum/kegiatan BEM)"
                    recommendedSize="Rasio 4:3 atau Square"
                    aspectRatio="cover"
                    value={currentSlides[selectedSlideIndex].insetThumbnail || '/src/assets/images/bem_activity_forum_1792265589704.jpg'}
                    onChange={(url) => handleUpdateSlideField(selectedSlideIndex, 'insetThumbnail', url)}
                    allowGallery={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: HEADER & BILAH ATAS (TOP BAR & NAVBAR)
          ========================================================================= */}
      {activeTab === 'header_topbar' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-6 text-xs">
          {/* Top Bar Settings */}
          <div>
            <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center justify-between">
              <span>Bilah Atas Utilitas (Top Utility Bar)</span>
              <label className="flex items-center gap-1.5 text-xs font-normal cursor-pointer">
                <input
                  type="checkbox"
                  checked={visuals.topBarEnabled !== false}
                  onChange={(e) => updateVisualField('topBarEnabled', e.target.checked)}
                  className="w-3.5 h-3.5 text-[#800016] rounded"
                />
                <span>Aktifkan Bilah Atas</span>
              </label>
            </h3>
            <p className="text-zinc-500 mb-3">Atur warna, kontak, lokasi cuaca, dan tautan media sosial.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Background Top Bar</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.topBarBackground || '#f8f9fa'}
                    onChange={(e) => updateVisualField('topBarBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.topBarBackground || '#f8f9fa'}
                    onChange={(e) => updateVisualField('topBarBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Warna Teks Top Bar</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.topBarTextColor || '#374151'}
                    onChange={(e) => updateVisualField('topBarTextColor', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.topBarTextColor || '#374151'}
                    onChange={(e) => updateVisualField('topBarTextColor', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={visuals.topBarPhone || ''}
                  onChange={(e) => updateVisualField('topBarPhone', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Email Sekretariat</label>
                <input
                  type="text"
                  value={visuals.topBarEmail || ''}
                  onChange={(e) => updateVisualField('topBarEmail', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Teks Lokasi / Cuaca</label>
                <input
                  type="text"
                  value={visuals.topBarLocation || ''}
                  onChange={(e) => updateVisualField('topBarLocation', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>
            </div>

            {/* Social Media URLs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
              <div>
                <label className="block font-medium text-zinc-600 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={visuals.facebookUrl || ''}
                  onChange={(e) => updateVisualField('facebookUrl', e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-[11px]"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-600 mb-1">Twitter / X URL</label>
                <input
                  type="text"
                  value={visuals.twitterUrl || ''}
                  onChange={(e) => updateVisualField('twitterUrl', e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-[11px]"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-600 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={visuals.instagramUrl || ''}
                  onChange={(e) => updateVisualField('instagramUrl', e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-[11px]"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-600 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={visuals.youtubeUrl || ''}
                  onChange={(e) => updateVisualField('youtubeUrl', e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Main Header Settings & Logo Upload */}
          <div className="pt-4 border-t border-zinc-100 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
                <Layout className="w-4 h-4 text-[#800016]" />
                <span>Upload Logo & Identitas Header Portal</span>
              </h3>
              <p className="text-zinc-500">
                Upload logo resmi BEM FEB atau Universitas Teuku Umar (PNG transparan, JPG, WebP, SVG) yang akan langsung tampil di navbar dan bilah atas.
              </p>
            </div>

            {/* Logo Upload Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField
                label="1. Logo Utama (Header & Navbar)"
                description="Logo utama di bilah navigasi atas website"
                recommendedSize="PNG Transparan / SVG, maks 4MB"
                aspectRatio="logo"
                value={visuals.logoUrl || ''}
                onChange={(url) => updateVisualField('logoUrl', url)}
                allowLogoPresets={true}
              />

              <ImageUploadField
                label="2. Logo Sekunder / Universitas Teuku Umar (Opsional)"
                description="Logo pendamping kedua (misal: Lambang UTU / Kemendikbud)"
                recommendedSize="PNG Transparan / SVG"
                aspectRatio="logo"
                value={visuals.secondaryLogoUrl || ''}
                onChange={(url) => updateVisualField('secondaryLogoUrl', url)}
                allowLogoPresets={true}
              />
            </div>

            {/* Logo Size & Mode Controls */}
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Tinggi Logo di Header ({visuals.logoHeight || 44}px)
                </label>
                <input
                  type="range"
                  min="28"
                  max="64"
                  value={visuals.logoHeight || 44}
                  onChange={(e) => updateVisualField('logoHeight', Number(e.target.value))}
                  className="w-full accent-[#800016] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 sm:pt-4">
                <input
                  type="checkbox"
                  id="showEmblemWithLogo"
                  checked={visuals.showEmblemWithLogo || false}
                  onChange={(e) => updateVisualField('showEmblemWithLogo', e.target.checked)}
                  className="w-4 h-4 text-[#800016] rounded border-zinc-300"
                />
                <label htmlFor="showEmblemWithLogo" className="text-zinc-700 font-medium cursor-pointer">
                  Tampilkan emblem teks di samping logo
                </label>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Teks Emblem Cadangan</label>
                <input
                  type="text"
                  value={visuals.logoEmblemText || 'UTU'}
                  onChange={(e) => updateVisualField('logoEmblemText', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded font-bold uppercase text-zinc-900"
                  placeholder="UTU"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Background Header Utama</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.headerBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('headerBackground', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.headerBackground || '#ffffff'}
                    onChange={(e) => updateVisualField('headerBackground', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Warna Latar Logo Emblem</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.logoEmblemBg || '#800016'}
                    onChange={(e) => updateVisualField('logoEmblemBg', e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.logoEmblemBg || '#800016'}
                    onChange={(e) => updateVisualField('logoEmblemBg', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Teks Logo Emblem</label>
                <input
                  type="text"
                  value={visuals.logoEmblemText || 'UTU'}
                  onChange={(e) => updateVisualField('logoEmblemText', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded font-bold uppercase text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Teks Tombol Aksi Header</label>
                <input
                  type="text"
                  value={visuals.headerCtaText || 'Ajukan Aduan'}
                  onChange={(e) => updateVisualField('headerCtaText', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Warna Tombol Aksi Header</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={visuals.headerCtaBg || '#800016'}
                    onChange={(e) => updateVisualField('headerCtaBg', e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={visuals.headerCtaBg || '#800016'}
                    onChange={(e) => updateVisualField('headerCtaBg', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-50 rounded border border-zinc-200">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Judul Kiri (Kop Utama)</label>
                <input
                  type="text"
                  value={visuals.headerTitle1 || ''}
                  onChange={(e) => updateVisualField('headerTitle1', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-900"
                />
                <label className="block font-medium text-zinc-500 mt-2 mb-1">Subjudul Kiri</label>
                <input
                  type="text"
                  value={visuals.headerSubtitle1 || ''}
                  onChange={(e) => updateVisualField('headerSubtitle1', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Judul Kanan (Kop Fakultas)</label>
                <input
                  type="text"
                  value={visuals.headerTitle2 || ''}
                  onChange={(e) => updateVisualField('headerTitle2', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-900"
                />
                <label className="block font-medium text-zinc-500 mt-2 mb-1">Subjudul Kanan</label>
                <input
                  type="text"
                  value={visuals.headerSubtitle2 || ''}
                  onChange={(e) => updateVisualField('headerSubtitle2', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-zinc-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: STATISTIK & TOMBOL FLOATING (METRICS & WHATSAPP)
          ========================================================================= */}
      {activeTab === 'stats_floating' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-6 text-xs">
          {/* Quick Stats Strip */}
          <div>
            <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#800016]" />
              <span>4 Kartu Statistik Cepat di Bawah Hero Banner</span>
            </h3>
            <p className="text-zinc-500 mb-3">Atur angka, judul, dan keterangan untuk masing-masing kartu.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-bold text-zinc-800">Kartu Metrik 1</span>
                <div>
                  <label className="block text-[11px] text-zinc-500">Angka</label>
                  <input
                    type="text"
                    value={visuals.stat1Number || ''}
                    onChange={(e) => updateVisualField('stat1Number', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Judul</label>
                  <input
                    type="text"
                    value={visuals.stat1Title || ''}
                    onChange={(e) => updateVisualField('stat1Title', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Keterangan</label>
                  <input
                    type="text"
                    value={visuals.stat1Desc || ''}
                    onChange={(e) => updateVisualField('stat1Desc', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-bold text-zinc-800">Kartu Metrik 2</span>
                <div>
                  <label className="block text-[11px] text-zinc-500">Angka</label>
                  <input
                    type="text"
                    value={visuals.stat2Number || ''}
                    onChange={(e) => updateVisualField('stat2Number', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Judul</label>
                  <input
                    type="text"
                    value={visuals.stat2Title || ''}
                    onChange={(e) => updateVisualField('stat2Title', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Keterangan</label>
                  <input
                    type="text"
                    value={visuals.stat2Desc || ''}
                    onChange={(e) => updateVisualField('stat2Desc', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-bold text-zinc-800">Kartu Metrik 3</span>
                <div>
                  <label className="block text-[11px] text-zinc-500">Angka</label>
                  <input
                    type="text"
                    value={visuals.stat3Number || ''}
                    onChange={(e) => updateVisualField('stat3Number', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Judul</label>
                  <input
                    type="text"
                    value={visuals.stat3Title || ''}
                    onChange={(e) => updateVisualField('stat3Title', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Keterangan</label>
                  <input
                    type="text"
                    value={visuals.stat3Desc || ''}
                    onChange={(e) => updateVisualField('stat3Desc', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-bold text-zinc-800">Kartu Metrik 4</span>
                <div>
                  <label className="block text-[11px] text-zinc-500">Angka</label>
                  <input
                    type="text"
                    value={visuals.stat4Number || ''}
                    onChange={(e) => updateVisualField('stat4Number', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Judul</label>
                  <input
                    type="text"
                    value={visuals.stat4Title || ''}
                    onChange={(e) => updateVisualField('stat4Title', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500">Keterangan</label>
                  <input
                    type="text"
                    value={visuals.stat4Desc || ''}
                    onChange={(e) => updateVisualField('stat4Desc', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons Settings */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Tombol Mengambang Pojok Kanan Bawah (Floating Buttons)</span>
            </h3>
            <p className="text-zinc-500 mb-3">Kustomisasi tombol WhatsApp Layanan 24 Jam dan shortcut lainnya.</p>

            <div className="p-4 bg-zinc-50 rounded border border-zinc-200 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waEnabled"
                  checked={visuals.whatsappButtonEnabled !== false}
                  onChange={(e) => updateVisualField('whatsappButtonEnabled', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="waEnabled" className="font-semibold text-zinc-800 cursor-pointer">
                  Tampilkan Tombol WhatsApp Mengambang (Pill Button)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Teks Tombol</label>
                  <input
                    type="text"
                    value={visuals.whatsappButtonText || 'Layanan 24 Jam'}
                    onChange={(e) => updateVisualField('whatsappButtonText', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Warna Background Tombol</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={visuals.whatsappButtonBg || '#25D366'}
                      onChange={(e) => updateVisualField('whatsappButtonBg', e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={visuals.whatsappButtonBg || '#25D366'}
                      onChange={(e) => updateVisualField('whatsappButtonBg', e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Nomor WhatsApp Tujuan</label>
                  <input
                    type="text"
                    value={formData.contact.whatsappAdvokesma}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, whatsappAdvokesma: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded font-mono text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-zinc-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visuals.accessibilityButtonEnabled !== false}
                    onChange={(e) => updateVisualField('accessibilityButtonEnabled', e.target.checked)}
                    className="w-3.5 h-3.5 text-[#800016] rounded"
                  />
                  <span>Tampilkan Tombol Aksesibilitas (文A)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visuals.trackerButtonEnabled !== false}
                    onChange={(e) => updateVisualField('trackerButtonEnabled', e.target.checked)}
                    className="w-3.5 h-3.5 text-[#800016] rounded"
                  />
                  <span>Tampilkan Tombol Pelacak Tiket Aduan (🔍)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SEKSI LAPOR BEM FEB (ADVOCACY SECTION)
          ========================================================================= */}
      {activeTab === 'lapor_advokasi' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#800016]" />
            <span>Kustomisasi Teks & Tampilan Seksi Lapor BEM FEB</span>
          </h3>
          <p className="text-zinc-500 mb-3">
            Atur judul pengaduan, pengantar layanan advokasi, dan teks pada tombol buat aduan mahasiswa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Subjudul Kicker Seksi</label>
              <input
                type="text"
                value={visuals.laporSubtitle || ''}
                onChange={(e) => updateVisualField('laporSubtitle', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Judul Utama Seksi Lapor</label>
              <input
                type="text"
                value={visuals.laporTitle || ''}
                onChange={(e) => updateVisualField('laporTitle', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded font-bold text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Deskripsi Penjelasan Pengaduan</label>
            <textarea
              rows={3}
              value={visuals.laporDescription || ''}
              onChange={(e) => updateVisualField('laporDescription', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Teks Tombol Buat Aduan</label>
              <input
                type="text"
                value={visuals.laporCtaButtonText || '+ Buat Aduan Mahasiswa'}
                onChange={(e) => updateVisualField('laporCtaButtonText', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Warna Background Seksi Lapor</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={visuals.laporSectionBackground || '#fcfcfd'}
                  onChange={(e) => updateVisualField('laporSectionBackground', e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={visuals.laporSectionBackground || '#fcfcfd'}
                  onChange={(e) => updateVisualField('laporSectionBackground', e.target.value)}
                  className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: PRESIDIUM & VISI MISI
          ========================================================================= */}
      {activeTab === 'identity_presidium' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-6 text-xs">
          {/* Identitas Organisasi */}
          <div>
            <h3 className="font-bold text-sm text-zinc-950 mb-1">Identitas Organisasi & Kabinet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Organisasi</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Singkatan</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Kabinet</label>
                <input
                  type="text"
                  value={formData.cabinetName}
                  onChange={(e) => setFormData({ ...formData, cabinetName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Sambutan Presidium */}
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-950 mb-3">Data Pimpinan Presidium (Ketua & Wakil)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-semibold text-zinc-800">Ketua BEM</span>
                <input
                  type="text"
                  placeholder="Nama Ketua..."
                  value={formData.sambutan.ketuaName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sambutan: { ...formData.sambutan, ketuaName: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-medium"
                />
                <input
                  type="text"
                  placeholder="NIM Ketua..."
                  value={formData.sambutan.ketuaNim}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sambutan: { ...formData.sambutan, ketuaNim: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                />
              </div>

              <div className="p-3 bg-zinc-50 rounded border border-zinc-200 space-y-2">
                <span className="font-semibold text-zinc-800">Wakil Ketua BEM</span>
                <input
                  type="text"
                  placeholder="Nama Wakil..."
                  value={formData.sambutan.wakilName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sambutan: { ...formData.sambutan, wakilName: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-medium"
                />
                <input
                  type="text"
                  placeholder="NIM Wakil..."
                  value={formData.sambutan.wakilNim}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sambutan: { ...formData.sambutan, wakilNim: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Presidium Leaders Photo Upload */}
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <ImageUploadField
                label="Foto Resmi Pimpinan Presidium (Ketua & Wakil)"
                description="Foto bersama pimpinan presidium BEM FEB untuk kartu sambutan di seksi Tentang Kabinet"
                recommendedSize="Rasio 4:3 Landscape, disarankan resolusi tajam (JPG/PNG, maks 8MB)"
                aspectRatio="cover"
                value={formData.sambutan.leadersImage || '/src/assets/images/utu_presidium_maroon_1792267123349.jpg'}
                onChange={(url) =>
                  setFormData({
                    ...formData,
                    sambutan: { ...formData.sambutan, leadersImage: url },
                  })
                }
                allowGallery={true}
              />
            </div>

            <div className="mt-3">
              <label className="block font-medium text-zinc-700 mb-1">Kutipan / Quote Presidium</label>
              <input
                type="text"
                value={formData.sambutan.quote}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sambutan: { ...formData.sambutan, quote: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded italic text-zinc-900"
              />
            </div>

            <div className="mt-3">
              <label className="block font-medium text-zinc-700 mb-1">Teks Sambutan Lengkap</label>
              <textarea
                rows={3}
                value={formData.sambutan.fullMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sambutan: { ...formData.sambutan, fullMessage: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 leading-relaxed"
              />
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <h3 className="font-bold text-sm text-zinc-950">Visi & Misi Organisasi</h3>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Visi Kabinet</label>
              <textarea
                rows={2}
                value={formData.visi}
                onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-medium text-zinc-700">Butir Misi Kabinet</label>
                <button
                  type="button"
                  onClick={handleAddMisi}
                  className="text-xs text-[#800016] font-semibold hover:underline cursor-pointer"
                >
                  + Tambah Butir Misi
                </button>
              </div>
              <div className="space-y-2">
                {formData.misi.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-zinc-400 mt-2 text-[11px] font-bold">0{idx + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleMisiChange(idx, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMisi(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: KONTAK & FOOTER
          ========================================================================= */}
      {activeTab === 'contact_footer' && (
        <div className="bg-white p-6 rounded border border-zinc-200 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-zinc-950 mb-1 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#800016]" />
            <span>Kontak Sekretariat & Kustomisasi Footer</span>
          </h3>
          <p className="text-zinc-500 mb-3">Atur alamat sekretariat, warna footer, dan rincian kontak resmi.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Warna Background Footer</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={visuals.footerBackground || '#09090b'}
                  onChange={(e) => updateVisualField('footerBackground', e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={visuals.footerBackground || '#09090b'}
                  onChange={(e) => updateVisualField('footerBackground', e.target.value)}
                  className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Warna Teks Footer</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={visuals.footerTextColor || '#a1a1aa'}
                  onChange={(e) => updateVisualField('footerTextColor', e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={visuals.footerTextColor || '#a1a1aa'}
                  onChange={(e) => updateVisualField('footerTextColor', e.target.value)}
                  className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-300 rounded font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Alamat Gedung Sekretariat</label>
            <textarea
              rows={2}
              value={formData.contact.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, address: e.target.value },
                })
              }
              className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">Email Resmi</label>
              <input
                type="text"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">Instagram (@)</label>
              <input
                type="text"
                value={formData.contact.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, instagram: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">LinkedIn</label>
              <input
                type="text"
                value={formData.contact.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, linkedin: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-zinc-900"
              />
            </div>
          </div>

          {/* Footer Logo Upload */}
          <div className="pt-4 border-t border-zinc-100">
            <ImageUploadField
              label="Logo Khusus Footer (Opsional)"
              description="Upload logo versi footer (bisa putih monokrom atau logo alternatif). Jika dikosongkan, footer akan otomatis memakai logo utama atau emblem."
              recommendedSize="PNG Transparan / SVG"
              aspectRatio="logo"
              value={visuals.footerLogoUrl || ''}
              onChange={(url) => updateVisualField('footerLogoUrl', url)}
              allowLogoPresets={true}
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Floating Bar for Fast Save */}
      <div className="bg-white p-4 rounded border border-zinc-200 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset seluruh konfigurasi ke nilai bawaan pabrik?')) {
              resetSiteConfig();
            }
          }}
          className="text-xs text-zinc-500 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Setelan Awal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {}}
            className="px-3.5 py-1.5 border border-zinc-300 hover:bg-zinc-100 rounded text-zinc-700 text-xs font-medium cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-1.5 bg-[#800016] hover:bg-[#680012] text-white rounded text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
