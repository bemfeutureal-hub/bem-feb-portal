import React, { useState } from 'react';
import { useAuth, AdminUser } from '../../context/AuthContext';
import {
  User, Lock, Plus, Trash2, Shield, Eye, EyeOff,
  CheckCircle2, AlertCircle, Clock, LogOut,
} from 'lucide-react';

const ROLE_LABEL: Record<AdminUser['role'], { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  admin:      { label: 'Admin',       color: 'text-blue-700 bg-blue-50 border-blue-200' },
  editor:     { label: 'Editor',      color: 'text-violet-700 bg-violet-50 border-violet-200' },
};

export const AdminAccountView: React.FC = () => {
  const {
    currentUser, adminUsers, addAdminUser, removeAdminUser,
    changePassword, logout, sessionExpiry,
  } = useAuth();

  // Change password form
  const [oldPw,     setOldPw]    = useState('');
  const [newPw,     setNewPw]    = useState('');
  const [confirmPw, setConfirmPw]= useState('');
  const [showPw,    setShowPw]   = useState(false);
  const [pwMsg,     setPwMsg]    = useState<{ ok: boolean; text: string } | null>(null);

  // Add user form
  const [addOpen,       setAddOpen]       = useState(false);
  const [addUsername,   setAddUsername]   = useState('');
  const [addDisplay,    setAddDisplay]    = useState('');
  const [addPassword,   setAddPassword]   = useState('');
  const [addRole,       setAddRole]       = useState<AdminUser['role']>('editor');
  const [addError,      setAddError]      = useState('');

  // Session display
  const remaining = sessionExpiry
    ? Math.max(0, Math.round((sessionExpiry - Date.now()) / 60000))
    : null;

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw.length < 8) {
      setPwMsg({ ok: false, text: 'Password baru minimal 8 karakter.' }); return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: 'Konfirmasi password tidak cocok.' }); return;
    }
    const ok = await changePassword(oldPw, newPw);
    if (ok) {
      setPwMsg({ ok: true, text: 'Password berhasil diubah.' });
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } else {
      setPwMsg({ ok: false, text: 'Password lama tidak sesuai.' });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!addUsername.trim() || addUsername.trim().length < 3) {
      setAddError('Username minimal 3 karakter.'); return;
    }
    if (adminUsers.some(u => u.username === addUsername.trim())) {
      setAddError('Username sudah digunakan.'); return;
    }
    if (addPassword.length < 8) {
      setAddError('Password minimal 8 karakter.'); return;
    }
    const res = await addAdminUser(addUsername, addDisplay || addUsername, addPassword, addRole);
    if (!res.success) {
      setAddError(res.message || 'Gagal menambahkan akun.');
      return;
    }
    setAddOpen(false);
    setAddUsername(''); setAddDisplay(''); setAddPassword(''); setAddError('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <p className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Akun & Keamanan</p>
        <h1 className="text-xl font-semibold text-zinc-950">Akun & Manajemen Admin</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Kelola akun login, password, dan hak akses pengurus.</p>
      </div>

      {/* Current user info + session */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#800016] text-white flex items-center justify-center text-lg font-bold">
            {currentUser?.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-zinc-950">{currentUser?.displayName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-500 font-mono">@{currentUser?.username}</span>
              {currentUser && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_LABEL[currentUser.role].color}`}>
                  {ROLE_LABEL[currentUser.role].label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {remaining !== null && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Sesi: <span className={`font-semibold ${remaining < 30 ? 'text-amber-600' : 'text-zinc-700'}`}>{remaining} menit</span></span>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-900 text-sm">Ubah Password</h2>
        </div>
        <form onSubmit={handleChangePw} className="p-5 space-y-3">
          {[
            { label: 'Password Lama', val: oldPw, set: setOldPw, ph: 'Masukkan password saat ini...' },
            { label: 'Password Baru', val: newPw, set: setNewPw, ph: 'Min. 8 karakter...' },
            { label: 'Konfirmasi Password Baru', val: confirmPw, set: setConfirmPw, ph: 'Ulangi password baru...' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">{f.label}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400 bg-zinc-50 focus:bg-white pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {pwMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-xs border ${
              pwMsg.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {pwMsg.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {pwMsg.text}
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Simpan Password Baru
          </button>
        </form>
      </div>

      {/* User management — only superadmin */}
      {currentUser?.role === 'superadmin' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              <h2 className="font-semibold text-zinc-900 text-sm">Manajemen Akun Admin ({adminUsers.length})</h2>
            </div>
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#800016' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Admin
            </button>
          </div>

          {/* Add form */}
          {addOpen && (
            <form onSubmit={handleAddUser} className="p-5 border-b border-zinc-100 bg-zinc-50/60 space-y-3">
              <p className="text-xs font-bold text-zinc-700 mb-2">Tambah Akun Admin Baru</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Username *</label>
                  <input
                    type="text"
                    value={addUsername}
                    onChange={e => setAddUsername(e.target.value)}
                    placeholder="admin_baru"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Nama Tampilan</label>
                  <input
                    type="text"
                    value={addDisplay}
                    onChange={e => setAddDisplay(e.target.value)}
                    placeholder="Nama Admin Baru"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Password *</label>
                  <input
                    type="password"
                    value={addPassword}
                    onChange={e => setAddPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Hak Akses</label>
                  <select
                    value={addRole}
                    onChange={e => setAddRole(e.target.value as AdminUser['role'])}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    <option value="editor">Editor — hanya artikel & proker</option>
                    <option value="admin">Admin — semua fitur</option>
                    <option value="superadmin">Super Admin — termasuk akun</option>
                  </select>
                </div>
              </div>
              {addError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />{addError}
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors">
                  Simpan Akun
                </button>
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* User list */}
          <div className="divide-y divide-zinc-100">
            {adminUsers.map(u => (
              <div key={u.username} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{u.displayName}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">@{u.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_LABEL[u.role].color}`}>
                    {ROLE_LABEL[u.role].label}
                  </span>
                  {u.username !== currentUser?.username ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus akun "${u.username}"?`)) removeAdminUser(u.username);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus akun"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-400 px-2">(Anda)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
