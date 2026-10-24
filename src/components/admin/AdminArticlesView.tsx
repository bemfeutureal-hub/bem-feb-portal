import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Save,
  Send,
  Clock,
  Tag,
  User,
  Image as ImageIcon,
  ChevronDown,
  BarChart2,
  Link2,
} from 'lucide-react';
import { Post, PostCategory } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import { RichTextEditor } from '../common/RichTextEditor';

const CATEGORIES: { value: PostCategory; label: string; color: string }[] = [
  { value: 'Kabar Kampus', label: 'Kabar Kampus', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'Kajian & Opini', label: 'Kajian & Opini', color: 'text-violet-700 bg-violet-50 border-violet-200' },
  { value: 'Siaran Pers', label: 'Siaran Pers Resmi', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'Advokasi & Kebijakan', label: 'Advokasi & Kebijakan', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { value: 'Prestasi Mahasiswa', label: 'Prestasi Mahasiswa', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'Info Beasiswa', label: 'Info Beasiswa', color: 'text-teal-700 bg-teal-50 border-teal-200' },
];

const getCatStyle = (cat: string) =>
  CATEGORIES.find((c) => c.value === cat)?.color ?? 'text-zinc-600 bg-zinc-100 border-zinc-200';

export const AdminArticlesView: React.FC = () => {
  const { posts, addPost, updatePost, deletePost, setSelectedPost } = useBEM();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<PostCategory>('Kabar Kampus');
  const [author, setAuthor] = useState('Biro Medinfo BEM FEB UTU');
  const [authorRole, setAuthorRole] = useState('Redaksi Media & Publikasi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('3 menit baca');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featuredImage, setFeaturedImage] = useState('/src/assets/images/bem_activity_forum_1792265589704.jpg');

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setCategory('Kabar Kampus');
    setAuthor('Biro Medinfo BEM FEB UTU');
    setAuthorRole('Redaksi Media & Publikasi');
    setExcerpt('');
    setContent('');
    setReadTime('3 menit baca');
    setStatus('published');
    setFeaturedImage('/src/assets/images/bem_activity_forum_1792265589704.jpg');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setAuthor(post.author);
    setAuthorRole(post.authorRole);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setReadTime(post.readTime);
    setStatus(post.status);
    setFeaturedImage(post.featuredImage);
    setIsEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      setSlug(
        val.toLowerCase()
          .replace(/[^a-z0-9\s]+/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleSave = async (saveStatus: 'published' | 'draft') => {
    if (!title.trim() || !content.trim()) {
      alert('Mohon lengkapi judul dan isi artikel.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    // Estimate read time from content
    const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const estimatedMinutes = Math.max(1, Math.round(wordCount / 200));
    const autoReadTime = `${estimatedMinutes} menit baca`;

    if (editingPostId) {
      await updatePost(editingPostId, {
        title: title.trim(),
        slug: slug.trim() || 'artikel-bem-feb',
        category,
        author: author.trim(),
        authorRole: authorRole.trim(),
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        readTime: autoReadTime,
        status: saveStatus,
        featuredImage,
      });
    } else {
      await addPost({
        title: title.trim(),
        slug: slug.trim() || 'artikel-bem-feb',
        category,
        author: author.trim(),
        authorRole: authorRole.trim(),
        date: todayDate,
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        readTime: autoReadTime,
        status: saveStatus,
        featuredImage,
      });
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (window.confirm(`Hapus artikel "${postTitle}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deletePost(id);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.author.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'Semua' || post.category === categoryFilter;
    return matchQ && matchCat;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  // ── Editor fullscreen view ──
  if (isEditorOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
        {/* Editor top bar */}
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                {editingPostId ? 'Edit Artikel' : 'Artikel Baru'}
              </p>
              <p className="text-xs font-semibold text-zinc-800 truncate max-w-[200px] sm:max-w-md">
                {title || 'Tanpa Judul'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Category quick-pick */}
            <div className="relative hidden sm:block">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className={`appearance-none text-[11px] font-semibold px-3 py-1.5 rounded-full border pr-6 focus:outline-none cursor-pointer ${getCatStyle(category)}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            <button
              onClick={() => handleSave('draft')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simpan Draf</span>
            </button>

            <button
              onClick={() => handleSave('published')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{editingPostId ? 'Perbarui' : 'Terbitkan'}</span>
            </button>
          </div>
        </div>

        {/* Editor layout: sidebar + main */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="Judul Artikel..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-bold text-zinc-950 placeholder-zinc-300 focus:outline-none border-0 bg-transparent leading-tight"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Ringkasan / Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Tulis ringkasan 1–2 kalimat yang menarik pembaca..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full text-sm text-zinc-600 italic placeholder-zinc-300 focus:outline-none bg-zinc-50/50 border border-zinc-200 rounded-lg px-4 py-2.5 resize-none leading-relaxed"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Isi Artikel
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Mulai menulis isi artikel di sini. Gunakan toolbar di atas untuk memformat teks seperti Word..."
                  minHeight={380}
                />
              </div>
            </div>
          </div>

          {/* Right sidebar: settings */}
          <aside className="w-64 xl:w-72 shrink-0 border-l border-zinc-200 bg-zinc-50/60 overflow-y-auto hidden md:block">
            <div className="p-4 space-y-5">
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Pengaturan Artikel</h3>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Status Publikasi
                </label>
                <div className="flex gap-2">
                  {(['published', 'draft'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                        status === s
                          ? s === 'published'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-zinc-700 text-white border-zinc-700'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {s === 'published' ? 'Terbit' : 'Draf'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Kategori
                </label>
                <div className="space-y-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-between ${
                        category === c.value
                          ? `${c.color} font-semibold`
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{c.label}</span>
                      {category === c.value && <span className="w-2 h-2 rounded-full bg-current opacity-70" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Penulis
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                />
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Jabatan / peran penulis"
                  className="w-full mt-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[11px] font-mono text-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Gambar Utama
                </label>
                <ImageUploadField
                  label=""
                  description=""
                  recommendedSize="Rasio 16:9 (min. 800×450 px)"
                  aspectRatio="cover"
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  allowGallery={true}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile settings panel (bottom sheet style) */}
        <div className="md:hidden border-t border-zinc-200 bg-zinc-50 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="relative shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="appearance-none text-[11px] font-semibold px-3 py-1.5 rounded-full border pr-6 focus:outline-none cursor-pointer bg-white text-zinc-700 border-zinc-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <input
              type="text"
              placeholder="Penulis..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="shrink-0 px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs text-zinc-800 focus:outline-none w-40"
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Article List View ──
  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Manajemen Artikel</div>
          <h1 className="text-xl font-semibold text-zinc-950 tracking-tight">
            Warta, Kajian & Siaran Pers
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Kelola semua publikasi informasi publik BEM FEB UTU.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Artikel', value: posts.length, icon: <FileText className="w-4 h-4" /> },
          { label: 'Diterbitkan', value: publishedCount, icon: <Send className="w-4 h-4 text-emerald-600" /> },
          { label: 'Draf', value: draftCount, icon: <Save className="w-4 h-4 text-zinc-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-1">{stat.icon}<span className="text-xs">{stat.label}</span></div>
            <p className="text-xl sm:text-2xl font-bold text-zinc-950 font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari artikel, penulis, kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-700 focus:outline-none cursor-pointer"
        >
          <option value="Semua">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Articles grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 rounded-lg py-16 text-center text-zinc-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Tidak ada artikel yang sesuai filter.</p>
          <button onClick={handleOpenCreate} className="mt-3 text-xs text-zinc-600 underline hover:text-zinc-950">
            Tulis artikel pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCatStyle(post.category)}`}>
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    post.status === 'published'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-700 text-white'
                  }`}>
                    {post.status === 'published' ? 'Terbit' : 'Draf'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 line-clamp-2 mb-1.5 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[11px] text-zinc-500 line-clamp-2 flex-1 leading-relaxed mb-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono border-t border-zinc-100 pt-2.5 mb-3">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> {post.views} views</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}${window.location.pathname}?page=informasi-publik&post=${encodeURIComponent(post.slug || post.id)}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Link publikasi berhasil disalin ke clipboard! Siap dibagikan ke medsos.');
                    }}
                    title="Salin Link Publikasi Medsos"
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex-1 py-1.5 text-[11px] font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Lihat
                  </button>
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="flex-1 py-1.5 text-[11px] font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="py-1.5 px-2.5 text-[11px] text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
