import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBEM } from '../../context/BEMContext';
import {
  Eye, EyeOff, ShieldCheck, Lock, User, ArrowLeft,
  KeyRound, AlertCircle, CheckCircle2, Loader2, ChevronRight,
} from 'lucide-react';

interface AdminLoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

// ── Password strength helper ────────────────────────────────────────────────
const getStrength = (pw: string): { score: number; label: string; color: string } => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Lemah',  color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Sedang', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Baik',   color: 'bg-yellow-500' };
  return { score, label: 'Kuat', color: 'bg-emerald-500' };
};

// ── Main Component ───────────────────────────────────────────────────────────
export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const { isFirstRun, login, setupFirstAdmin, loginError, isLoading } = useAuth();
  const { siteConfig } = useBEM();

  const accentColor = siteConfig.visuals?.logoEmblemBg || '#800016';
  const siteName    = siteConfig.siteName || 'BEM FEB UTU';

  // ── Setup state ──────────────────────────────────────────────────────────
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [setupUsername,    setSetupUsername]    = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupPassword,    setSetupPassword]    = useState('');
  const [setupConfirm,     setSetupConfirm]     = useState('');
  const [setupError,       setSetupError]       = useState('');
  const [setupDone,        setSetupDone]        = useState(false);
  const [showSetupPw,      setShowSetupPw]      = useState(false);

  // ── Login state ──────────────────────────────────────────────────────────
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [attempts,      setAttempts]      = useState(0);
  const [lockedUntil,   setLockedUntil]   = useState<number | null>(null);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const pwStrength = getStrength(setupPassword);

  // ── Handle setup ─────────────────────────────────────────────────────────
  const handleSetupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupUsername.trim() || setupUsername.trim().length < 3) {
      setSetupError('Username minimal 3 karakter.'); return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(setupUsername)) {
      setSetupError('Username hanya boleh huruf, angka, dan underscore.'); return;
    }
    if (!setupDisplayName.trim()) {
      setSetupError('Nama tampilan wajib diisi.'); return;
    }
    setSetupError('');
    setSetupStep(2);
  };

  const handleSetupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPassword.length < 8) {
      setSetupError('Password minimal 8 karakter.'); return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('Password dan konfirmasi tidak cocok.'); return;
    }
    if (pwStrength.score < 2) {
      setSetupError('Password terlalu lemah. Gunakan kombinasi huruf besar, angka, atau simbol.'); return;
    }
    setSetupError('');
    await setupFirstAdmin(setupUsername, setupDisplayName, setupPassword);
    setSetupDone(true);
  };

  // ── Handle login ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const ok = await login(loginUsername, loginPassword);
    if (ok) {
      onLoginSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000; // kunci 5 menit
        setLockedUntil(lockTime);
        setAttempts(0);
      }
    }
  };

  // ── Success after setup ──────────────────────────────────────────────────
  if (setupDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-950">Akun Admin Berhasil Dibuat!</h2>
          <p className="text-sm text-zinc-500">
            Akun <strong className="text-zinc-800">{setupUsername}</strong> sudah aktif.
            Silakan login untuk mulai mengelola portal.
          </p>
          <button
            onClick={() => setSetupDone(false)}
            className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  // ── First-run setup wizard ────────────────────────────────────────────────
  if (isFirstRun) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 p-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: accentColor }}>
                {(siteConfig.visuals?.logoEmblemText || 'BEM')}
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-950">{siteName}</p>
                <p className="text-[11px] text-zinc-400">Penyiapan Awal Dashboard Admin</p>
              </div>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${setupStep >= s ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      setupStep > s ? 'text-white' : setupStep === s ? 'border-2 text-zinc-900' : 'bg-zinc-100 text-zinc-400'
                    }`} style={setupStep > s ? { backgroundColor: accentColor } : setupStep === s ? { borderColor: accentColor } : {}}>
                      {setupStep > s ? '✓' : s}
                    </span>
                    <span className="hidden sm:inline">{s === 1 ? 'Identitas' : 'Password'}</span>
                  </div>
                  {s < 2 && <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-zinc-950">
                {setupStep === 1 ? 'Buat Akun Admin Pertama' : 'Buat Password Aman'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {setupStep === 1
                  ? 'Akun ini akan menjadi Superadmin yang dapat mengelola seluruh isi portal.'
                  : 'Gunakan password yang kuat. Minimal 8 karakter dengan kombinasi huruf dan angka.'}
              </p>
            </div>

            {/* Step 1 */}
            {setupStep === 1 && (
              <form onSubmit={handleSetupStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Username *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      autoFocus
                      type="text"
                      value={setupUsername}
                      onChange={e => setSetupUsername(e.target.value)}
                      placeholder="admin_bem"
                      className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Hanya huruf, angka, dan underscore (_)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Nama Tampilan *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={setupDisplayName}
                      onChange={e => setSetupDisplayName(e.target.value)}
                      placeholder="Admin BEM FEB UTU"
                      className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {setupError && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {setupError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  Lanjut ke Password →
                </button>
              </form>
            )}

            {/* Step 2 */}
            {setupStep === 2 && (
              <form onSubmit={handleSetupStep2} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      autoFocus
                      type={showSetupPw ? 'text' : 'password'}
                      value={setupPassword}
                      onChange={e => setSetupPassword(e.target.value)}
                      placeholder="Buat password kuat..."
                      className="w-full pl-9 pr-10 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupPw(!showSetupPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      {showSetupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {setupPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= pwStrength.score ? pwStrength.color : 'bg-zinc-100'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Kekuatan: <span className="font-semibold text-zinc-700">{pwStrength.label}</span>
                        {' · '}min 8 karakter, huruf besar, angka
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Konfirmasi Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSetupPw ? 'text' : 'password'}
                      value={setupConfirm}
                      onChange={e => setSetupConfirm(e.target.value)}
                      placeholder="Ulangi password..."
                      className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors"
                    />
                    {setupConfirm && setupConfirm === setupPassword && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {setupError && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {setupError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setSetupStep(1); setSetupError(''); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  >
                    Buat Akun Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg, ${siteConfig.visuals?.heroBgGradientStart || '#ba0f23'}22, ${siteConfig.visuals?.heroBgGradientEnd || '#990d1c'}11), #f4f4f5` }}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Back to site */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Portal Publik
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-zinc-100">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-zinc-950">Dashboard Admin</h1>
            <p className="text-sm text-zinc-500 mt-1">{siteName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
            {/* Locked warning */}
            {isLocked && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Akun Dikunci Sementara</p>
                  <p className="mt-0.5 opacity-80">Terlalu banyak percobaan gagal. Coba lagi dalam 5 menit.</p>
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  autoComplete="username"
                  disabled={isLocked || isLoading}
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isLocked || isLoading}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPw(!showLoginPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {loginError && !isLocked && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
                {attempts >= 3 && (
                  <span className="ml-auto text-rose-500 font-semibold">{5 - attempts} sisa</span>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLocked || isLoading || !loginUsername || !loginPassword}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</>
              ) : (
                <><KeyRound className="w-4 h-4" /> Masuk ke Dashboard</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-[11px] text-zinc-400">
              Akses terbatas untuk pengurus BEM FEB UTU yang berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
