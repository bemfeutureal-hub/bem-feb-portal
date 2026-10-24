import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBEM } from '../../context/BEMContext';
import {
  Eye, EyeOff, ShieldCheck, Lock, User, ArrowLeft,
  AlertCircle, Loader2, ShieldAlert,
} from 'lucide-react';

interface AdminLoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const { login, loginError, isLoading, isLocked, lockRemainingSeconds } = useAuth();
  const { siteConfig } = useBEM();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (!username.trim() || !password) return;

    const ok = await login(username, password);
    if (ok) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-zinc-100 via-zinc-50 to-zinc-100 text-zinc-900 selection:bg-[#800016] selection:text-white">
      {/* ── TOP BAR / BACK TO SITE ── */}
      <div className="p-4 sm:p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-[#800016] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/80 cursor-pointer border border-transparent hover:border-zinc-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Publik</span>
        </button>
      </div>

      {/* ── LOGIN CONTAINER ── */}
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#800016] via-[#660012] to-[#4a000d] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <div className="relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-rose-200" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Portal CMS Pengurus</h1>
              <p className="text-xs text-rose-100/90 mt-1">
                {siteConfig.siteName || 'Badan Eksekutif Mahasiswa FEB UTU'}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Lockout Warning */}
            {isLocked && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Akses Dibekukan Sementara</p>
                  <p className="mt-0.5 leading-relaxed">
                    Terdeteksi 5 kali percobaan login gagal berturut-turut. Sistem dikunci selama{' '}
                    <strong className="font-mono text-red-950 font-bold">{lockRemainingSeconds} detik</strong>{' '}
                    untuk mencegah upaya akses tidak sah.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {!isLocked && loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[#800016] text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#800016]" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Username Pengurus
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="username"
                    placeholder="Masukkan username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#800016] focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#800016] focus:bg-white transition-all disabled:opacity-50 font-mono"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-1"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isLocked || !username.trim() || !password}
                className="w-full py-2.5 px-4 bg-[#800016] hover:bg-[#600010] active:bg-[#4a000d] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Otoritas...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard Admin</span>
                )}
              </button>
            </form>

            {/* Strict Notice */}
            <div className="pt-4 border-t border-zinc-100 text-center">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                <strong className="text-zinc-700 font-semibold block mb-0.5">Akses Khusus Terbatas</strong>
                Sistem ini dilindungi dengan enkripsi SHA-256 dan pembatasan akses bertingkat.
                Hanya fungsionaris resmi yang memiliki akun terdaftar yang dapat masuk. Pembuatan akun mandiri tidak diizinkan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="py-4 text-center text-xs text-zinc-400 font-mono">
        &copy; {new Date().getFullYear()} BEM Fakultas Ekonomi dan Bisnis Universitas Teuku Umar
      </div>
    </div>
  );
};
