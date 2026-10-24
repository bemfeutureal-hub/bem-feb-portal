import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Post } from '../../types';
import { ArrowRight, ExternalLink, Clock, Eye } from 'lucide-react';

interface ArticlesSectionProps {
  onViewAll?: () => void;
  onOpenPost?: (postId: string) => void; // navigasi ke halaman Informasi Publik dan buka artikel
}

const getCategoryBadge = (cat: string) => {
  switch (cat) {
    case 'Kabar Kampus':         return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Kajian & Opini':       return 'text-violet-700 bg-violet-50 border-violet-200';
    case 'Siaran Pers':          return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Advokasi & Kebijakan': return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'Prestasi Mahasiswa':   return 'text-amber-700 bg-amber-50 border-amber-200';
    default:                     return 'text-zinc-600 bg-zinc-100 border-zinc-200';
  }
};

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onViewAll, onOpenPost }) => {
  const { posts, setSelectedPost, incrementPostView, siteConfig } = useBEM();
  const accentColor = siteConfig.visuals?.logoEmblemBg || '#800016';

  const categories = [
    'Semua',
    'Kabar Kampus',
    'Advokasi & Kebijakan',
    'Kajian & Opini',
    'Siaran Pers',
    'Prestasi Mahasiswa',
  ];

  const [selectedCat, setSelectedCat] = useState('Semua');

  const publishedPosts = posts.filter(
    (p) => p.status === 'published' && (selectedCat === 'Semua' || p.category === selectedCat)
  );

  const handleOpenPost = (post: Post) => {
    if (onOpenPost) {
      // Terintegrasi: buka di halaman Informasi Publik
      onOpenPost(post.slug || post.id);
    } else {
      // Fallback: modal lama
      incrementPostView(post.id);
      setSelectedPost(post);
    }
  };

  return (
    <section
      id="berita-artikel"
      style={{ backgroundColor: siteConfig.visuals?.postsSectionBackground || '#fcfcfd' }}
      className="py-14 sm:py-20 border-b border-zinc-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs text-zinc-500 font-medium mb-1">Kabar & Publikasi</div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight [text-wrap:balance]">
              Warta BEM FEB & Kajian
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors cursor-pointer font-medium ${
                    selectedCat === cat
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {onViewAll && (
              <button
                onClick={onViewAll}
                style={{ color: accentColor, borderColor: `${accentColor}40` }}
                className="flex items-center gap-1 text-xs font-semibold transition-colors px-3 py-1 rounded-full border bg-white hover:opacity-80"
              >
                <span>Lihat Semua</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {publishedPosts.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm">Belum ada artikel yang diterbitkan.</div>
        ) : (
          <>
            {/* Featured article — first post, full width */}
            {selectedCat === 'Semua' && publishedPosts[0] && (
              <div
                onClick={() => handleOpenPost(publishedPosts[0])}
                className="group mb-8 bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 aspect-video lg:aspect-auto lg:min-h-56 bg-zinc-100 overflow-hidden">
                    <img
                      src={publishedPosts[0].featuredImage}
                      alt={publishedPosts[0].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="lg:col-span-2 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryBadge(publishedPosts[0].category)}`}>
                          {publishedPosts[0].category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">{publishedPosts[0].date}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-950 leading-snug mb-2 group-hover:text-[#800016] transition-colors">
                        {publishedPosts[0].title}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                        {publishedPosts[0].excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{publishedPosts[0].readTime}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{publishedPosts[0].views}</span>
                      </div>
                      <span className="text-xs font-bold flex items-center gap-1" style={{ color: accentColor }}>
                        Baca <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid — remaining posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {(selectedCat === 'Semua' ? publishedPosts.slice(1) : publishedPosts).map((post) => (
                <article
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="group flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 group-hover:text-[#800016] transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                      <span className="flex items-center gap-1 text-zinc-500 font-sans text-xs font-medium group-hover:text-zinc-950">
                        Baca <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Lihat semua CTA bottom */}
            {onViewAll && publishedPosts.length > 4 && (
              <div className="text-center mt-8">
                <button
                  onClick={onViewAll}
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border rounded-full text-sm font-semibold bg-white hover:opacity-80 transition-opacity"
                >
                  Lihat Semua Artikel
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
