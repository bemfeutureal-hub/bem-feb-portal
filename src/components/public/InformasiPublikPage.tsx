import React, { useState, useEffect, useRef } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Post } from '../../types';
import {
  ArrowLeft, Search, Clock, Eye, ArrowRight, Newspaper, BookOpen,
  Radio, Tag, ChevronRight, TrendingUp, Share2, Facebook, Twitter,
  Link2, MessageCircle, Send, ThumbsUp, ChevronDown, User,
  Bookmark, Printer,
} from 'lucide-react';

interface InformasiPublikPageProps {
  onClose: () => void;
  initialCategory?: string;
  initialPostId?: string; // langsung buka artikel tertentu
  onPostSelect?: (post: Post | null) => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  name: string;
  avatar: string; // initials
  text: string;
  date: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
  showReply?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'Semua',               label: 'Semua',              icon: <Newspaper className="w-3.5 h-3.5" /> },
  { key: 'Kabar Kampus',        label: 'Kabar Kampus',       icon: <Newspaper className="w-3.5 h-3.5" /> },
  { key: 'Kajian & Opini',      label: 'Kajian & Opini',     icon: <BookOpen  className="w-3.5 h-3.5" /> },
  { key: 'Siaran Pers',         label: 'Siaran Pers',        icon: <Radio     className="w-3.5 h-3.5" /> },
  { key: 'Advokasi & Kebijakan',label: 'Advokasi',           icon: <Tag       className="w-3.5 h-3.5" /> },
  { key: 'Prestasi Mahasiswa',  label: 'Prestasi',           icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case 'Kabar Kampus':         return { badge: 'text-blue-700 bg-blue-50 border-blue-200',    bar: 'bg-blue-500' };
    case 'Kajian & Opini':       return { badge: 'text-violet-700 bg-violet-50 border-violet-200', bar: 'bg-violet-500' };
    case 'Siaran Pers':          return { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500' };
    case 'Advokasi & Kebijakan': return { badge: 'text-rose-700 bg-rose-50 border-rose-200',    bar: 'bg-rose-500' };
    case 'Prestasi Mahasiswa':   return { badge: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500' };
    default:                     return { badge: 'text-zinc-600 bg-zinc-100 border-zinc-200',   bar: 'bg-zinc-400' };
  }
};

// ─── ArticleContent ───────────────────────────────────────────────────────────
const ArticleContent: React.FC<{ html: string }> = ({ html }) => {
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  if (!isHtml) {
    return (
      <div className="space-y-4 text-zinc-700 leading-relaxed text-base">
        {html.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    );
  }
  return (
    <div
      className="
        text-zinc-700 text-base leading-[1.85]
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zinc-950 [&_h1]:mt-8 [&_h1]:mb-4
        [&_h2]:text-xl  [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-zinc-100 [&_h2]:pb-2
        [&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:text-zinc-800 [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:mb-5 [&_p]:leading-[1.85]
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#800016] [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-zinc-600 [&_blockquote]:my-6 [&_blockquote]:bg-rose-50/40 [&_blockquote]:rounded-r-lg
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
        [&_li]:leading-relaxed
        [&_a]:text-[#800016] [&_a]:underline [&_a]:decoration-[#800016]/30 [&_a]:font-medium [&_a]:hover:decoration-[#800016]
        [&_strong]:font-semibold [&_strong]:text-zinc-900
        [&_em]:italic
        [&_pre]:bg-zinc-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-zinc-200
        [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-zinc-800
        [&_hr]:border-zinc-200 [&_hr]:my-8
        [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-sm
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-5
        [&_th]:bg-zinc-50 [&_th]:border [&_th]:border-zinc-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-left
        [&_td]:border [&_td]:border-zinc-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// ─── Share Section ────────────────────────────────────────────────────────────
const ShareSection: React.FC<{ post: Post; accentColor: string }> = ({ post, accentColor }) => {
  const [copied, setCopied] = useState(false);
  const identifier = post.slug || post.id;
  const canonicalUrl = `${window.location.origin}${window.location.pathname}?page=informasi-publik&post=${encodeURIComponent(identifier)}`;
  const url = encodeURIComponent(canonicalUrl);
  const title = encodeURIComponent(post.title);

  const copyLink = () => {
    navigator.clipboard.writeText(canonicalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-8 p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
      <p className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4" style={{ color: accentColor }} />
        Bagikan Artikel Ini
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white text-xs font-semibold rounded-lg hover:bg-[#166fe5] transition-colors"
        >
          <Facebook className="w-3.5 h-3.5" /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
          target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] text-white text-xs font-semibold rounded-lg hover:bg-[#0c95e6] transition-colors"
        >
          <Twitter className="w-3.5 h-3.5" /> Twitter / X
        </a>
        <a
          href={`https://wa.me/?text=${title}%20${url}`}
          target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#25d366] text-white text-xs font-semibold rounded-lg hover:bg-[#1ebe58] transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" /> WhatsApp
        </a>
        <a
          href={`https://t.me/share/url?url=${url}&text=${title}`}
          target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#229ed9] text-white text-xs font-semibold rounded-lg hover:bg-[#1a8bc2] transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Telegram
        </a>
        <button
          onClick={copyLink}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          {copied ? 'Tersalin!' : 'Salin Tautan'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-300 hover:border-zinc-500 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak
        </button>
      </div>
    </div>
  );
};

// ─── Comment Component ────────────────────────────────────────────────────────
const CommentItem: React.FC<{
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  onSubmitReply: (parentId: string, text: string, name: string) => void;
  accentColor: string;
  depth?: number;
}> = ({ comment, onLike, onReply, onSubmitReply, accentColor, depth = 0 }) => {
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  return (
    <div className={`${depth > 0 ? 'ml-8 sm:ml-12 border-l-2 border-zinc-100 pl-4' : ''}`}>
      <div className="flex gap-3 mb-1">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          {comment.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-zinc-900">{comment.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">{comment.date}</span>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">{comment.text}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                comment.liked ? 'text-[#800016]' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${comment.liked ? 'fill-current' : ''}`} />
              <span>{comment.likes > 0 ? comment.likes : ''} Suka</span>
            </button>
            {depth === 0 && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Balas
              </button>
            )}
          </div>

          {/* Reply form */}
          {comment.showReply && depth === 0 && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Nama Anda..."
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tulis balasan..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && replyText.trim() && replyName.trim()) {
                      onSubmitReply(comment.id, replyText.trim(), replyName.trim());
                      setReplyText(''); setReplyName('');
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                />
                <button
                  onClick={() => {
                    if (replyText.trim() && replyName.trim()) {
                      onSubmitReply(comment.id, replyText.trim(), replyName.trim());
                      setReplyText(''); setReplyName('');
                    }
                  }}
                  style={{ backgroundColor: accentColor }}
                  className="px-3 py-2 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Kirim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div className="mt-2 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onSubmitReply={onSubmitReply}
              accentColor={accentColor}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Comments Section ─────────────────────────────────────────────────────────
const CommentsSection: React.FC<{ postId: string; accentColor: string }> = ({ postId, accentColor }) => {
  const storageKey = `bem_comments_${postId}`;

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const initials = (n: string) => n.trim().split(' ').map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      avatar: initials(name),
      text: text.trim(),
      date: now,
      likes: 0,
      liked: false,
      replies: [],
      showReply: false,
    };
    setComments(prev => sortNewest ? [newComment, ...prev] : [...prev, newComment]);
    setText('');
  };

  const toggleLike = (id: string, parentId?: string) => {
    setComments(prev => prev.map(c => {
      if (parentId) {
        if (c.id !== parentId) return c;
        return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r) };
      }
      if (c.id !== id) return c;
      return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
    }));
  };

  const toggleReply = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, showReply: !c.showReply } : c));
  };

  const submitReply = (parentId: string, replyText: string, replyName: string) => {
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const reply: Comment = {
      id: `r-${Date.now()}`,
      name: replyName,
      avatar: initials(replyName),
      text: replyText,
      date: now,
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments(prev => prev.map(c => c.id === parentId
      ? { ...c, replies: [...c.replies, reply], showReply: false }
      : c
    ));
  };

  const sorted = sortNewest ? [...comments].reverse() : comments;

  return (
    <section className="mt-10 pt-8 border-t border-zinc-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" style={{ color: accentColor }} />
          Komentar
          {comments.length > 0 && (
            <span className="text-sm font-mono font-normal text-zinc-400">({comments.length})</span>
          )}
        </h3>
        {comments.length > 1 && (
          <button
            onClick={() => setSortNewest(!sortNewest)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            {sortNewest ? 'Terbaru' : 'Terlama'}
          </button>
        )}
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-zinc-50 rounded-2xl border border-zinc-200 p-5 space-y-3">
        <p className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: accentColor }} />
          Tinggalkan Komentar
        </p>
        <input
          type="text"
          placeholder="Nama Anda *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-white"
        />
        <textarea
          rows={3}
          placeholder="Tulis komentar Anda..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm resize-none focus:outline-none focus:border-zinc-400 bg-white leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-zinc-400">Komentar akan tampil setelah diverifikasi.</p>
          <button
            type="submit"
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-1.5 px-5 py-2 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim
          </button>
        </div>
      </form>

      {/* Comment list */}
      {sorted.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sorted.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              onLike={(id) => toggleLike(id)}
              onReply={toggleReply}
              onSubmitReply={submitReply}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const InformasiPublikPage: React.FC<InformasiPublikPageProps> = ({
  onClose,
  initialCategory = 'Semua',
  initialPostId,
  onPostSelect,
}) => {
  const { posts, incrementPostView, siteConfig } = useBEM();
  const accentColor = siteConfig.visuals?.logoEmblemBg || '#800016';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper matching artikel yang sangat tangguh (mencocokkan id, slug, atau URL decoded slug)
  const findPostByIdentifier = (target?: string) => {
    if (!target) return null;
    const cleanTarget = decodeURIComponent(target).trim().toLowerCase();
    return posts.find((p) => {
      if (p.status !== 'published') return false;
      const cleanId = (p.id || '').trim().toLowerCase();
      const cleanSlug = (p.slug || '').trim().toLowerCase();
      return cleanId === cleanTarget || cleanSlug === cleanTarget;
    }) || null;
  };

  const [selectedPost, setSelectedPost] = useState<Post | null>(() => {
    return findPostByIdentifier(initialPostId);
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Jika initialPostId berubah atau posts baru saja selesai dimuat dari Supabase
  useEffect(() => {
    if (initialPostId) {
      const found = findPostByIdentifier(initialPostId);
      if (found) {
        setSelectedPost(found);
        incrementPostView(found.id);
        onPostSelect?.(found);
      }
    }
  }, [initialPostId, posts]);

  // Update dynamic document title and OpenGraph tags for social media
  useEffect(() => {
    if (selectedPost) {
      document.title = `${selectedPost.title} - BEM FEB UTU`;
      // Update meta tags for social media crawlers & browsers
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${selectedPost.title} - BEM FEB UTU`);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', selectedPost.excerpt || selectedPost.title);
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', selectedPost.excerpt || selectedPost.title);
    } else {
      document.title = 'Informasi Publik & Warta BEM - BEM FEB UTU';
    }

    return () => {
      document.title = 'BEM FEB Universitas Teuku Umar - Lapor BEM FEB';
    };
  }, [selectedPost]);

  const POSTS_PER_PAGE = 9;

  const publishedPosts = posts.filter(p => p.status === 'published');

  const filteredPosts = publishedPosts.filter(p => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginated = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const featuredPost = filteredPosts[0];
  const remainingPosts = paginated.slice(activeCategory === 'Semua' && currentPage === 1 && !searchQuery ? 1 : 0);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  const handleOpenPost = (post: Post) => {
    incrementPostView(post.id);
    setSelectedPost(post);
    onPostSelect?.(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedPost) {
      setSelectedPost(null);
      onPostSelect?.(null);
    } else {
      onClose();
    }
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // ── ARTICLE DETAIL ──────────────────────────────────────────────────────────
  if (selectedPost) {
    const style = getCategoryStyle(selectedPost.category);
    const relatedPosts = publishedPosts
      .filter(p => p.id !== selectedPost.id && p.category === selectedPost.category)
      .slice(0, 3);

    return (
      <div className="min-h-screen bg-white">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm print:hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-950 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono min-w-0">
              <button onClick={onClose} className="hover:text-zinc-700 transition-colors shrink-0">BEM FEB UTU</button>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <button onClick={() => setSelectedPost(null)} className="hover:text-zinc-700 transition-colors truncate max-w-[120px] sm:max-w-xs">
                Informasi Publik
              </button>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-zinc-600 truncate max-w-[100px] sm:max-w-xs">{selectedPost.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleSave(selectedPost.id)}
                title={savedPosts.includes(selectedPost.id) ? 'Hapus dari simpanan' : 'Simpan artikel'}
                className={`p-2 rounded-lg transition-colors ${savedPosts.includes(selectedPost.id) ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700'}`}
              >
                <Bookmark className={`w-4 h-4 ${savedPosts.includes(selectedPost.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className={`h-0.5 ${style.bar}`} style={{ width: '100%' }} />
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          {/* Category + breadcrumb */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${style.badge}`}>
              {selectedPost.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-zinc-950 leading-tight mb-5 tracking-tight">
            {selectedPost.title}
          </h1>

          {/* Lead / excerpt */}
          <p className="text-lg text-zinc-500 leading-relaxed mb-6 font-light italic">
            {selectedPost.excerpt}
          </p>

          {/* Author + Meta bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {(selectedPost.author || 'BEM')
                  .split(' ')
                  .filter(Boolean)
                  .map(w => w[0])
                  .slice(0, 2)
                  .join('') || 'UTU'}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{selectedPost.author}</p>
                <p className="text-xs text-zinc-500">{selectedPost.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
              <span>{selectedPost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedPost.readTime}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selectedPost.views}</span>
            </div>
          </div>

          {/* Hero image */}
          {selectedPost.featuredImage && (
            <figure className="mb-8 -mx-4 sm:mx-0">
              <div className="rounded-none sm:rounded-2xl overflow-hidden aspect-video bg-zinc-100 shadow-sm">
                <img
                  src={selectedPost.featuredImage}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-center text-xs text-zinc-400 mt-2 font-mono">
                Foto: {selectedPost.author}
              </figcaption>
            </figure>
          )}

          {/* Article body */}
          <ArticleContent html={selectedPost.content} />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-zinc-100">
            {[selectedPost.category, 'BEM FEB UTU', 'FEB UTU'].map(tag => (
              <span key={tag} className="text-[11px] px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full font-medium">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>

          {/* Share */}
          <ShareSection post={selectedPost} accentColor={accentColor} />

          {/* Author card */}
          <div className="my-8 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {(selectedPost.author || 'BEM')
                .split(' ')
                .filter(Boolean)
                .map(w => w[0])
                .slice(0, 2)
                .join('') || 'UTU'}
            </div>
            <div>
              <p className="text-xs font-mono text-zinc-400 mb-0.5 uppercase tracking-wider">Tentang Penulis</p>
              <p className="font-bold text-zinc-900">{selectedPost.author}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{selectedPost.authorRole} · BEM FEB Universitas Teuku Umar</p>
            </div>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h3 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" style={{ color: accentColor }} />
                Artikel Terkait
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map(r => (
                  <div
                    key={r.id}
                    onClick={() => handleOpenPost(r)}
                    className="group cursor-pointer bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all"
                  >
                    <div className="aspect-video bg-zinc-100 overflow-hidden">
                      <img src={r.featuredImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryStyle(r.category).badge}`}>
                        {r.category}
                      </span>
                      <p className="text-xs font-semibold text-zinc-900 mt-2 line-clamp-2 group-hover:text-[#800016] transition-colors leading-snug">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-1">{r.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <CommentsSection postId={selectedPost.id} accentColor={accentColor} />
        </article>
      </div>
    );
  }

  // ── LISTING VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: siteConfig.visuals?.postsSectionBackground || '#fcfcfd' }}>
      {/* Hero header */}
      <div
        style={{ background: `linear-gradient(135deg, ${siteConfig.visuals?.heroBgGradientStart || '#ba0f23'}, ${siteConfig.visuals?.heroBgGradientEnd || '#990d1c'})` }}
        className="text-white py-12 sm:py-16 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <button onClick={onClose} className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </button>
          <div className="flex items-center gap-2 text-white/60 text-xs font-mono mb-3">
            <span>BEM FEB UTU</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">Informasi Publik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Informasi Publik</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Warta kampus, kajian & opini mahasiswa, dan siaran pers resmi BEM FEB Universitas Teuku Umar.
          </p>
          <div className="mt-6 relative max-w-md">
            <Search className="w-4 h-4 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel, topik, penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/15 border border-white/25 rounded-full text-white placeholder-white/55 text-sm focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border ${
                activeCategory === cat.key
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {cat.key !== 'Semua' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {publishedPosts.filter(p => p.category === cat.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <Newspaper className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
            <p className="text-zinc-400 text-base">Tidak ada artikel ditemukan.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {activeCategory === 'Semua' && currentPage === 1 && !searchQuery && featuredPost && (
              <div
                onClick={() => handleOpenPost(featuredPost)}
                className="group mb-10 bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 aspect-video lg:aspect-auto bg-zinc-100 overflow-hidden">
                    <img src={featuredPost.featuredImage} alt={featuredPost.title} referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryStyle(featuredPost.category).badge}`}>
                          {featuredPost.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">{featuredPost.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 leading-snug mb-3 group-hover:text-[#800016] transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{featuredPost.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredPost.readTime}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{featuredPost.views}</span>
                      </div>
                      <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: accentColor }}>
                        Baca <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {remainingPosts.map(post => (
                <article
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-video bg-zinc-100 overflow-hidden relative">
                    <img src={post.featuredImage} alt={post.title} referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryStyle(post.category).badge}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm sm:text-[15px] font-semibold text-zinc-950 line-clamp-2 mb-2 leading-snug group-hover:text-[#800016] transition-colors flex-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 font-mono">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  ← Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-xs rounded-lg font-semibold transition-colors ${
                      currentPage === page ? 'bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  Berikutnya →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
