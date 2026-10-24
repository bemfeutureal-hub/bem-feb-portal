import React, { useState, useRef } from 'react';
import { useBEM } from '../../context/BEMContext';
import { DownloadItem } from '../../types';
import {
  Plus, Edit2, Trash2, X, FileText, Upload,
  Download, Link2, Save, FolderOpen,
} from 'lucide-react';

const CATEGORIES: DownloadItem['category'][] = [
  'SOP & Regulasi',
  'Template Surat',
  'Panduan UKT',
  'LPJ & Anggaran',
];

const FILE_TYPES = ['PDF', 'DOCX', 'XLSX', 'PPT', 'ZIP', 'JPG', 'PNG'];

const catColor = (cat: string) => {
  switch (cat) {
    case 'SOP & Regulasi':   return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Template Surat':   return 'text-violet-700 bg-violet-50 border-violet-200';
    case 'Panduan UKT':      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'LPJ & Anggaran':   return 'text-amber-700 bg-amber-50 border-amber-200';
    default:                  return 'text-zinc-600 bg-zinc-100 border-zinc-200';
  }
};

// Convert file to base64 data URL for local storage (max 5MB)
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Ukuran file maksimal 5 MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Format bytes human-readable
const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const AdminDownloadsView: React.FC = () => {
  const { downloads, addDownload, updateDownload, deleteDownload } = useBEM();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title,       setTitle]      = useState('');
  const [category,    setCategory]   = useState<DownloadItem['category']>('SOP & Regulasi');
  const [fileType,    setFileType]   = useState('PDF');
  const [fileSize,    setFileSize]   = useState('');
  const [updatedDate, setUpdatedDate]= useState('');
  const [downloadUrl, setDownloadUrl]= useState('');
  const [uploadMode,  setUploadMode] = useState<'url' | 'file'>('url');
  const [uploading,   setUploading]  = useState(false);
  const [uploadError, setUploadError]= useState('');

  const todayStr = () => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('SOP & Regulasi');
    setFileType('PDF');
    setFileSize('');
    setUpdatedDate(todayStr());
    setDownloadUrl('');
    setUploadMode('url');
    setUploadError('');
  };

  const openAdd = () => { resetForm(); setIsOpen(true); };

  const openEdit = (doc: DownloadItem) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category);
    setFileType(doc.fileType);
    setFileSize(doc.fileSize);
    setUpdatedDate(doc.updatedDate);
    setDownloadUrl(doc.downloadUrl);
    setUploadMode(doc.downloadUrl.startsWith('data:') ? 'file' : 'url');
    setUploadError('');
    setIsOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      setDownloadUrl(dataUrl);
      setFileSize(fmtSize(file.size));
      // Auto-detect file type
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      setFileType(FILE_TYPES.includes(ext) ? ext : 'FILE');
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
    } catch (err: any) {
      setUploadError(err.message || 'Gagal memuat file.');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !downloadUrl.trim()) {
      setUploadError('Judul dan sumber file / URL wajib diisi.');
      return;
    }
    const payload: Omit<DownloadItem, 'id'> = {
      title: title.trim(),
      category,
      fileType,
      fileSize: fileSize || '-',
      updatedDate: updatedDate || todayStr(),
      downloadUrl,
    };
    if (editingId) updateDownload(editingId, payload);
    else addDownload(payload);
    setIsOpen(false);
  };

  const handleDelete = (id: string, docTitle: string) => {
    if (window.confirm(`Hapus dokumen "${docTitle}"?`)) deleteDownload(id);
  };

  const handleDownloadClick = (doc: DownloadItem) => {
    if (doc.downloadUrl === '#' || !doc.downloadUrl) return;
    if (doc.downloadUrl.startsWith('data:')) {
      // Trigger browser download for base64 data
      const a = document.createElement('a');
      a.href = doc.downloadUrl;
      a.download = `${doc.title}.${doc.fileType.toLowerCase()}`;
      a.click();
    } else {
      window.open(doc.downloadUrl, '_blank', 'noopener');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <p className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Bank Dokumen</p>
          <h1 className="text-xl font-semibold text-zinc-950">Manajemen Dokumen & Unduhan</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Upload file atau tautkan URL dokumen yang dapat diunduh publik.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Dokumen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => {
          const count = downloads.filter(d => d.category === cat).length;
          return (
            <div key={cat} className="bg-white border border-zinc-200 rounded-xl p-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor(cat)}`}>{cat}</span>
              <p className="text-2xl font-bold text-zinc-950 mt-2 font-mono">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Documents grid */}
      {downloads.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-zinc-200 rounded-xl">
          <FolderOpen className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
          <p className="text-zinc-400 text-sm">Belum ada dokumen. Tambahkan dokumen pertama.</p>
          <button onClick={openAdd} className="mt-3 text-xs text-zinc-600 underline hover:text-zinc-950">
            + Tambah sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {downloads.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start gap-3 hover:border-zinc-300 hover:shadow-sm transition-all group"
            >
              {/* File icon */}
              <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-zinc-500" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-zinc-950 leading-snug line-clamp-2">{doc.title}</h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${catColor(doc.category)}`}>
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                    {doc.fileType}
                  </span>
                  {doc.fileSize !== '-' && (
                    <span className="text-[10px] text-zinc-400 font-mono">{doc.fileSize}</span>
                  )}
                  <span className="text-[10px] text-zinc-400">· {doc.updatedDate}</span>
                </div>
                {/* URL indicator */}
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-400 font-mono truncate">
                  {doc.downloadUrl.startsWith('data:') ? (
                    <><Upload className="w-3 h-3 shrink-0" /> File terunggah (lokal)</>
                  ) : doc.downloadUrl === '#' ? (
                    <span className="text-amber-500">URL belum disetel</span>
                  ) : (
                    <><Link2 className="w-3 h-3 shrink-0" /><span className="truncate">{doc.downloadUrl}</span></>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownloadClick(doc)}
                  disabled={doc.downloadUrl === '#'}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-30"
                  title="Unduh"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openEdit(doc)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.title)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-zinc-200 shadow-2xl w-full sm:max-w-lg max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-zinc-950">
                {editingId ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Formulir Banding UKT 2026"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
                />
              </div>

              {/* Category + FileType */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as DownloadItem['category'])}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Tipe File</label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="FILE">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Upload mode toggle */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-2">Sumber File *</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      uploadMode === 'url'
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 inline mr-1" />
                    Tautan URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      uploadMode === 'file'
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    Upload File
                  </button>
                </div>

                {uploadMode === 'url' ? (
                  <input
                    type="url"
                    value={downloadUrl.startsWith('data:') ? '' : downloadUrl}
                    onChange={e => setDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/... atau URL langsung"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:border-zinc-400"
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="doc-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <label
                      htmlFor="doc-upload"
                      className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors ${
                        uploading
                          ? 'border-zinc-300 bg-zinc-50 cursor-wait'
                          : downloadUrl.startsWith('data:')
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50 hover:bg-white'
                      }`}
                    >
                      {uploading ? (
                        <p className="text-xs text-zinc-500">Memuat file...</p>
                      ) : downloadUrl.startsWith('data:') ? (
                        <>
                          <FileText className="w-7 h-7 text-emerald-600" />
                          <p className="text-xs text-emerald-700 font-semibold">File berhasil dimuat! ({fileSize})</p>
                          <p className="text-[11px] text-zinc-400">Klik untuk mengganti file</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-zinc-400" />
                          <p className="text-xs text-zinc-600 font-medium">Klik untuk pilih file</p>
                          <p className="text-[11px] text-zinc-400">PDF, DOCX, XLSX, PPT, ZIP — maks 5 MB</p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {uploadError}
                  </p>
                )}
              </div>

              {/* Date + Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Tanggal Update</label>
                  <input
                    type="text"
                    value={updatedDate}
                    onChange={e => setUpdatedDate(e.target.value)}
                    placeholder="Oktober 2026"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Ukuran File</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={e => setFileSize(e.target.value)}
                    placeholder="1.2 MB"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingId ? 'Simpan Perubahan' : 'Tambah Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
