import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { X, ShieldCheck, Send, Copy, Check, Lock, ArrowRight } from 'lucide-react';
import { LaporCategory, LaporUrgency } from '../../types';

export const LaporCreateModal: React.FC = () => {
  const { siteConfig, isLaporModalOpen, setIsLaporModalOpen, addLaporTicket, setTrackingTicketId, setIsTrackerModalOpen } = useBEM();

  const [category, setCategory] = useState<LaporCategory>('Fasilitas & Sarpras Kampus');
  const [urgency, setUrgency] = useState<LaporUrgency>('Sedang');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterNim, setReporterNim] = useState('');
  const [reporterProdi, setReporterProdi] = useState('S1 Manajemen');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublic, setIsPublic] = useState(false); // default private now

  // Success state
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  if (!isLaporModalOpen) return null;

  const accentColor = siteConfig.visuals?.logoEmblemBg || '#800016';

  const handleClose = () => {
    setSubmittedId(null);
    setCodeCopied(false);
    setIsLaporModalOpen(false);
    // Reset form
    setTitle(''); setDescription(''); setLocation(''); setProposedSolution('');
    setReporterName(''); setReporterNim(''); setReporterEmail(''); setReporterPhone('');
    setIsAnonymous(false); setIsPublic(false);
  };

  const copyCode = () => {
    if (!submittedId) return;
    navigator.clipboard.writeText(submittedId);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const openTracker = () => {
    if (!submittedId) return;
    setTrackingTicketId(submittedId);
    handleClose();
    setIsTrackerModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !reporterEmail.trim()) {
      alert('Mohon lengkapi judul aduan, deskripsi, dan email aktif Anda.');
      return;
    }

    const finalReporterName = isAnonymous
      ? 'Mahasiswa FEB UTU (Anonim)'
      : reporterName.trim() || 'Mahasiswa FEB UTU';

    const generatedId = addLaporTicket({
      title: title.trim(), category, urgency,
      description: description.trim(), location: location.trim(),
      proposedSolution: proposedSolution.trim(),
      reporterName: finalReporterName,
      reporterNim: isAnonymous ? '' : reporterNim.trim(),
      reporterProdi, reporterEmail: reporterEmail.trim(),
      reporterPhone: reporterPhone.trim(),
      isAnonymous, status: 'Menunggu Verifikasi', isPublic,
    });
    setSubmittedId(generatedId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-zinc-200 shadow-2xl w-full sm:max-w-xl sm:my-auto max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
              <ShieldCheck className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Lapor BEM FEB UTU</h3>
              <p className="text-[11px] text-zinc-400">{siteConfig.universityName}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SUCCESS SCREEN ── */}
        {submittedId && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-zinc-950 mb-1">Aduan Berhasil Terkirim!</h4>
              <p className="text-sm text-zinc-500">Tim Adkesma BEM FEB UTU akan memproses dalam &lt; 24 jam kerja.</p>
            </div>

            {/* Ticket code highlight */}
            <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Kode Tiket Anda</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold font-mono tracking-widest" style={{ color: accentColor }}>
                  {submittedId}
                </span>
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-colors ${codeCopied ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
                  title="Salin kode"
                >
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {codeCopied && <p className="text-xs text-emerald-600 mt-1">Kode tersalin!</p>}
            </div>

            {/* Warning */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
              <p className="text-xs font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Simpan Kode Ini Sekarang
              </p>
              <ul className="text-[11px] text-amber-700 space-y-1 leading-relaxed list-disc pl-4">
                <li>Kode ini <strong>satu-satunya cara</strong> untuk melacak status aduan Anda</li>
                <li>Status bersifat <strong>privat</strong> — hanya dapat dilihat dengan kode + email Anda</li>
                <li>Screenshot atau catat kode ini di tempat yang aman</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
              <button
                onClick={openTracker}
                style={{ backgroundColor: accentColor }}
                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Lacak Aduan Sekarang <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {!submittedId && (
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[78vh] overflow-y-auto text-xs">
          <div className="p-2.5 bg-rose-50/60 border border-rose-200 rounded text-rose-900 text-[11px] leading-relaxed">
            Aduan Anda akan diverifikasi oleh <strong>Departemen Adkesma BEM FEB UTU</strong>. Privasi Anda terjamin.
          </div>

          {/* Kategori & Urgensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Kategori Laporan *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LaporCategory)}
                className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016]"
              >
                <option value="Fasilitas & Sarpras Kampus">Fasilitas & Sarpras Kampus</option>
                <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
                <option value="Finansial & Banding UKT">Finansial & Banding UKT</option>
                <option value="Advokasi Kasus & Kekerasan/Perundungan">Advokasi Kasus & Perundungan</option>
                <option value="Kemahasiswaan & Ormawa">Kemahasiswaan & Ormawa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Tingkat Urgensi *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as LaporUrgency)}
                className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016]"
              >
                <option value="Rendah">Rendah (Saran / Masukan Berkala)</option>
                <option value="Sedang">Sedang (Perlu Perhatian)</option>
                <option value="Tinggi">Tinggi (Mengganggu Jalannya Kuliah)</option>
                <option value="Darurat">Darurat (Kasus Kritis / Deadline Finansial Segera)</option>
              </select>
            </div>
          </div>

          {/* Judul Laporan */}
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Pokok Aduan / Aspirasi *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: AC Mati di Ruang FEB 2.4 atau Kendala Jadwal KRS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016] text-xs"
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Lokasi / Gedung & Ruang Perkuliahan
            </label>
            <input
              type="text"
              placeholder="Contoh: Gedung Kuliah Terintegrasi FEB Lt. 2 Ruang 2.4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016] text-xs"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Deskripsi Masalah Kronologis *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan secara rinci kronologi kejadian, kendala yang dialami, dan bukti..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016] text-xs leading-relaxed"
            ></textarea>
          </div>

          {/* Usulan Solusi */}
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Usulan Solusi yang Diharapkan
            </label>
            <input
              type="text"
              placeholder="Apa solusi konkret yang menurut Anda tepat?"
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-[#800016] text-xs"
            />
          </div>

          {/* Data Pelapor */}
          <div className="pt-2 border-t border-zinc-200">
            <h4 className="font-semibold text-zinc-900 mb-2">Identitas & Kontak Mahasiswa</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Program Studi *</label>
                <select
                  value={reporterProdi}
                  onChange={(e) => setReporterProdi(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 text-xs"
                >
                  <option value="S1 Manajemen">S1 Manajemen</option>
                  <option value="S1 Ekonomi Pembangunan">S1 Ekonomi Pembangunan</option>
                  <option value="S1 Akuntansi">S1 Akuntansi</option>
                  <option value="S1 Bisnis Digital">S1 Bisnis Digital</option>
                  <option value="Pascasarjana / Magister">Pascasarjana / Magister</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Email Aktif *</label>
                <input
                  type="email"
                  required
                  placeholder="nama.kamu@student.utu.ac.id"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'Disamarkan sebagai Anonim' : 'Nama Lengkap'}
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 text-xs disabled:bg-zinc-100"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">NIM Mahasiswa</label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'Disamarkan' : 'Contoh: 220590401001'}
                  value={reporterNim}
                  onChange={(e) => setReporterNim(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 text-xs disabled:bg-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-zinc-300 text-[#800016]"
                />
                <span className="text-zinc-700 text-[11px]">
                  Laporkan sebagai <strong className="text-zinc-950">Anonim</strong> (identitas nama & NIM dirahasiakan).
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-zinc-300 text-[#800016]"
                />
                <span className="text-zinc-700 text-[11px]">
                  Tampilkan di <strong className="text-zinc-950">Papan Transparansi Aspirasi</strong> FEB UTU.
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLaporModalOpen(false)}
              className="px-3.5 py-1.5 border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-100 font-normal cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#800016] hover:bg-[#680012] text-white rounded font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Kirimkan Aduan</span>
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
