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

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
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

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAPOR, JSON.stringify(laporTickets));
    } catch (e) {
      console.error(e);
    }
  }, [laporTickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROKER, JSON.stringify(programKerja));
    } catch (e) {
      console.error(e);
    }
  }, [programKerja]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
    } catch (e) {
      console.error(e);
    }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CABINET, JSON.stringify(cabinetMembers));
    } catch (e) {
      console.error(e);
    }
  }, [cabinetMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
    } catch (e) {
      console.error(e);
    }
  }, [downloads]);

  const addDownload = (item: Omit<DownloadItem, 'id'>) => {
    const newItem: DownloadItem = { ...item, id: `dl-${Date.now()}` };
    setDownloads((prev) => [newItem, ...prev]);
    showToast('Dokumen berhasil ditambahkan.');
  };

  const updateDownload = (id: string, item: Partial<DownloadItem>) => {
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
    showToast('Dokumen berhasil diperbarui.');
  };

  const deleteDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    showToast('Dokumen dihapus.');
  };

  const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Pengaturan website BEM FEB UTU berhasil diperbarui.');
  };

  const resetSiteConfig = () => {
    setSiteConfig(initialSiteConfig);
    setPosts(initialPosts);
    setLaporTickets(initialLaporTickets);
    setProgramKerja(initialProgramKerja);
    setDepartments(initialDepartments);
    setCabinetMembers(initialCabinetMembers);
    localStorage.clear();
    showToast('Data website direset ke setelan awal BEM FEB UTU.');
  };

  const addPost = (newPostData: Omit<Post, 'id' | 'views'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      views: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('Warta baru berhasil diterbitkan.');
  };

  const updatePost = (id: string, updatedFields: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Perubahan pos berhasil disimpan.');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    showToast('Pos telah dihapus.');
  };

  const incrementPostView = (id: string) => {
    setPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item))
    );
  };

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
    return newId;
  };

  const updateLaporStatus = (id: string, status: LaporStatus, note?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setLaporTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          return {
            ...ticket,
            status,
            updatedAt: nowStr,
            officialResolutionNote: note !== undefined ? note : ticket.officialResolutionNote,
          };
        }
        return ticket;
      })
    );
    showToast(`Status tiket ${id} diubah ke: ${status}`);
  };

  const addLaporResponse = (
    ticketId: string,
    message: string,
    senderName = 'Departemen Adkesma BEM FEB UTU',
    role = 'Staf Advokasi'
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
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
          return {
            ...ticket,
            updatedAt: nowStr,
            responses: [...ticket.responses, newResp],
          };
        }
        return ticket;
      })
    );
    showToast('Tanggapan advokasi berhasil dikirim.');
  };

  const toggleLaporVisibility = (id: string) => {
    setLaporTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, isPublic: !ticket.isPublic } : ticket
      )
    );
    showToast('Visibilitas tiket diubah.');
  };

  const deleteLaporTicket = (id: string) => {
    setLaporTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    showToast(`Tiket ${id} berhasil dihapus.`);
  };

  const addProgramKerja = (proker: Omit<ProgramKerja, 'id'>) => {
    const newProker: ProgramKerja = { ...proker, id: `proker-${Date.now()}` };
    setProgramKerja((prev) => [...prev, newProker]);
    showToast('Program kerja baru berhasil ditambahkan.');
  };

  const updateProgramKerja = (id: string, proker: Partial<ProgramKerja>) => {
    setProgramKerja((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...proker } : item))
    );
    showToast('Program kerja berhasil diperbarui.');
  };

  const deleteProgramKerja = (id: string) => {
    setProgramKerja((prev) => prev.filter((item) => item.id !== id));
    showToast('Program kerja dihapus.');
  };

  // Department Management
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newId = `dept-${Date.now()}`;
    const newDept: Department = { ...dept, id: newId };
    setDepartments((prev) => [...prev, newDept]);

    // Also auto-add the Ketua Departemen to cabinetMembers if provided
    if (dept.kadepName.trim()) {
      const newKadepMember: CabinetMember = {
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
      setCabinetMembers((prev) => [newKadepMember, ...prev]);
    }

    showToast(`Departemen ${dept.name} berhasil ditambahkan.`);
  };

  const updateDepartment = (id: string, dept: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...dept } : item))
    );

    // If department name or Kadep name updated, sync to cabinetMembers
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
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((item) => item.id !== id));
    setCabinetMembers((prev) => prev.filter((m) => m.departmentId !== id));
    showToast('Departemen dan pengurusnya telah dihapus.');
  };

  // Cabinet & Staff Member Management
  const addCabinetMember = (member: Omit<CabinetMember, 'id'>) => {
    const newMember: CabinetMember = { ...member, id: `cab-${Date.now()}` };
    setCabinetMembers((prev) => [...prev, newMember]);
    showToast(`Pengurus ${member.name} berhasil ditambahkan.`);
  };

  const updateCabinetMember = (id: string, member: Partial<CabinetMember>) => {
    setCabinetMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...member } : item))
    );
    showToast('Data pengurus berhasil diperbarui.');
  };

  const deleteCabinetMember = (id: string) => {
    setCabinetMembers((prev) => prev.filter((item) => item.id !== id));
    showToast('Pengurus telah dihapus.');
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
