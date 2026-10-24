import { SiteConfig, VisualCustomization, Post, LaporTicket, ProgramKerja, Department, CabinetMember, DownloadItem } from '../types';

export const initialVisuals: VisualCustomization = {
  pageBackground: '#ffffff',
  pageTextColor: '#18181b',
  fontFamily: 'Plus Jakarta Sans',
  borderRadius: 'md',

  topBarBackground: '#f8f9fa',
  topBarTextColor: '#374151',
  topBarPhone: '',
  topBarEmail: '',
  topBarLocation: 'Meulaboh · BEM FEB UTU',
  topBarEnabled: true,
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  youtubeUrl: '',

  headerBackground: '#ffffff',
  headerTextColor: '#09090b',
  logoUrl: '',
  secondaryLogoUrl: '',
  footerLogoUrl: '',
  logoHeight: 44,
  showLogoImage: true,
  showEmblemWithLogo: false,
  logoEmblemText: 'BEM',
  logoEmblemBg: '#800016',
  headerTitle1: 'Badan Eksekutif Mahasiswa',
  headerSubtitle1: 'Universitas Teuku Umar',
  headerTitle2: 'Fakultas',
  headerSubtitle2: 'Ekonomi & Bisnis',
  headerCtaText: 'Ajukan Aduan',
  headerCtaBg: '#800016',

  heroBgGradientStart: '#ba0f23',
  heroBgGradientMiddle: '#cc142a',
  heroBgGradientEnd: '#990d1c',
  heroOverlayPattern: true,

  statsBackground: '#ffffff',
  laporSectionBackground: '#fcfcfd',
  aboutSectionBackground: '#ffffff',
  postsSectionBackground: '#fcfcfd',
  prokerSectionBackground: '#ffffff',
  downloadsSectionBackground: '#fcfcfd',
  footerBackground: '#09090b',
  footerTextColor: '#a1a1aa',
  footerAccentBg: '#800016',

  whatsappButtonEnabled: true,
  whatsappButtonText: 'WhatsApp Kami',
  whatsappButtonBg: '#25D366',
  accessibilityButtonEnabled: true,
  trackerButtonEnabled: true,

  stat1Number: '0',
  stat1Title: 'Aduan Selesai',
  stat1Desc: 'Kesejahteraan & UKT Mahasiswa',
  stat2Number: '0',
  stat2Title: 'Satuan Departemen',
  stat2Desc: 'Departemen & BPH',
  stat3Number: '0',
  stat3Title: 'Pengurus & Fungsionaris',
  stat3Desc: 'Kabinet BEM FEB UTU',
  stat4Number: '0',
  stat4Title: 'Program Kerja',
  stat4Desc: 'Agenda & Inovasi Kemahasiswaan',

  laporTitle: 'Lapor BEM FEB',
  laporSubtitle: 'Layanan Advokasi Mahasiswa',
  laporDescription: 'Kanal resmi pelaporan fasilitas sarana kampus, kendala akademik, audiensi banding UKT, dan pendampingan advokasi mahasiswa secara aman, privat, dan dapat dilacak.',
  laporCtaButtonText: '+ Buat Aduan',
};

export const initialSiteConfig: SiteConfig = {
  siteName: 'BEM FEB Universitas Teuku Umar',
  shortName: 'BEM FEB UTU',
  universityName: 'Universitas Teuku Umar',
  facultyName: 'Fakultas Ekonomi dan Bisnis',
  cabinetName: 'Kabinet',
  period: '2025/2026',
  tagline: 'Berdampak Nyata bagi Mahasiswa FEB',
  themeColor: 'maroon',
  visuals: initialVisuals,
  announcementBar: {
    enabled: false,
    text: '',
    actionText: '',
    actionLink: '#lapor-bem',
  },
  heroTitle: 'Poros Gerakan & Kesejahteraan Mahasiswa FEB UTU',
  heroSubtitle: 'Mewujudkan ekosistem Fakultas Ekonomi dan Bisnis yang inklusif, prestatif, dan berintegritas.',
  heroImage: '',
  magazineSlides: [
    {
      id: 'slide-1',
      hashtag: '#BEM FEB UTU',
      title: 'Selamat Datang di Portal BEM FEB UTU',
      subtitle: 'Kanal resmi informasi, advokasi, dan aspirasi mahasiswa Fakultas Ekonomi dan Bisnis.',
      ctaText: 'Selengkapnya',
      ctaLink: '#berita-artikel',
      secondaryCtaText: 'Lapor BEM FEB',
      magazineHeader: 'PORTAL RESMI BEM FEB UNIVERSITAS TEUKU UMAR',
      magazineName: 'BEM FEB',
      edition: 'EDISI PERDANA',
      articleHeadline: 'Selamat datang di portal resmi BEM FEB UTU. Isi konten ini melalui Dashboard Admin.',
      studentName: '',
      studentRole: '',
      studentHeadline: 'BEM FEB UTU — Melayani, Mengawal, Berdampak.',
      coverImage: '',
    },
  ],
  sambutan: {
    ketuaName: 'Ketua BEM FEB UTU',
    ketuaNim: '',
    ketuaRole: 'Ketua BEM FEB UTU',
    wakilName: 'Wakil Ketua BEM FEB UTU',
    wakilNim: '',
    wakilRole: 'Wakil Ketua BEM FEB UTU',
    leadersImage: '',
    quote: '"Isi kutipan sambutan di sini melalui Dashboard Admin."',
    fullMessage: 'Selamat datang di portal resmi BEM FEB UTU. Silakan isi pesan sambutan melalui Dashboard Admin → Kustomisasi Website.',
  },
  visi: 'Isi visi kabinet di Dashboard Admin → Kustomisasi Website.',
  misi: [
    'Isi misi 1 melalui Dashboard Admin.',
    'Isi misi 2 melalui Dashboard Admin.',
  ],
  contact: {
    email: '',
    phone: '',
    address: '',
    instagram: '',
    linkedin: '',
    whatsappAdvokesma: '',
  },
};

// ── Departemen kosong — isi via Admin Dashboard ────────────────────────────
export const initialDepartments: Department[] = [
  {
    id: 'dept-bph',
    name: 'Teras / Badan Pengurus Harian (BPH)',
    code: 'BPH',
    category: 'Badan Pengurus Harian',
    description: 'Isi deskripsi BPH melalui Dashboard Admin → Departemen & Pengurus.',
    focus: 'Tata Kelola Administrasi, Finansial & Supervisi Organisasi',
    kadepName: 'Nama Sekretaris Jenderal',
    kadepNim: '',
    kadepProdi: '',
    kadepQuote: '',
  },
  {
    id: 'dept-adkesma',
    name: 'Departemen Advokasi & Kesejahteraan Mahasiswa (Adkesma)',
    code: 'ADKESMA',
    category: 'Departemen',
    description: 'Isi deskripsi departemen melalui Dashboard Admin → Departemen & Pengurus.',
    focus: 'Pelayanan Advokasi, Penyesuaian UKT & Kesejahteraan Mahasiswa',
    kadepName: 'Nama Ketua Departemen',
    kadepNim: '',
    kadepProdi: '',
    kadepQuote: '',
  },
];

// ── Semua array data awalnya kosong — diisi via Admin Dashboard ──────────────
export const initialCabinetMembers: CabinetMember[] = [];

export const initialPosts: Post[] = [];

export const initialLaporTickets: LaporTicket[] = [];

export const initialProgramKerja: ProgramKerja[] = [];

export const initialDownloads: DownloadItem[] = [];
