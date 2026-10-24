import React from 'react';
import { useBEM } from '../../context/BEMContext';

export const AnnouncementBar: React.FC = () => {
  const { siteConfig, setIsLaporModalOpen } = useBEM();

  if (!siteConfig.announcementBar?.enabled || !siteConfig.announcementBar?.text) {
    return null;
  }

  const handleClickAction = () => {
    if (siteConfig.announcementBar.actionLink === '#lapor-bem') {
      setIsLaporModalOpen(true);
    } else {
      const el = document.getElementById('lapor-bem');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label="Pengumuman Penting" className="bg-zinc-100 text-zinc-700 text-xs py-2 px-4 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="font-normal text-zinc-800 flex-1 text-[11px] sm:text-xs leading-relaxed text-center sm:text-left">
          {siteConfig.announcementBar.text}
        </p>
        {siteConfig.announcementBar.actionText && (
          <button
            onClick={handleClickAction}
            className="whitespace-nowrap shrink-0 text-zinc-950 hover:underline font-medium text-xs cursor-pointer transition-colors"
          >
            {siteConfig.announcementBar.actionText} →
          </button>
        )}
      </div>
    </aside>
  );
};
