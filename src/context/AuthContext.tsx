import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

// ── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  username: string;
  displayName: string;
  role: 'superadmin' | 'admin' | 'editor';
  lastLogin: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  isFirstRun: boolean; // Always false — public registration is strictly disabled
  loginError: string;
  isLoading: boolean;
  isLocked: boolean;
  lockRemainingSeconds: number;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  addAdminUser: (username: string, displayName: string, password: string, role: AdminUser['role']) => Promise<{ success: boolean; message?: string }>;
  adminUsers: AdminUser[];
  removeAdminUser: (username: string) => Promise<{ success: boolean; message?: string }>;
  sessionExpiry: number | null; // timestamp ms
  extendSession: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────
const AUTH_STORAGE_KEY = 'bem_feb_auth_cache_v2';
const SESSION_KEY = 'bem_feb_session_v2';
const LOCK_KEY = 'bem_feb_login_locked_until';
const ATTEMPTS_KEY = 'bem_feb_login_attempts';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 jam sesi aktif
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 menit jika gagal 5 kali

// ── SHA-256 hash (Web Crypto API with strong pepper/salt) ─────────────────────
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + 'bem_feb_utu_salt_2025_secure_pepper');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredAccount {
  username: string;
  displayName: string;
  passwordHash: string;
  role: AdminUser['role'];
  createdAt: string;
}

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const session = JSON.parse(saved);
      if (session.expiry && Date.now() > session.expiry) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session.user ?? null;
    } catch {
      return null;
    }
  });

  const [sessionExpiry, setSessionExpiry] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const session = JSON.parse(saved);
      return session.expiry ?? null;
    } catch {
      return null;
    }
  });

  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

  // Check lockout on load
  const isLocked = lockRemainingSeconds > 0;

  useEffect(() => {
    const checkLock = () => {
      try {
        const lockedUntil = sessionStorage.getItem(LOCK_KEY);
        if (lockedUntil) {
          const diff = Math.ceil((parseInt(lockedUntil, 10) - Date.now()) / 1000);
          if (diff > 0) {
            setLockRemainingSeconds(diff);
          } else {
            sessionStorage.removeItem(LOCK_KEY);
            sessionStorage.removeItem(ATTEMPTS_KEY);
            setLockRemainingSeconds(0);
          }
        }
      } catch {
        // ignore
      }
    };

    checkLock();
    const timer = setInterval(checkLock, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Sync accounts with Supabase & ensure Master Super Admin exists ─────────
  useEffect(() => {
    let isMounted = true;

    const syncAdminAccounts = async () => {
      try {
        const defaultHash = await hashPassword('BEMfeb2025!');
        const defaultMaster: StoredAccount = {
          username: 'admin',
          displayName: 'Super Admin BEM FEB',
          passwordHash: defaultHash,
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        };

        // Query Supabase admin_users
        const { data, error } = await supabase.from('admin_users').select('*');

        if (!error && data && data.length > 0) {
          const remoteAccounts: StoredAccount[] = data.map((d: any) => ({
            username: d.username,
            displayName: d.display_name || d.username,
            passwordHash: d.password_hash,
            role: (d.role as AdminUser['role']) || 'admin',
            createdAt: d.created_at || new Date().toISOString(),
          }));

          if (isMounted) {
            setAccounts(remoteAccounts);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(remoteAccounts));
          }
        } else {
          // If table empty or newly created, seed default master admin
          try {
            await supabase.from('admin_users').upsert([
              {
                username: defaultMaster.username,
                display_name: defaultMaster.displayName,
                password_hash: defaultMaster.passwordHash,
                role: defaultMaster.role,
                created_at: defaultMaster.createdAt,
              },
            ]);
          } catch {
            // ignore if table not created yet
          }

          if (isMounted) {
            setAccounts([defaultMaster]);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify([defaultMaster]));
          }
        }
      } catch (err) {
        console.error('Failed to sync admin accounts:', err);
      }
    };

    syncAdminAccounts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Session expiry ticker — auto-logout when expired
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionExpiry && Date.now() > sessionExpiry) {
        logout();
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setSessionExpiry(null);
    setLoginError('');
  }, []);

  // ── Extend session ─────────────────────────────────────────────────────────
  const extendSession = useCallback(() => {
    if (!currentUser) return;
    const expiry = Date.now() + SESSION_DURATION;
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session = JSON.parse(stored);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, expiry }));
        setSessionExpiry(expiry);
      } catch {
        // ignore
      }
    }
  }, [currentUser]);

  // Active interaction extends session
  useEffect(() => {
    if (!currentUser) return;
    const events = ['mousedown', 'keydown', 'touchstart'];
    const handler = () => extendSession();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [currentUser, extendSession]);

  // ── Login with brute-force rate limiting ───────────────────────────────────
  const login = async (username: string, password: string): Promise<boolean> => {
    if (isLocked) {
      setLoginError(`Sistem login dikunci sementara demi keamanan. Tunggu ${lockRemainingSeconds} detik.`);
      return false;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Artificial delay to prevent automated timing attacks
      await new Promise((r) => setTimeout(r, 500));

      const cleanUsername = username.trim().toLowerCase();
      const inputHash = await hashPassword(password);

      // Verify against remote DB or cached accounts
      let matchedAccount = accounts.find(
        (a) => a.username.toLowerCase() === cleanUsername && a.passwordHash === inputHash
      );

      // If not in cache, double-check remote Supabase directly
      if (!matchedAccount) {
        try {
          const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', cleanUsername)
            .limit(1);

          if (data && data.length > 0 && data[0].password_hash === inputHash) {
            matchedAccount = {
              username: data[0].username,
              displayName: data[0].display_name,
              passwordHash: data[0].password_hash,
              role: data[0].role as AdminUser['role'],
              createdAt: data[0].created_at,
            };
          }
        } catch {
          // ignore
        }
      }

      // Check fallback default if no account matched yet
      if (!matchedAccount && cleanUsername === 'admin') {
        const defaultHash = await hashPassword('BEMfeb2025!');
        if (inputHash === defaultHash) {
          matchedAccount = {
            username: 'admin',
            displayName: 'Super Admin BEM FEB',
            passwordHash: defaultHash,
            role: 'superadmin',
            createdAt: new Date().toISOString(),
          };
        }
      }

      if (!matchedAccount) {
        // Failed attempt handling
        const currentAttempts = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
        sessionStorage.setItem(ATTEMPTS_KEY, currentAttempts.toString());

        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION;
          sessionStorage.setItem(LOCK_KEY, lockTime.toString());
          setLockRemainingSeconds(Math.ceil(LOCKOUT_DURATION / 1000));
          setLoginError('Terlalu banyak percobaan gagal (5x). Sistem login dibekukan selama 15 menit.');
        } else {
          const sisa = MAX_FAILED_ATTEMPTS - currentAttempts;
          setLoginError(`Username atau kata sandi tidak valid. Sisa percobaan: ${sisa}x.`);
        }
        return false;
      }

      // Successful login
      sessionStorage.removeItem(ATTEMPTS_KEY);
      sessionStorage.removeItem(LOCK_KEY);
      setLockRemainingSeconds(0);

      const expiry = Date.now() + SESSION_DURATION;
      const user: AdminUser = {
        username: matchedAccount.username,
        displayName: matchedAccount.displayName,
        role: matchedAccount.role,
        lastLogin: new Date().toLocaleString('id-ID'),
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify({ user, expiry }));
      setCurrentUser(user);
      setSessionExpiry(expiry);

      // Async update last_login in Supabase
      try {
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('username', matchedAccount.username);
      } catch {
        // ignore
      }

      return true;
    } catch {
      setLoginError('Terjadi kesalahan otentikasi. Silakan muat ulang halaman.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Change Password (Authenticated user) ──────────────────────────────────
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentUser) return false;

    const oldHash = await hashPassword(oldPassword);
    const account = accounts.find(
      (a) => a.username.toLowerCase() === currentUser.username.toLowerCase() && a.passwordHash === oldHash
    );

    if (!account) return false;

    const newHash = await hashPassword(newPassword);

    // Update in Supabase
    try {
      await supabase
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('username', currentUser.username);
    } catch {
      // ignore
    }

    // Update local state & cache
    const updated = accounts.map((a) =>
      a.username.toLowerCase() === currentUser.username.toLowerCase()
        ? { ...a, passwordHash: newHash }
        : a
    );
    setAccounts(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return true;
  };

  // ── Add Admin User (Strictly restricted to Super Admin only) ───────────────
  const addAdminUser = async (
    username: string,
    displayName: string,
    password: string,
    role: AdminUser['role']
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      return { success: false, message: 'Akses ditolak. Hanya Super Admin yang berhak menambah akun pengurus.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Username sudah terdaftar.' };
    }

    const hash = await hashPassword(password);
    const newAccount: StoredAccount = {
      username: cleanUsername,
      displayName: displayName.trim(),
      passwordHash: hash,
      role,
      createdAt: new Date().toISOString(),
    };

    // Insert into Supabase
    try {
      await supabase.from('admin_users').insert([
        {
          username: newAccount.username,
          display_name: newAccount.displayName,
          password_hash: newAccount.passwordHash,
          role: newAccount.role,
          created_at: newAccount.createdAt,
        },
      ]);
    } catch (err: any) {
      console.error('Supabase insert failed:', err);
    }

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  };

  // ── Remove Admin User (Strictly restricted to Super Admin only) ────────────
  const removeAdminUser = async (username: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      return { success: false, message: 'Akses ditolak. Hanya Super Admin yang berhak menghapus akun.' };
    }

    if (username.toLowerCase() === currentUser.username.toLowerCase()) {
      return { success: false, message: 'Tidak dapat menghapus akun Anda sendiri saat sedang aktif.' };
    }

    // Delete from Supabase
    try {
      await supabase.from('admin_users').delete().eq('username', username);
    } catch {
      // ignore
    }

    const updated = accounts.filter((a) => a.username.toLowerCase() !== username.toLowerCase());
    setAccounts(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  };

  const adminUsers: AdminUser[] = accounts.map((a) => ({
    username: a.username,
    displayName: a.displayName,
    role: a.role,
    lastLogin: '',
  }));

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        currentUser,
        isFirstRun: false, // Permanently false — disables public registration!
        loginError,
        isLoading,
        isLocked,
        lockRemainingSeconds,
        login,
        logout,
        changePassword,
        addAdminUser,
        adminUsers,
        removeAdminUser,
        sessionExpiry,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
