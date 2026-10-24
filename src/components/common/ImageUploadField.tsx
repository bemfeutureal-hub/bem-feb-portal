import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link2, Trash2, Check, RefreshCw } from 'lucide-react';

export interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  recommendedSize?: string;
  aspectRatio?: 'square' | 'cover' | 'logo' | 'banner' | 'portrait' | 'auto';
  allowGallery?: boolean;
  allowLogoPresets?: boolean;
  compact?: boolean;
}

// Built-in high-quality assets available in the project
export const PRESET_GALLERY_IMAGES = [
  {
    name: 'Gedung Rektorat & Kampus UTU Maroon',
    url: '/src/assets/images/utu_campus_maroon_1792267122815.jpg',
    category: 'Kampus',
  },
  {
    name: 'Presidium Pimpinan BEM FEB Maroon',
    url: '/src/assets/images/utu_presidium_maroon_1792267123349.jpg',
    category: 'Pimpinan',
  },
  {
    name: 'Cover E-Magazine Mahasiswa FEB',
    url: '/src/assets/images/magazine_cover_student_1792267862943.jpg',
    category: 'Majalah',
  },
  {
    name: 'Aktivitas Forum & Diskusi Ormawa',
    url: '/src/assets/images/bem_activity_forum_1792265589704.jpg',
    category: 'Kegiatan',
  },
  {
    name: 'Workshop & Pelatihan Mahasiswa',
    url: '/src/assets/images/bem_activity_workshop_1792265590821.jpg',
    category: 'Kegiatan',
  },
  {
    name: 'Gedung Fakultas Ekonomi & Bisnis',
    url: '/src/assets/images/bem_hero_campus_1792265588786.jpg',
    category: 'Kampus',
  },
  {
    name: 'Jajaran Presidium BEM FEB Formal',
    url: '/src/assets/images/bem_presidium_leaders_1792265589755.jpg',
    category: 'Pimpinan',
  },
];

// Clean vector-styled logo presets for immediate use
export const PRESET_LOGOS = [
  {
    name: 'Logo BEM FEB UTU (Badge Maroon Emas)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><defs><linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23800016"/><stop offset="100%" stop-color="%234a000d"/></linearGradient></defs><circle cx="100" cy="100" r="94" fill="url(%23mGrad)" stroke="%23f59e0b" stroke-width="6"/><circle cx="100" cy="100" r="82" fill="none" stroke="%23ffffff" stroke-width="2" stroke-dasharray="4 3"/><path d="M100 32 L142 62 L142 122 L100 156 L58 122 L58 62 Z" fill="%23ffffff" opacity="0.12"/><path d="M100 42 L132 66 L132 116 L100 144 L68 116 L68 66 Z" fill="none" stroke="%23f59e0b" stroke-width="3"/><text x="100" y="85" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="1">BEM</text><text x="100" y="112" font-family="Arial,sans-serif" font-weight="800" font-size="20" fill="%23f59e0b" text-anchor="middle" letter-spacing="2">FEB</text><text x="100" y="132" font-family="Arial,sans-serif" font-weight="700" font-size="14" fill="%23ffffff" text-anchor="middle" letter-spacing="3">UTU</text><circle cx="100" cy="166" r="3" fill="%23f59e0b"/></svg>`,
  },
  {
    name: 'Logo Universitas Teuku Umar (Emblem UTU)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="92" fill="%23ffffff" stroke="%23800016" stroke-width="8"/><circle cx="100" cy="100" r="76" fill="%23800016"/><circle cx="100" cy="100" r="64" fill="%23ffffff"/><polygon points="100,52 135,138 65,138" fill="%23800016"/><polygon points="100,72 122,128 78,128" fill="%23f59e0b"/><text x="100" y="115" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%23800016" text-anchor="middle">UTU</text><text x="100" y="178" font-family="Arial,sans-serif" font-weight="bold" font-size="10" fill="%23800016" text-anchor="middle" letter-spacing="1">TEUKU UMAR</text></svg>`,
  },
  {
    name: 'Logo Minimalis Simbolis (Monokrom Gelap)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="40" fill="%2309090b"/><text x="100" y="95" font-family="system-ui,sans-serif" font-weight="900" font-size="34" fill="%23ffffff" text-anchor="middle">FEB</text><rect x="40" y="110" width="120" height="4" fill="%23800016" rx="2"/><text x="100" y="140" font-family="system-ui,sans-serif" font-weight="700" font-size="18" fill="%23f59e0b" text-anchor="middle">UTU MEULABOH</text></svg>`,
  },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  description,
  recommendedSize,
  aspectRatio = 'cover',
  allowGallery = true,
  allowLogoPresets = false,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [tempUrl, setTempUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle local file read & conversion to Data URL (base64)
  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('File harus berupa gambar (JPG, PNG, WebP, atau SVG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar (maksimal 8MB). Silakan kompres gambar terlebih dahulu.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file gambar.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so user can re-upload same file if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setTempUrl('');
      setErrorMsg(null);
    }
  };

  // Aspect ratio class helpers
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'logo'
      ? 'aspect-video sm:aspect-square max-h-24'
      : aspectRatio === 'banner'
      ? 'aspect-21/9'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : 'aspect-4/3';

  return (
    <div className="space-y-2 text-xs">
      {/* Label & Recommended Size Info */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="font-semibold text-zinc-900">{label}</label>
        {recommendedSize && (
          <span className="text-[10px] text-zinc-400 font-mono">{recommendedSize}</span>
        )}
      </div>

      {description && <p className="text-[11px] text-zinc-500">{description}</p>}

      {/* Main Container */}
      <div className="bg-zinc-50/80 rounded border border-zinc-200 p-3 space-y-3">
        {/* Current Preview Card */}
        <div className="flex items-start gap-3">
          <div
            className={`relative rounded border border-zinc-300 bg-white overflow-hidden shrink-0 shadow-2xs flex items-center justify-center ${
              aspectRatio === 'logo' ? 'w-20 h-20 p-1.5' : 'w-24 h-24'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt={label}
                className={`w-full h-full ${
                  aspectRatio === 'logo' ? 'object-contain' : 'object-cover'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f4f4f5" width="100" height="100"/><text x="50" y="55" font-size="10" text-anchor="middle" fill="%23a1a1aa">Gambar Rusak</text></svg>';
                }}
              />
            ) : (
              <div className="text-zinc-400 flex flex-col items-center justify-center p-2 text-center">
                <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                <span className="text-[9px] leading-tight">Belum Ada</span>
              </div>
            )}
          </div>

          {/* Action buttons & mode switcher */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'upload'
                    ? 'bg-[#800016] text-white shadow-2xs'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
              </button>

              {allowLogoPresets && (
                <button
                  type="button"
                  onClick={() => setMode('presets')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    mode === 'presets'
                      ? 'bg-[#800016] text-white shadow-2xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Logo Preset</span>
                </button>
              )}

              {allowGallery && !allowLogoPresets && (
                <button
                  type="button"
                  onClick={() => setMode('presets')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    mode === 'presets'
                      ? 'bg-[#800016] text-white shadow-2xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Galeri Aset</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMode('url')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'url'
                    ? 'bg-[#800016] text-white shadow-2xs'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Link2 className="w-3 h-3" />
                <span>Input URL</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2 py-1 text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded text-[11px] transition-colors cursor-pointer ml-auto flex items-center gap-1"
                  title="Hapus gambar saat ini"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              )}
            </div>

            {/* Mode 1: Drag & Drop / File Input */}
            {mode === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded p-3 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#800016] bg-rose-50/50'
                      : 'border-zinc-300 hover:border-zinc-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 text-zinc-600">
                    <Upload className="w-4 h-4 text-[#800016]" />
                    <span className="font-semibold text-[11px] text-zinc-800">
                      {loading ? 'Memproses gambar...' : 'Klik untuk pilih foto / drag & drop'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Mendukung PNG, JPG, WebP, SVG transparan (maks 8MB)
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Direct URL */}
            {mode === 'url' && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="https://... atau path gambar"
                  value={tempUrl || value}
                  onChange={(e) => setTempUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 bg-[#800016] text-white rounded font-medium text-[11px] hover:bg-[#680012] transition-colors cursor-pointer shrink-0"
                >
                  Terapkan
                </button>
              </div>
            )}

            {/* Mode 3: Presets (Logo or Photo Assets) */}
            {mode === 'presets' && (
              <div className="space-y-2">
                <div className="text-[10px] text-zinc-500 font-medium">
                  {allowLogoPresets ? 'Pilih logo siap pakai bawaan portal:' : 'Pilih dari foto resmi kampus & BEM:'}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 bg-white rounded border border-zinc-200">
                  {allowLogoPresets
                    ? PRESET_LOGOS.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onChange(item.url)}
                          className={`p-2 rounded border text-left cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                            value === item.url
                              ? 'border-[#800016] bg-rose-50/50 ring-1 ring-[#800016]'
                              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="w-12 h-12 flex items-center justify-center p-1 bg-white rounded border border-zinc-150">
                            <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-800 text-center line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                      ))
                    : PRESET_GALLERY_IMAGES.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => onChange(item.url)}
                          className={`relative rounded border overflow-hidden cursor-pointer group ${
                            value === item.url
                              ? 'border-[#800016] ring-2 ring-[#800016]'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                            <span className="text-[9px] text-white font-medium leading-tight line-clamp-1">
                              {item.name}
                            </span>
                          </div>
                          {value === item.url && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#800016] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-600 text-[11px] font-medium animate-in fade-in">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
