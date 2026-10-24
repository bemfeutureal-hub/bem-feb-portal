import React from 'react';
import { useBEM } from '../../context/BEMContext';
import { Mail, Phone, MapPin, Settings } from 'lucide-react';
import { PublicPage } from '../../App';

interface PublicFooterProps {
  onNavigate?: (page: PublicPage) => void;
  onAdminClick?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onAdminClick }) => {
  const { siteConfig } = useBEM();
  const visuals = siteConfig.visuals;

  const navTo = (page: PublicPage) => {
    if (onNavigate) { onNavigate(page); window.scrollTo({ top: 0 }); }
  };

  return (
    <footer
      style={{
        backgroundColor: visuals?.footerBackground || '#09090b',
        color: visuals?.footerTextColor || '#a1a1aa',
      }}
      className="text-xs border-t border-white/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-3">
              {visuals?.footerLogoUrl || visuals?.logoUrl ? (
                <img
                  src={visuals?.footerLogoUrl || visuals?.logoUrl}
                  alt={siteConfig.siteName}
                  className="h-8 sm:h-9 w-auto object-contain max-w-28 brightness-110 shrink-0"
                />
              ) : (
                <div
                  style={{ backgroundColor: visuals?.footerAccentBg || visuals?.logoEmblemBg || '#800016' }}
                  className="w-7 h-7 rounded text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs shrink-0"
                >
                  {visuals?.logoEmblemText || 'UTU'}
                </div>
              )}
              <span className="text-sm font-semibold text-white tracking-tight">
                {siteConfig.siteName}
              </span>
            </div>

            <p className="text-zinc-300 font-medium mb-2 text-xs">
              {siteConfig.cabinetName} ({siteConfig.period})
            </p>

            <p className="text-zinc-500 text-xs leading-relaxed mb-5 max-w-sm font-normal">
              {siteConfig.tagline}
            </p>

            <button
              onClick={onAdminClick}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span>Masuk Dashboard Pengurus (CMS)</span>
            </button>
          </div>

          {/* Col 2: Navigasi (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[11px] font-medium text-zinc-200 uppercase tracking-tight mb-2">
              Kanal Navigasi
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <button onClick={() => navTo('home')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Beranda Portal
                </button>
              </li>
              <li>
                <button onClick={() => navTo('tentang-kami')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Profil Kabinet & Visi
                </button>
              </li>
              <li>
                <button onClick={() => navTo('struktur-organisasi')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Struktur Organisasi & Teras
                </button>
              </li>
              <li>
                <button onClick={() => navTo('program-kerja')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Program Kerja Kabinet
                </button>
              </li>
              <li>
                <button onClick={() => navTo('informasi-publik')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Informasi Publik
                </button>
              </li>
              <li>
                <button onClick={() => navTo('informasi-publik-kabar-kampus')} className="hover:text-white transition-colors text-left pl-3 text-zinc-500 cursor-pointer">
                  └ Kabar Kampus
                </button>
              </li>
              <li>
                <button onClick={() => navTo('informasi-publik-kajian')} className="hover:text-white transition-colors text-left pl-3 text-zinc-500 cursor-pointer">
                  └ Kajian & Opini
                </button>
              </li>
              <li>
                <button onClick={() => navTo('informasi-publik-siaran-pers')} className="hover:text-white transition-colors text-left pl-3 text-zinc-500 cursor-pointer">
                  └ Siaran Pers
                </button>
              </li>
              <li>
                <button onClick={() => navTo('unduhan-dokumen')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Unduhan SOP & Dokumen
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sekretariat & Advokesma (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-[11px] font-medium text-zinc-200 uppercase tracking-tight mb-2">
              Sekretariat & Hotline
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <span className="text-zinc-400 leading-relaxed break-words">{siteConfig.contact.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-zinc-400">{siteConfig.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-zinc-400 font-mono">WA Advokesma: {siteConfig.contact.whatsappAdvokesma}</span>
            </div>
            <div className="pt-1 text-[11px] text-zinc-500 font-mono break-all">
              IG: {siteConfig.contact.instagram} · In: {siteConfig.contact.linkedin}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} {siteConfig.siteName}. Hak Cipta Dilindungi.</p>
          <p>Sistem Informasi Manajemen Konten & Advokasi BEM FEB</p>
        </div>
      </div>
    </footer>
  );
};
