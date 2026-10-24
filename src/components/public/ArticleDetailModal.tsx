import React from 'react';
import { useBEM } from '../../context/BEMContext';
import { X, Eye } from 'lucide-react';

export const ArticleDetailModal: React.FC = () => {
  const { selectedPost, setSelectedPost, siteConfig } = useBEM();

  if (!selectedPost) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-zinc-200 shadow-xl w-full max-w-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
            <span>{selectedPost.category}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <button
            onClick={() => setSelectedPost(null)}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Content */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight leading-snug mb-3 [text-wrap:balance]">
            {selectedPost.title}
          </h2>

          {/* Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-500 pb-4 mb-5 border-b border-zinc-150 font-mono">
            <span className="text-zinc-800 font-medium">{selectedPost.author}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedPost.authorRole}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedPost.date}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="tabular-nums">{selectedPost.views} pembaca</span>
            </span>
          </div>

          {/* Featured Image */}
          {selectedPost.featuredImage && (
            <div className="relative rounded overflow-hidden border border-zinc-200 mb-5 max-h-80">
              <img
                src={selectedPost.featuredImage}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Text Body */}
          <div className="text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-3.5 whitespace-pre-line font-normal">
            {selectedPost.content}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-400 font-normal">
            <span>{siteConfig.shortName} · {siteConfig.cabinetName}</span>
            <button
              onClick={() => setSelectedPost(null)}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium rounded transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
