import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  isFirstRun: boolean;          // belum ada akun admin sama sekali
  loginError: string;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setupFirstAdmin: (username: string, displayName: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  addAdminUser: (username: string, displayName: string, password: string, role: AdminUser['role']) => Promise<void>;
  adminUsers: AdminUser[];
  removeAdminUser: (username: string) => void;
  sessionExpiry: number | null;  // timestamp ms
  extendSession: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────
const AUTH_STORAGE_KEY = 'bem_feb_auth_v1';
const SESSION_KEY      = 'bem_feb_session_v1';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 jam dalam ms

// ── SHA-256 hash (Web Crypto API — runs in browser) ──────────────────────────
async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + 'bem_feb_utu_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Stored credential shape ──────────────────────────────────────────────────
interface StoredAccount {
  username: string;
  displayName: string;
  passwordHash: string;
  role: AdminUser['role'];
  createdAt: string;
}

interface AuthStore {
  accounts: StoredAccount[];
}

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStore, setAuthStore] = useState<AuthStore>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { accounts: [] };
    } catch {
      return { accounts: [] };
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
  const [isLoading,  setIsLoading]  = useState(false);

  const isAuthenticated = currentUser !== null;
  const isFirstRun      = authStore.accounts.length === 0;
  const adminUsers      = authStore.accounts.map(a => ({
    username:    a.username,
    displayName: a.displayName,
    role:        a.role,
    lastLogin:   '',
  }));

  // Persist auth store whenever it changes
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore));
  }, [authStore]);

  // Session expiry checker — setiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionExpiry && Date.now() > sessionExpiry) {
        logout();
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError('');
    try {
      // Small artificial delay to prevent brute-force feeling
      await new Promise(r => setTimeout(r, 400));

      const hash = await hashPassword(password);
      const account = authStore.accounts.find(
        a => a.username.toLowerCase() === username.toLowerCase() && a.passwordHash === hash
      );

      if (!account) {
        setLoginError('Username atau password salah.');
        return false;
      }

      const expiry = Date.now() + SESSION_DURATION;
      const user: AdminUser = {
        username:    account.username,
        displayName: account.displayName,
        role:        account.role,
        lastLogin:   new Date().toLocaleString('id-ID'),
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify({ user, expiry }));
      setCurrentUser(user);
      setSessionExpiry(expiry);
      return true;
    } catch {
      setLoginError('Terjadi kesalahan sistem. Coba lagi.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
      const session = JSON.parse(stored);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, expiry }));
      setSessionExpiry(expiry);
    }
  }, [currentUser]);

  // Activity tracking — perpanjang session saat ada interaksi
  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ['mousedown', 'keydown', 'touchstart'];
    const handler = () => extendSession();
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [isAuthenticated, extendSession]);

  // ── Setup first admin ──────────────────────────────────────────────────────
  const setupFirstAdmin = async (username: string, displayName: string, password: string) => {
    const hash = await hashPassword(password);
    const account: StoredAccount = {
      username:     username.trim(),
      displayName:  displayName.trim(),
      passwordHash: hash,
      role:         'superadmin',
      createdAt:    new Date().toISOString(),
    };
    setAuthStore({ accounts: [account] });
  };

  // ── Change password ────────────────────────────────────────────────────────
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentUser) return false;
    const oldHash = await hashPassword(oldPassword);
    const account = authStore.accounts.find(
      a => a.username === currentUser.username && a.passwordHash === oldHash
    );
    if (!account) return false;

    const newHash = await hashPassword(newPassword);
    setAuthStore(prev => ({
      accounts: prev.accounts.map(a =>
        a.username === currentUser.username ? { ...a, passwordHash: newHash } : a
      ),
    }));
    return true;
  };

  // ── Add admin user ─────────────────────────────────────────────────────────
  const addAdminUser = async (
    username: string,
    displayName: string,
    password: string,
    role: AdminUser['role']
  ) => {
    const hash = await hashPassword(password);
    const account: StoredAccount = {
      username:     username.trim(),
      displayName:  displayName.trim(),
      passwordHash: hash,
      role,
      createdAt:    new Date().toISOString(),
    };
    setAuthStore(prev => ({ accounts: [...prev.accounts, account] }));
  };

  // ── Remove admin user ──────────────────────────────────────────────────────
  const removeAdminUser = (username: string) => {
    if (username === currentUser?.username) return; // tidak bisa hapus diri sendiri
    setAuthStore(prev => ({
      accounts: prev.accounts.filter(a => a.username !== username),
    }));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      isFirstRun,
      loginError,
      isLoading,
      login,
      logout,
      setupFirstAdmin,
      changePassword,
      addAdminUser,
      adminUsers,
      removeAdminUser,
      sessionExpiry,
      extendSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
