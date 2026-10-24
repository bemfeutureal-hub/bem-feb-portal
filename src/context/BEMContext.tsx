import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteConfig,
  Post,
  LaporTicket,
  ProgramKerja,
  Department,
  CabinetMember,
  DownloadItem,
  LaporStatus,
} from '../types';
import {
  initialSiteConfig,
  initialPosts,
  initialLaporTickets,
  initialProgramKerja,
  initialDepartments,
  initialCabinetMembers,
  initialDownloads,
} from '../data/initialData';
import { supabase } from '../utils/supabase';

interface BEMContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  resetSiteConfig: () => void;

  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'views'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  incrementPostView: (id: string) => void;

  laporTickets: LaporTicket[];
  addLaporTicket: (ticket: Omit<LaporTicket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => string;
  updateLaporStatus: (id: string, status: LaporStatus, note?: string) => void;
  addLaporResponse: (ticketId: string, message: string, senderName?: string, role?: string) => void;
  toggleLaporVisibility: (id: string) => void;
  deleteLaporTicket: (id: string) => void;

  programKerja: ProgramKerja[];
  addProgramKerja: (proker: Omit<ProgramKerja, 'id'>) => void;
  updateProgramKerja: (id: string, proker: Partial<ProgramKerja>) => void;
  deleteProgramKerja: (id: string) => void;

  // Department Management (including Ketua Departemen)
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Cabinet & Staff Member Management
  cabinetMembers: CabinetMember[];
  addCabinetMember: (member: Omit<CabinetMember, 'id'>) => void;
  updateCabinetMember: (id: string, member: Partial<CabinetMember>) => void;
  deleteCabinetMember: (id: string) => void;

  downloads: DownloadItem[];
  addDownload: (item: Omit<DownloadItem, 'id'>) => void;
  updateDownload: (id: string, item: Partial<DownloadItem>) => void;
  deleteDownload: (id: string) => void;

  // Navigation & View State (adminTab only — viewMode handled by App.tsx with auth)
  adminTab: 'dashboard' | 'posts' | 'lapor' | 'customizer' | 'proker' | 'departments' | 'cabinet' | 'dept-customizer' | 'downloads' | 'account';
  setAdminTab: (tab: 'dashboard' | 'posts' | 'lapor' | 'customizer' | 'proker' | 'departments' | 'cabinet' | 'dept-customizer' | 'downloads' | 'account') => void;

  // Modals & Read Overlays
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  isLaporModalOpen: boolean;
  setIsLaporModalOpen: (open: boolean) => void;
  isTrackerModalOpen: boolean;
  setIsTrackerModalOpen: (open: boolean) => void;
  trackingTicketId: string;
  setTrackingTicketId: (id: string) => void;

  // Toast & Loading state
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isLoadingData: boolean;
}

const BEMContext = createContext<BEMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG:    'bem_feb_utu_site_config_v3',
  POSTS:     'bem_feb_utu_posts_v3',
  LAPOR:     'bem_feb_utu_lapor_tickets_v3',
  PROKER:    'bem_feb_utu_proker_v3',
  DEPARTMENTS: 'bem_feb_utu_departments_v3',
  CABINET:   'bem_feb_utu_cabinet_v3',
  DOWNLOADS: 'bem_feb_utu_downloads_v3',
};

// Map DB snake_case to Frontend types
const mapDbTicketToFrontend = (row: any): LaporTicket => ({
  id: row.id,
  title: row.title,
  category: row.category,
  urgency: row.urgency,
  description: row.description,
  location: row.location || '',
  proposedSolution: row.proposed_solution || '',
  reporterName: row.reporter_name,
  reporterNim: row.reporter_nim || '',
  reporterProdi: row.reporter_prodi || '',
  reporterEmail: row.reporter_email,
  reporterPhone: row.reporter_phone || '',
  isAnonymous: !!row.is_anonymous,
  status: row.status,
  isPublic: row.is_public !== false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  officialResolutionNote: row.official_resolution_note || '',
  responses: Array.isArray(row.responses) ? row.responses : [],
});

const mapFrontendTicketToDb = (t: LaporTicket) => ({
  id: t.id,
  title: t.title,
  category: t.category,
  urgency: t.urgency,
  description: t.description,
  location: t.location,
  proposed_solution: t.proposedSolution,
  reporter_name: t.reporterName,
  reporter_nim: t.reporterNim,
  reporter_prodi: t.reporterProdi,
  reporter_email: t.reporterEmail,
  reporter_phone: t.reporterPhone,
  is_anonymous: t.isAnonymous,
  status: t.status,
  is_public: t.isPublic,
  official_resolution_note: t.officialResolutionNote,
  responses: t.responses,
  updated_at: new Date().toISOString(),
});

const mapDbPostToFrontend = (row: any): Post => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt || '',
  content: row.content || '',
  category: row.category,
  author: row.author || '',
  authorRole: row.author_role || '',
  date: row.date || '',
  readTime: row.read_time || '3 menit baca',
  status: row.status || 'published',
  featuredImage: row.featured_image || '',
  views: row.views || 0,
});

const mapFrontendPostToDb = (p: Post) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  author: p.author,
  author_role: p.authorRole,
  date: p.date,
  read_time: p.readTime,
  status: p.status,
  featured_image: p.featuredImage,
  views: p.views,
  updated_at: new Date().toISOString(),
});

const mapDbProkerToFrontend = (row: any): ProgramKerja => ({
  id: row.id,
  title: row.title,
  department: row.department,
  targetDate: row.target_date,
  status: row.status,
  description: row.description || '',
  picName: row.pic_name || '',
  location: row.location || '',
  indicator: row.indicator || '',
});

const mapFrontendProkerToDb = (pr: ProgramKerja) => ({
  id: pr.id,
  title: pr.title,
  department: pr.department,
  target_date: pr.targetDate,
  status: pr.status,
  description: pr.description,
  pic_name: pr.picName,
  location: pr.location,
  indicator: pr.indicator,
});

const mapDbDeptToFrontend = (row: any): Department => ({
  id: row.id,
  name: row.name,
  code: row.code,
  category: row.category,
  description: row.description || '',
  focus: row.focus || '',
  kadepName: row.kadep_name || '',
  kadepNim: row.kadep_nim || '',
  kadepProdi: row.kadep_prodi || '',
  kadepPhoto: row.kadep_photo || '',
  kadepQuote: row.kadep_quote || '',
  visual: row.visual || {},
});

const mapFrontendDeptToDb = (d: Department) => ({
  id: d.id,
  name: d.name,
  code: d.code,
  category: d.category,
  description: d.description,
  focus: d.focus,
  kadep_name: d.kadepName,
  kadep_nim: d.kadepNim,
  kadep_prodi: d.kadepProdi,
  kadep_photo: d.kadepPhoto,
  kadep_quote: d.kadepQuote,
  visual: d.visual || {},
});

const mapDbCabinetToFrontend = (row: any): CabinetMember => ({
  id: row.id,
  name: row.name,
  role: row.role,
  departmentId: row.department_id,
  departmentName: row.department_name,
  prodi: row.prodi,
  generation: row.generation,
  nim: row.nim || '',
  photoUrl: row.photo_url || '',
  isKadep: !!row.is_kadep,
});

const mapFrontendCabinetToDb = (c: CabinetMember) => ({
  id: c.id,
  name: c.name,
  role: c.role,
  department_id: c.departmentId,
  department_name: c.departmentName,
  prodi: c.prodi,
  generation: c.generation,
  nim: c.nim,
  photo_url: c.photoUrl,
  is_kadep: c.isKadep,
});

const mapDbDownloadToFrontend = (row: any): DownloadItem => ({
  id: row.id,
  title: row.title,
  category: row.category,
  fileType: row.file_type,
  fileSize: row.file_size,
  updatedDate: row.updated_date,
  downloadUrl: row.download_url,
});

const mapFrontendDownloadToDb = (dl: DownloadItem) => ({
  id: dl.id,
  title: dl.title,
  category: dl.category,
  file_type: dl.fileType,
  file_size: dl.fileSize,
  updated_date: dl.updatedDate,
  download_url: dl.downloadUrl,
});

export const BEMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : initialSiteConfig;
    } catch {
      return initialSiteConfig;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : initialPosts;
    } catch {
      return initialPosts;
    }
  });

  const [laporTickets, setLaporTickets] = useState<LaporTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAPOR);
      return saved ? JSON.parse(saved) : initialLaporTickets;
    } catch {
      return initialLaporTickets;
    }
  });

  const [programKerja, setProgramKerja] = useState<ProgramKerja[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROKER);
      return saved ? JSON.parse(saved) : initialProgramKerja;
    } catch {
      return initialProgramKerja;
    }
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      return saved ? JSON.parse(saved) : initialDepartments;
    } catch {
      return initialDepartments;
    }
  });

  const [cabinetMembers, setCabinetMembers] = useState<CabinetMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CABINET);
      return saved ? JSON.parse(saved) : initialCabinetMembers;
    } catch {
      return initialCabinetMembers;
    }
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      return saved ? JSON.parse(saved) : initialDownloads;
    } catch {
      return initialDownloads;
    }
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'posts' | 'lapor' | 'customizer' | 'proker' | 'departments' | 'cabinet' | 'dept-customizer' | 'downloads' | 'account'>('dashboard');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLaporModalOpen, setIsLaporModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackingTicketId, setTrackingTicketId] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // ── Sync LocalStorage as fast cache ──
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig)); } catch (e) {}
  }, [siteConfig]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts)); } catch (e) {}
  }, [posts]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.LAPOR, JSON.stringify(laporTickets)); } catch (e) {}
  }, [laporTickets]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PROKER, JSON.stringify(programKerja)); } catch (e) {}
  }, [programKerja]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments)); } catch (e) {}
  }, [departments]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CABINET, JSON.stringify(cabinetMembers)); } catch (e) {}
  }, [cabinetMembers]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads)); } catch (e) {}
  }, [downloads]);

  // ── 1. Fetch initial data from Supabase on mount ──
  useEffect(() => {
    let isMounted = true;

    const loadAllDataFromSupabase = async () => {
      try {
        setIsLoadingData(true);

        // Fetch site_config
        const { data: configData } = await supabase.from('site_config').select('config').eq('id', 'primary').maybeSingle();
        if (isMounted && configData?.config) {
          setSiteConfig(configData.config);
        }

        // Fetch lapor_tickets
        const { data: ticketsData } = await supabase.from('lapor_tickets').select('*').order('created_at', { ascending: false });
        if (isMounted && ticketsData && ticketsData.length > 0) {
          setLaporTickets(ticketsData.map(mapDbTicketToFrontend));
        }

        // Fetch posts
        const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (isMounted && postsData && postsData.length > 0) {
          setPosts(postsData.map(mapDbPostToFrontend));
        }

        // Fetch proker
        const { data: prokerData } = await supabase.from('program_kerja').select('*');
        if (isMounted && prokerData && prokerData.length > 0) {
          setProgramKerja(prokerData.map(mapDbProkerToFrontend));
        }

        // Fetch departments
        const { data: deptsData } = await supabase.from('departments').select('*');
        if (isMounted && deptsData && deptsData.length > 0) {
          setDepartments(deptsData.map(mapDbDeptToFrontend));
        }

        // Fetch cabinet members
        const { data: cabinetData } = await supabase.from('cabinet_members').select('*');
        if (isMounted && cabinetData && cabinetData.length > 0) {
          setCabinetMembers(cabinetData.map(mapDbCabinetToFrontend));
        }

        // Fetch downloads
        const { data: dlData } = await supabase.from('downloads').select('*');
        if (isMounted && dlData && dlData.length > 0) {
          setDownloads(dlData.map(mapDbDownloadToFrontend));
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Supabase, menggunakan data lokal/offline:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    loadAllDataFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── 2. CRUD Actions with direct Supabase Sync ──

  // --- Downloads ---
  const addDownload = async (item: Omit<DownloadItem, 'id'>) => {
    const newItem: DownloadItem = { ...item, id: `dl-${Date.now()}` };
    setDownloads((prev) => [newItem, ...prev]);
    showToast('Dokumen berhasil ditambahkan.');
    try {
      await supabase.from('downloads').insert(mapFrontendDownloadToDb(newItem));
    } catch (err) {
      console.error('Supabase error addDownload:', err);
    }
  };

  const updateDownload = async (id: string, item: Partial<DownloadItem>) => {
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
    showToast('Dokumen berhasil diperbarui.');
    try {
      const existing = downloads.find((d) => d.id === id);
      if (existing) {
        await supabase.from('downloads').update(mapFrontendDownloadToDb({ ...existing, ...item })).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updateDownload:', err);
    }
  };

  const deleteDownload = async (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    showToast('Dokumen dihapus.');
    try {
      await supabase.from('downloads').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase error deleteDownload:', err);
    }
  };

  // --- Site Config ---
  const updateSiteConfig = async (newConfig: Partial<SiteConfig>) => {
    const updated = { ...siteConfig, ...newConfig };
    setSiteConfig(updated);
    showToast('Pengaturan website BEM FEB UTU berhasil diperbarui.');
    try {
      await supabase.from('site_config').upsert({ id: 'primary', config: updated, updated_at: new Date().toISOString() });
    } catch (err) {
      console.error('Supabase error updateSiteConfig:', err);
    }
  };

  const resetSiteConfig = async () => {
    setSiteConfig(initialSiteConfig);
    setPosts(initialPosts);
    setLaporTickets(initialLaporTickets);
    setProgramKerja(initialProgramKerja);
    setDepartments(initialDepartments);
    setCabinetMembers(initialCabinetMembers);
    localStorage.clear();
    showToast('Data website direset ke setelan awal BEM FEB UTU.');
    try {
      await supabase.from('site_config').upsert({ id: 'primary', config: initialSiteConfig, updated_at: new Date().toISOString() });
    } catch (err) {}
  };

  // --- Posts ---
  const addPost = async (newPostData: Omit<Post, 'id' | 'views'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      views: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('Warta baru berhasil diterbitkan.');
    try {
      await supabase.from('posts').insert(mapFrontendPostToDb(newPost));
    } catch (err) {
      console.error('Supabase error addPost:', err);
    }
  };

  const updatePost = async (id: string, updatedFields: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Perubahan pos berhasil disimpan.');
    try {
      const existing = posts.find((p) => p.id === id);
      if (existing) {
        await supabase.from('posts').update(mapFrontendPostToDb({ ...existing, ...updatedFields })).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updatePost:', err);
    }
  };

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    showToast('Pos telah dihapus.');
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase error deletePost:', err);
    }
  };

  const incrementPostView = async (id: string) => {
    setPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item))
    );
    try {
      const post = posts.find((p) => p.id === id);
      if (post) {
        await supabase.from('posts').update({ views: post.views + 1 }).eq('id', id);
      }
    } catch (err) {}
  };

  // --- Lapor Tickets ---
  const addLaporTicket = (ticketData: Omit<LaporTicket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): string => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `ADU-UTU-${randomSuffix}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTicket: LaporTicket = {
      ...ticketData,
      id: newId,
      createdAt: nowStr,
      updatedAt: nowStr,
      status: 'Menunggu Verifikasi',
      responses: [
        {
          id: `resp-auto-${Date.now()}`,
          sender: 'Biro Adkesma BEM FEB UTU',
          role: 'Sistem Lapor Kampus',
          message: 'Laporan Anda telah tercatat pada sistem Lapor BEM FEB Universitas Teuku Umar. Tim Advokesma akan memverifikasi dalam waktu 1x24 jam.',
          date: nowStr,
        },
      ],
    };

    setLaporTickets((prev) => [newTicket, ...prev]);
    showToast(`Aduan terkirim dengan Kode Tiket: ${newId}`);

    // Asynchronously save directly to Supabase
    supabase.from('lapor_tickets').insert(mapFrontendTicketToDb(newTicket)).then(({ error }) => {
      if (error) console.error('Supabase error addLaporTicket:', error);
    });

    return newId;
  };

  const updateLaporStatus = async (id: string, status: LaporStatus, note?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedTicket: LaporTicket | undefined;

    setLaporTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          updatedTicket = {
            ...ticket,
            status,
            updatedAt: nowStr,
            officialResolutionNote: note !== undefined ? note : ticket.officialResolutionNote,
          };
          return updatedTicket;
        }
        return ticket;
      })
    );
    showToast(`Status tiket ${id} diubah ke: ${status}`);

    try {
      if (updatedTicket) {
        await supabase.from('lapor_tickets').update(mapFrontendTicketToDb(updatedTicket)).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updateLaporStatus:', err);
    }
  };

  const addLaporResponse = async (
    ticketId: string,
    message: string,
    senderName = 'Departemen Adkesma BEM FEB UTU',
    role = 'Staf Advokasi'
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedTicket: LaporTicket | undefined;

    setLaporTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const newResp = {
            id: `resp-${Date.now()}`,
            sender: senderName,
            role,
            message,
            date: nowStr,
          };
          updatedTicket = {
            ...ticket,
            updatedAt: nowStr,
            responses: [...ticket.responses, newResp],
          };
          return updatedTicket;
        }
        return ticket;
      })
    );
    showToast('Tanggapan advokasi berhasil dikirim.');

    try {
      if (updatedTicket) {
        await supabase.from('lapor_tickets').update(mapFrontendTicketToDb(updatedTicket)).eq('id', ticketId);
      }
    } catch (err) {
      console.error('Supabase error addLaporResponse:', err);
    }
  };

  const toggleLaporVisibility = async (id: string) => {
    let updatedTicket: LaporTicket | undefined;
    setLaporTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          updatedTicket = { ...ticket, isPublic: !ticket.isPublic };
          return updatedTicket;
        }
        return ticket;
      })
    );
    showToast('Visibilitas tiket diubah.');
    try {
      if (updatedTicket) {
        await supabase.from('lapor_tickets').update({ is_public: (updatedTicket as LaporTicket).isPublic }).eq('id', id);
      }
    } catch (err) {}
  };

  const deleteLaporTicket = async (id: string) => {
    setLaporTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    showToast(`Tiket ${id} berhasil dihapus.`);
    try {
      await supabase.from('lapor_tickets').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase error deleteLaporTicket:', err);
    }
  };

  // --- Program Kerja ---
  const addProgramKerja = async (proker: Omit<ProgramKerja, 'id'>) => {
    const newProker: ProgramKerja = { ...proker, id: `proker-${Date.now()}` };
    setProgramKerja((prev) => [...prev, newProker]);
    showToast('Program kerja baru berhasil ditambahkan.');
    try {
      await supabase.from('program_kerja').insert(mapFrontendProkerToDb(newProker));
    } catch (err) {
      console.error('Supabase error addProgramKerja:', err);
    }
  };

  const updateProgramKerja = async (id: string, proker: Partial<ProgramKerja>) => {
    setProgramKerja((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...proker } : item))
    );
    showToast('Program kerja berhasil diperbarui.');
    try {
      const existing = programKerja.find((p) => p.id === id);
      if (existing) {
        await supabase.from('program_kerja').update(mapFrontendProkerToDb({ ...existing, ...proker })).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updateProgramKerja:', err);
    }
  };

  const deleteProgramKerja = async (id: string) => {
    setProgramKerja((prev) => prev.filter((item) => item.id !== id));
    showToast('Program kerja dihapus.');
    try {
      await supabase.from('program_kerja').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase error deleteProgramKerja:', err);
    }
  };

  // --- Department Management ---
  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    const newId = `dept-${Date.now()}`;
    const newDept: Department = { ...dept, id: newId };
    setDepartments((prev) => [...prev, newDept]);

    let newKadepMember: CabinetMember | null = null;
    if (dept.kadepName.trim()) {
      newKadepMember = {
        id: `cab-kadep-${Date.now()}`,
        name: dept.kadepName.trim(),
        role: `Ketua Departemen (Kadep)`,
        departmentId: newId,
        departmentName: dept.name,
        prodi: dept.kadepProdi || 'S1 Manajemen',
        generation: '2023',
        nim: dept.kadepNim || '',
        isKadep: true,
      };
      setCabinetMembers((prev) => [newKadepMember!, ...prev]);
    }

    showToast(`Departemen ${dept.name} berhasil ditambahkan.`);

    try {
      await supabase.from('departments').insert(mapFrontendDeptToDb(newDept));
      if (newKadepMember) {
        await supabase.from('cabinet_members').insert(mapFrontendCabinetToDb(newKadepMember));
      }
    } catch (err) {
      console.error('Supabase error addDepartment:', err);
    }
  };

  const updateDepartment = async (id: string, dept: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...dept } : item))
    );

    setCabinetMembers((prev) =>
      prev.map((m) => {
        if (m.departmentId === id) {
          const updatedName = dept.name || m.departmentName;
          if (m.isKadep && dept.kadepName) {
            return {
              ...m,
              name: dept.kadepName,
              departmentName: updatedName,
              prodi: dept.kadepProdi || m.prodi,
              nim: dept.kadepNim || m.nim,
            };
          }
          return { ...m, departmentName: updatedName };
        }
        return m;
      })
    );

    showToast('Data departemen & Ketua Departemen berhasil diperbarui.');

    try {
      const existing = departments.find((d) => d.id === id);
      if (existing) {
        await supabase.from('departments').update(mapFrontendDeptToDb({ ...existing, ...dept })).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updateDepartment:', err);
    }
  };

  const deleteDepartment = async (id: string) => {
    setDepartments((prev) => prev.filter((item) => item.id !== id));
    setCabinetMembers((prev) => prev.filter((m) => m.departmentId !== id));
    showToast('Departemen dan pengurusnya telah dihapus.');
    try {
      await supabase.from('departments').delete().eq('id', id);
      await supabase.from('cabinet_members').delete().eq('department_id', id);
    } catch (err) {
      console.error('Supabase error deleteDepartment:', err);
    }
  };

  // --- Cabinet Member Management ---
  const addCabinetMember = async (member: Omit<CabinetMember, 'id'>) => {
    const newMember: CabinetMember = { ...member, id: `cab-${Date.now()}` };
    setCabinetMembers((prev) => [...prev, newMember]);
    showToast(`Pengurus ${member.name} berhasil ditambahkan.`);
    try {
      await supabase.from('cabinet_members').insert(mapFrontendCabinetToDb(newMember));
    } catch (err) {
      console.error('Supabase error addCabinetMember:', err);
    }
  };

  const updateCabinetMember = async (id: string, member: Partial<CabinetMember>) => {
    setCabinetMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...member } : item))
    );
    showToast('Data pengurus berhasil diperbarui.');
    try {
      const existing = cabinetMembers.find((c) => c.id === id);
      if (existing) {
        await supabase.from('cabinet_members').update(mapFrontendCabinetToDb({ ...existing, ...member })).eq('id', id);
      }
    } catch (err) {
      console.error('Supabase error updateCabinetMember:', err);
    }
  };

  const deleteCabinetMember = async (id: string) => {
    setCabinetMembers((prev) => prev.filter((item) => item.id !== id));
    showToast('Pengurus telah dihapus.');
    try {
      await supabase.from('cabinet_members').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase error deleteCabinetMember:', err);
    }
  };

  return (
    <BEMContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,
        posts,
        addPost,
        updatePost,
        deletePost,
        incrementPostView,
        laporTickets,
        addLaporTicket,
        updateLaporStatus,
        addLaporResponse,
        toggleLaporVisibility,
        deleteLaporTicket,
        programKerja,
        addProgramKerja,
        updateProgramKerja,
        deleteProgramKerja,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        cabinetMembers,
        addCabinetMember,
        updateCabinetMember,
        deleteCabinetMember,
        downloads,
        addDownload,
        updateDownload,
        deleteDownload,
        adminTab,
        setAdminTab,
        selectedPost,
        setSelectedPost,
        isLaporModalOpen,
        setIsLaporModalOpen,
        isTrackerModalOpen,
        setIsTrackerModalOpen,
        trackingTicketId,
        setTrackingTicketId,
        toastMessage,
        showToast,
        isLoadingData,
      }}
    >
      {children}
    </BEMContext.Provider>
  );
};

export const useBEM = () => {
  const context = useContext(BEMContext);
  if (!context) {
    throw new Error('useBEM must be used within a BEMProvider');
  }
  return context;
};
