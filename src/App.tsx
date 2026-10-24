import React, { useState, useEffect } from 'react';
import { BEMProvider, useBEM } from './context/BEMContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { PublicNavbar } from './components/public/PublicNavbar';
import { AnnouncementBar } from './components/public/AnnouncementBar';
import { HeroSection } from './components/public/HeroSection';
import { LaporBEMSection } from './components/public/LaporBEMSection';
import { AboutCabinetSection } from './components/public/AboutCabinetSection';
import { ArticlesSection } from './components/public/ArticlesSection';
import { ProkerSection } from './components/public/ProkerSection';
import { DownloadsSection } from './components/public/DownloadsSection';
import { PublicFooter } from './components/public/PublicFooter';
import { InformasiPublikPage } from './components/public/InformasiPublikPage';
import { DepartemenPage } from './components/public/DepartemenPage';

import { LaporCreateModal } from './components/public/LaporCreateModal';
import { LaporTrackerModal } from './components/public/LaporTrackerModal';
import { ArticleDetailModal } from './components/public/ArticleDetailModal';

import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminLaporView } from './components/admin/AdminLaporView';
import { AdminArticlesView } from './components/admin/AdminArticlesView';
import { AdminCustomizerView } from './components/admin/AdminCustomizerView';
import { AdminProkerView } from './components/admin/AdminProkerView';
import { AdminCabinetView } from './components/admin/AdminCabinetView';
import { AdminAccountView } from './components/admin/AdminAccountView';
import { DepartemenCustomizerView } from './components/admin/DepartemenCustomizerView';
import { AdminDownloadsView } from './components/admin/AdminDownloadsView';
import { Department } from './types';

// ── Public page types ────────────────────────────────────────────────────────
export type PublicPage =
  | 'home'
  | 'informasi-publik'
  | 'informasi-publik-kabar-kampus'
  | 'informasi-publik-kajian'
  | 'informasi-publik-siaran-pers'
  | { type: 'departemen'; deptId: string };

// ── App view mode: public | login | admin ────────────────────────────────────
type AppView = 'public' | 'login' | 'admin';

// ── Main content (uses both contexts) ───────────────────────────────────────
const MainContent: React.FC = () => {
  const { adminTab, setAdminTab, toastMessage, siteConfig, departments } = useBEM();
  const { isAuthenticated, logout } = useAuth();

  const [appView,       setAppView]       = useState<AppView>('public');
  const [publicPage,    setPublicPage]    = useState<PublicPage>('home');
  const [pendingPostId, setPendingPostId] = useState<string | undefined>(undefined);
  const [previewDept,   setPreviewDept]   = useState<Department | null>(null);

  // ── URL Query / Routing Synchronization ────────────────────────────────────
  useEffect(() => {
    const parseUrlAndSyncState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const postParam = params.get('post') || params.get('slug');
      const deptParam = params.get('dept');
      const viewParam = params.get('view');

      if (viewParam === 'login') {
        setAppView('login');
        return;
      }

      if (deptParam) {
        setPublicPage({ type: 'departemen', deptId: deptParam });
        setAppView('public');
        return;
      }

      if (postParam) {
        setPendingPostId(postParam);
        setPublicPage('informasi-publik');
        setAppView('public');
        return;
      }

      if (pageParam === 'informasi-publik') {
        const cat = params.get('cat');
        if (cat === 'Kabar Kampus') setPublicPage('informasi-publik-kabar-kampus');
        else if (cat === 'Kajian & Opini') setPublicPage('informasi-publik-kajian');
        else if (cat === 'Siaran Pers') setPublicPage('informasi-publik-siaran-pers');
        else setPublicPage('informasi-publik');
        setAppView('public');
        return;
      }

      if (!pageParam && !postParam && !deptParam && !viewParam) {
        // default home
      }
    };

    parseUrlAndSyncState();
    window.addEventListener('popstate', parseUrlAndSyncState);
    return () => window.removeEventListener('popstate', parseUrlAndSyncState);
  }, []);

  // Update browser URL query params whenever publicPage or pendingPostId changes
  const updateUrl = (page: PublicPage, postId?: string) => {
    const url = new URL(window.location.href);
    if (page === 'home' && !postId) {
      url.search = '';
    } else if (typeof page === 'object' && page.type === 'departemen') {
      url.search = `?dept=${encodeURIComponent(page.deptId)}`;
    } else if (page === 'informasi-publik' || page === 'informasi-publik-kabar-kampus' || page === 'informasi-publik-kajian' || page === 'informasi-publik-siaran-pers') {
      const searchParts: string[] = ['page=informasi-publik'];
      if (postId) {
        searchParts.push(`post=${encodeURIComponent(postId)}`);
      } else {
        if (page === 'informasi-publik-kabar-kampus') searchParts.push('cat=Kabar+Kampus');
        if (page === 'informasi-publik-kajian') searchParts.push('cat=Kajian+%26+Opini');
        if (page === 'informasi-publik-siaran-pers') searchParts.push('cat=Siaran+Pers');
      }
      url.search = `?${searchParts.join('&')}`;
    }
    window.history.pushState({}, '', url.toString());
  };

  const navigatePublic = (page: PublicPage, postId?: string) => {
    setPendingPostId(postId);
    setPublicPage(page);
    updateUrl(page, postId);
  };

  const visuals = siteConfig.visuals;

  const fontStyle = visuals?.fontFamily === 'Inter'
    ? { fontFamily: 'Inter, system-ui, sans-serif' }
    : visuals?.fontFamily === 'DM Sans'
    ? { fontFamily: '"DM Sans", system-ui, sans-serif' }
    : visuals?.fontFamily === 'Outfit'
    ? { fontFamily: 'Outfit, system-ui, sans-serif' }
    : visuals?.fontFamily === 'System'
    ? { fontFamily: 'system-ui, -apple-system, sans-serif' }
    : { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' };

  const getInitialCategory = (): string => {
    if (typeof publicPage !== 'string') return 'Semua';
    switch (publicPage) {
      case 'informasi-publik-kabar-kampus': return 'Kabar Kampus';
      case 'informasi-publik-kajian':       return 'Kajian & Opini';
      case 'informasi-publik-siaran-pers':  return 'Siaran Pers';
      default: return 'Semua';
    }
  };

  const isInformasiPublik =
    publicPage === 'informasi-publik' ||
    publicPage === 'informasi-publik-kabar-kampus' ||
    publicPage === 'informasi-publik-kajian' ||
    publicPage === 'informasi-publik-siaran-pers';

  const isDeptPage  = typeof publicPage === 'object' && publicPage.type === 'departemen';
  const currentDept = isDeptPage
    ? departments.find(d => d.id === (publicPage as { type: 'departemen'; deptId: string }).deptId)
    : null;

  // Navigate to admin — if already authenticated go straight in, else show login
  const goToAdmin = () => {
    if (isAuthenticated) setAppView('admin');
    else setAppView('login');
  };

  // After successful login → go to admin
  const handleLoginSuccess = () => setAppView('admin');

  // Logout → back to public
  const handleLogout = () => {
    logout();
    setAppView('public');
    navigatePublic('home');
  };

  // ── Login page ─────────────────────────────────────────────────────────────
  if (appView === 'login') {
    return (
      <AdminLoginPage
        onBack={() => { setAppView('public'); navigatePublic('home'); }}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div
      style={{
        ...fontStyle,
        backgroundColor: visuals?.pageBackground || '#ffffff',
        color: visuals?.pageTextColor || '#18181b',
      }}
      className="min-h-screen flex flex-col selection:bg-zinc-950 selection:text-white transition-colors"
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-950 text-zinc-100 text-xs px-3.5 py-2 rounded-lg shadow-lg border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-150 font-normal max-w-sm">
          {toastMessage}
        </div>
      )}

      {/* ── PUBLIC VIEW ── */}
      {appView === 'public' && (
        <div className="flex-1 flex flex-col">
          <AnnouncementBar />
          <PublicNavbar
            onNavigate={page => navigatePublic(page, undefined)}
            currentPage={publicPage}
            onAdminClick={goToAdmin}
          />

          <main className="flex-1">
            {isDeptPage && currentDept ? (
              <DepartemenPage department={currentDept} onClose={() => navigatePublic('home')} />
            ) : isInformasiPublik ? (
              <InformasiPublikPage
                initialCategory={getInitialCategory()}
                initialPostId={pendingPostId}
                onClose={() => navigatePublic('home')}
                onPostSelect={(post) => {
                  if (post) {
                    updateUrl('informasi-publik', post.slug || post.id);
                  } else {
                    updateUrl('informasi-publik');
                  }
                }}
              />
            ) : (
              <>
                <HeroSection />
                <LaporBEMSection />
                <AboutCabinetSection />
                <ArticlesSection
                  onViewAll={() => navigatePublic('informasi-publik')}
                  onOpenPost={postIdentifier => {
                    navigatePublic('informasi-publik', postIdentifier);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <ProkerSection />
                <DownloadsSection />
              </>
            )}
          </main>

          {!isInformasiPublik && !isDeptPage && <PublicFooter onNavigate={navigatePublic} onAdminClick={goToAdmin} />}

          <LaporCreateModal />
          <LaporTrackerModal />
          <ArticleDetailModal />
        </div>
      )}

      {/* ── ADMIN VIEW ── */}
      {appView === 'admin' && (
        <>
          {/* Dept preview mode */}
          {previewDept ? (
            <div className="min-h-screen">
              <div className="sticky top-0 z-50 bg-amber-400 text-black text-xs px-4 py-2 flex items-center justify-between font-semibold">
                <span>📐 Mode Pratinjau — {previewDept.name}</span>
                <button onClick={() => setPreviewDept(null)} className="underline hover:no-underline">
                  Kembali ke Admin
                </button>
              </div>
              <DepartemenPage department={previewDept} onClose={() => setPreviewDept(null)} />
            </div>
          ) : (
            <AdminLayout
              onGoToPublic={() => setAppView('public')}
              onLogout={handleLogout}
            >
              {adminTab === 'dashboard'      && <AdminDashboardView />}
              {adminTab === 'lapor'          && <AdminLaporView />}
              {adminTab === 'posts'          && <AdminArticlesView />}
              {adminTab === 'customizer'     && <AdminCustomizerView />}
              {adminTab === 'dept-customizer'&& <DepartemenCustomizerView onPreview={setPreviewDept} />}
              {adminTab === 'proker'         && <AdminProkerView />}
              {adminTab === 'downloads'      && <AdminDownloadsView />}
              {adminTab === 'account'        && <AdminAccountView />}
              {(adminTab === 'cabinet' || adminTab === 'departments') && <AdminCabinetView />}
              <LaporTrackerModal />
              <ArticleDetailModal />
            </AdminLayout>
          )}
        </>
      )}
    </div>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BEMProvider>
        <MainContent />
      </BEMProvider>
    </AuthProvider>
  );
}
