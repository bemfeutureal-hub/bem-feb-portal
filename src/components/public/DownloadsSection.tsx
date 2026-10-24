import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { FileText, Download, Check } from 'lucide-react';

export const DownloadsSection: React.FC = () => {
  const { downloads, showToast, siteConfig } = useBEM();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (doc: typeof downloads[0]) => {
    setDownloadedId(doc.id);
    showToast(`Mengunduh: ${doc.title}`);
    if (doc.downloadUrl && doc.downloadUrl !== '#') {
      if (doc.downloadUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = doc.downloadUrl;
        a.download = `${doc.title}.${doc.fileType.toLowerCase()}`;
        a.click();
      } else {
        window.open(doc.downloadUrl, '_blank', 'noopener');
      }
    }
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <section
      id="dokumen"
      style={{ backgroundColor: siteConfig.visuals?.downloadsSectionBackground || '#fcfcfd' }}
      className="py-14 sm:py-20 border-b border-zinc-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">
              Bank Dokumen & Regulasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight [text-wrap:balance]">
              Unduhan SOP & Panduan
            </h2>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm sm:text-right font-normal">
            Template resmi surat dispensasi, formulir pendampingan banding UKT, dan pedoman ormawa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {downloads.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded border border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 text-zinc-700">
                  <FileText className="w-4 h-4 text-zinc-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-950 leading-snug">{doc.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 mt-1 font-mono">
                    <span className="font-medium text-zinc-700">{doc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.fileType} ({doc.fileSize})</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.updatedDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                title="Unduh Dokumen"
              >
                {downloadedId === doc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersimpan</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Unduh</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
