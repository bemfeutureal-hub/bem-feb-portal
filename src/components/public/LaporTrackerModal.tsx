import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  X, Search, CheckCircle2, MessageSquare, Send, Copy,
  ShieldCheck, Lock, Eye, EyeOff, AlertCircle, Clock,
  ChevronRight, FileText, Phone,
} from 'lucide-react';
import { LaporTicket } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Selesai Ditindaklanjuti': return { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    case 'Audiensi Dekanat':        return { badge: 'text-purple-700 bg-purple-50 border-purple-200',   dot: 'bg-purple-500' };
    case 'Diproses Advokesma':      return { badge: 'text-blue-700 bg-blue-50 border-blue-200',         dot: 'bg-blue-500' };
    case 'Ditolak':                  return { badge: 'text-zinc-600 bg-zinc-100 border-zinc-200',         dot: 'bg-zinc-400' };
    default:                         return { badge: 'text-amber-700 bg-amber-50 border-amber-200',       dot: 'bg-amber-400' };
  }
};

const STEPS = [
  { label: 'Diterima', key: 'Menunggu Verifikasi' },
  { label: 'Diproses BEM', key: 'Diproses Advokesma' },
  { label: 'Audiensi', key: 'Audiensi Dekanat' },
  { label: 'Selesai', key: 'Selesai Ditindaklanjuti' },
];

const getStepIndex = (status: string) => {
  if (status === 'Ditolak') return -1;
  return STEPS.findIndex(s => s.key === status) + 1;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const LaporTrackerModal: React.FC = () => {
  const {
    isTrackerModalOpen,
    setIsTrackerModalOpen,
    trackingTicketId,
    setTrackingTicketId,
    laporTickets,
    addLaporResponse,
  } = useBEM();

  // Phase 1: input ticket ID
  const [inputId, setInputId] = useState('');
  // Phase 2: verify email
  const [phase, setPhase] = useState<'search' | 'verify' | 'view'>('search');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  // Phase 3: view ticket
  const [verifiedTicket, setVerifiedTicket] = useState<LaporTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isTrackerModalOpen) return null;

  // Reset when opened with a pre-set ticket ID (e.g. right after creating)
  const handleClose = () => {
    setPhase('search');
    setInputId('');
    setEmailInput('');
    setEmailError('');
    setVerifiedTicket(null);
    setReplyText('');
    setAttempts(0);
    setTrackingTicketId('');
    setIsTrackerModalOpen(false);
  };

  // ── Phase 1: Look up ticket ID ──────────────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (inputId || trackingTicketId).trim().toUpperCase();
    if (!id) return;

    const found = laporTickets.find(t => t.id.toUpperCase() === id);
    if (!found) {
      setEmailError('Kode tiket tidak ditemukan. Periksa kembali kode yang Anda simpan.');
      return;
    }

    setTrackingTicketId(found.id);
    setEmailError('');
    setPhase('verify');
  };

  // ── Phase 2: Verify email ───────────────────────────────────────────────────
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = laporTickets.find(t => t.id.toUpperCase() === trackingTicketId.toUpperCase());
    if (!ticket) { setPhase('search'); return; }

    const inputNormalized = emailInput.trim().toLowerCase();
    const storedNormalized = ticket.reporterEmail.trim().toLowerCase();

    if (inputNormalized === storedNormalized) {
      setVerifiedTicket(ticket);
      setEmailError('');
      setAttempts(0);
      setPhase('view');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setEmailError('Terlalu banyak percobaan gagal. Kembali ke pencarian kode tiket.');
        setPhase('search');
        setAttempts(0);
        setInputId('');
      } else {
        setEmailError(`Email tidak sesuai. Sisa percobaan: ${3 - newAttempts}`);
      }
    }
  };

  // ── Phase 3: Reply ──────────────────────────────────────────────────────────
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !verifiedTicket) return;
    const sender = verifiedTicket.isAnonymous
      ? 'Pelapor (Anonim)'
      : verifiedTicket.reporterName;
    addLaporResponse(verifiedTicket.id, replyText.trim(), sender, 'Pelapor Mahasiswa');
    // Refresh local view
    setVerifiedTicket(prev => {
      if (!prev) return prev;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      return {
        ...prev,
        responses: [...prev.responses, {
          id: `r-${Date.now()}`,
          sender,
          role: 'Pelapor Mahasiswa',
          message: replyText.trim(),
          date: now,
        }],
      };
    });
    setReplyText('');
  };

  const copyId = () => {
    if (!verifiedTicket) return;
    navigator.clipboard.writeText(verifiedTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStep = verifiedTicket ? getStepIndex(verifiedTicket.status) : 0;
  const statusStyle = verifiedTicket ? getStatusColor(verifiedTicket.status) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg sm:my-auto max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

        {/* ── HEADER ── */}
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#800016]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Lacak Status Aduan</h3>
              <p className="text-[11px] text-zinc-400">Privat · Hanya Anda yang dapat melihat</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── PHASE INDICATOR ── */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2 shrink-0">
          {['Kode Tiket', 'Verifikasi Email', 'Detail Aduan'].map((label, i) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                (phase === 'search' && i === 0) || (phase === 'verify' && i === 1) || (phase === 'view' && i === 2)
                  ? 'text-[#800016]'
                  : i < (['search','verify','view'].indexOf(phase))
                  ? 'text-emerald-600'
                  : 'text-zinc-400'
              }`}>
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                  (phase === 'search' && i === 0) || (phase === 'verify' && i === 1) || (phase === 'view' && i === 2)
                    ? 'bg-[#800016] text-white'
                    : i < (['search','verify','view'].indexOf(phase))
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-200 text-zinc-500'
                }`}>
                  {i < (['search','verify','view'].indexOf(phase)) ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">

          {/* PHASE 1: Search */}
          {phase === 'search' && (
            <div className="p-5 space-y-5">
              <div className="text-center pt-2">
                <div className="w-14 h-14 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7 text-[#800016]" />
                </div>
                <h4 className="font-semibold text-zinc-900 mb-1">Masukkan Kode Tiket Anda</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Kode tiket diberikan saat Anda mengajukan aduan, contohnya <span className="font-mono font-bold text-zinc-800">ADU-UTU-123</span>
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Contoh: ADU-UTU-123"
                    value={inputId || (trackingTicketId || '')}
                    onChange={(e) => { setInputId(e.target.value); setEmailError(''); }}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-sm uppercase text-zinc-900 focus:bg-white focus:outline-none focus:border-[#800016] transition-colors text-center tracking-widest"
                  />
                </div>

                {emailError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{emailError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#800016] hover:bg-[#680012] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  Cari Tiket
                </button>
              </form>

              <div className="border-t border-zinc-100 pt-4 text-center">
                <p className="text-[11px] text-zinc-400">
                  Belum punya aduan?{' '}
                  <button
                    onClick={handleClose}
                    className="text-[#800016] font-semibold hover:underline"
                  >
                    Buat Aduan Baru
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* PHASE 2: Verify email */}
          {phase === 'verify' && (
            <div className="p-5 space-y-5">
              <div className="text-center pt-2">
                <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck className="w-7 h-7 text-amber-600" />
                </div>
                <h4 className="font-semibold text-zinc-900 mb-1">Verifikasi Identitas</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Untuk melindungi privasi Anda, masukkan email yang digunakan saat mengajukan aduan tiket{' '}
                  <span className="font-mono font-bold text-zinc-800">{trackingTicketId}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-3">
                <div className="relative">
                  <input
                    type={showEmail ? 'text' : 'email'}
                    autoFocus
                    placeholder="Email yang digunakan saat melapor"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#800016] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {emailError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{emailError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#800016] hover:bg-[#680012] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verifikasi & Lihat Aduan
                </button>

                <button
                  type="button"
                  onClick={() => { setPhase('search'); setEmailError(''); setInputId(''); }}
                  className="w-full py-2.5 text-sm text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  ← Ganti Kode Tiket
                </button>
              </form>
            </div>
          )}

          {/* PHASE 3: View ticket */}
          {phase === 'view' && verifiedTicket && (
            <div className="p-5 space-y-5">
              {/* Ticket ID + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-zinc-950">{verifiedTicket.id}</span>
                  <button onClick={copyId} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors" title="Salin kode tiket">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[11px] text-emerald-600 font-medium">Tersalin!</span>}
                </div>
                {statusStyle && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {verifiedTicket.status}
                  </span>
                )}
              </div>

              {/* Progress stepper */}
              {verifiedTicket.status !== 'Ditolak' ? (
                <div className="relative">
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-zinc-100 -z-0" />
                  <div
                    className="absolute top-4 left-[10%] h-0.5 bg-[#800016] -z-0 transition-all"
                    style={{ width: `${Math.max(0, (currentStep - 1) / 3) * 80}%` }}
                  />
                  <div className="relative z-10 grid grid-cols-4 gap-1 text-center">
                    {STEPS.map((step, i) => {
                      const done = currentStep > i + 1;
                      const active = currentStep === i + 1;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-1.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                            done    ? 'bg-[#800016] border-[#800016] text-white'
                            : active ? 'bg-white border-[#800016] text-[#800016]'
                            :          'bg-white border-zinc-200 text-zinc-400'
                          }`}>
                            {done ? '✓' : i + 1}
                          </div>
                          <span className={`text-[10px] font-medium leading-tight ${active ? 'text-[#800016]' : done ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-700">Aduan Tidak Dilanjutkan</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Laporan ini tidak memenuhi kriteria advokasi atau merupakan duplikasi laporan sebelumnya.</p>
                  </div>
                </div>
              )}

              {/* Ticket details */}
              <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 space-y-3">
                <h4 className="font-semibold text-zinc-950 text-sm leading-snug">{verifiedTicket.title}</h4>

                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">{verifiedTicket.description}</p>

                {verifiedTicket.proposedSolution && (
                  <div className="text-xs text-zinc-500 border-l-2 border-zinc-300 pl-3 italic">
                    Usulan Solusi: {verifiedTicket.proposedSolution}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200 text-[11px] font-mono">
                  {[
                    { label: 'Kategori', val: verifiedTicket.category },
                    { label: 'Urgensi', val: verifiedTicket.urgency },
                    { label: 'Program Studi', val: verifiedTicket.reporterProdi },
                    { label: 'Tanggal', val: verifiedTicket.createdAt },
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-zinc-400 block">{item.label}</span>
                      <span className="text-zinc-700 font-medium">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution note */}
              {verifiedTicket.officialResolutionNote && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 mb-1">Catatan Tindak Lanjut BEM FEB UTU:</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">{verifiedTicket.officialResolutionNote}</p>
                  </div>
                </div>
              )}

              {/* Timeline / responses */}
              <div>
                <h5 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  Riwayat Komunikasi ({verifiedTicket.responses.length})
                </h5>

                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                  {verifiedTicket.responses.map((resp, idx) => {
                    const isAdmin = !resp.sender.toLowerCase().includes('pelapor') && !resp.role.toLowerCase().includes('pelapor');
                    return (
                      <div key={resp.id} className={`flex gap-3 ${isAdmin ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${isAdmin ? 'bg-[#800016]' : 'bg-zinc-600'}`}>
                          {isAdmin ? 'BEM' : 'Anda'}
                        </div>
                        <div className={`flex-1 max-w-[80%] ${isAdmin ? '' : 'text-right'}`}>
                          <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isAdmin
                              ? 'bg-rose-50 text-zinc-800 border border-rose-100 rounded-tl-none'
                              : 'bg-zinc-100 text-zinc-800 rounded-tr-none'
                          }`}>
                            {resp.message}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-[10px] text-zinc-400 font-mono ${isAdmin ? '' : 'justify-end'}`}>
                            <span>{resp.sender}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{resp.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply form */}
                <form onSubmit={handleSendReply} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      placeholder="Tambahkan informasi, bukti tambahan, atau pertanyaan ke tim Adkesma..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 resize-none focus:bg-white focus:outline-none focus:border-[#800016] leading-relaxed transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 w-10 h-10 mb-0.5 bg-[#800016] hover:bg-[#680012] text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Kontak admin */}
              <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Butuh bantuan langsung? Hubungi Adkesma BEM FEB UTU</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
