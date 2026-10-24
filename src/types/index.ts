export type SiteThemeColor = 'navy' | 'maroon' | 'emerald' | 'amber' | 'slate';

export interface MagazineSlide {
  id: string;
  hashtag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  magazineHeader: string;
  magazineName: string;
  edition: string;
  articleHeadline: string;
  articleSubheadline?: string;
  studentName: string;
  studentRole: string;
  studentHeadline: string;
  coverImage: string;
  insetThumbnail?: string;
}

export interface VisualCustomization {
  // Page & Background Styles
  pageBackground: string; // e.g. '#ffffff' or custom
  pageTextColor: string; // e.g. '#18181b'
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'DM Sans' | 'Outfit' | 'System';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';

  // Top Bar Background & Colors
  topBarBackground: string;
  topBarTextColor: string;
  topBarPhone: string;
  topBarEmail: string;
  topBarLocation: string;
  topBarEnabled: boolean;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;

  // Header / Navbar & Logo Upload
  headerBackground: string;
  headerTextColor: string;
  logoUrl?: string; // Uploaded primary logo image (PNG/JPG/SVG)
  secondaryLogoUrl?: string; // Uploaded secondary logo (e.g. UTU / Faculty)
  footerLogoUrl?: string; // Uploaded footer logo
  logoHeight?: number; // Configurable logo height in px (e.g. 40)
  showLogoImage?: boolean;
  showEmblemWithLogo?: boolean;
  logoEmblemText: string;
  logoEmblemBg: string;
  headerTitle1: string;
  headerSubtitle1: string;
  headerTitle2: string;
  headerSubtitle2: string;
  headerCtaText: string;
  headerCtaBg: string;

  // Hero Section Background & Colors
  heroBgGradientStart: string;
  heroBgGradientMiddle: string;
  heroBgGradientEnd: string;
  heroOverlayPattern: boolean;

  // Section Backgrounds
  statsBackground: string;
  laporSectionBackground: string;
  aboutSectionBackground: string;
  postsSectionBackground: string;
  prokerSectionBackground: string;
  downloadsSectionBackground: string;
  footerBackground: string;
  footerTextColor: string;
  footerAccentBg: string;

  // Floating Action Buttons
  whatsappButtonEnabled: boolean;
  whatsappButtonText: string;
  whatsappButtonBg: string;
  accessibilityButtonEnabled: boolean;
  trackerButtonEnabled: boolean;

  // Quick Stats Strip
  stat1Number: string;
  stat1Title: string;
  stat1Desc: string;
  stat2Number: string;
  stat2Title: string;
  stat2Desc: string;
  stat3Number: string;
  stat3Title: string;
  stat3Desc: string;
  stat4Number: string;
  stat4Title: string;
  stat4Desc: string;

  // Lapor BEM Section Content
  laporTitle: string;
  laporSubtitle: string;
  laporDescription: string;
  laporCtaButtonText: string;
}

export interface SiteConfig {
  siteName: string;
  shortName: string;
  universityName: string;
  facultyName: string;
  cabinetName: string;
  period: string;
  tagline: string;
  themeColor: SiteThemeColor;
  visuals?: VisualCustomization;
  announcementBar: {
    enabled: boolean;
    text: string;
    actionText?: string;
    actionLink?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  magazineSlides?: MagazineSlide[];
  sambutan: {
    ketuaName: string;
    ketuaNim: string;
    ketuaRole: string;
    wakilName: string;
    wakilNim: string;
    wakilRole: string;
    leadersImage: string;
    quote: string;
    fullMessage: string;
  };
  visi: string;
  misi: string[];
  contact: {
    email: string;
    phone: string;
    address: string;
    instagram: string;
    linkedin: string;
    whatsappAdvokesma: string;
  };
}

export type PostCategory = 
  | 'Kabar Kampus' 
  | 'Kajian & Opini' 
  | 'Siaran Pers' 
  | 'Advokasi & Kebijakan' 
  | 'Prestasi Mahasiswa' 
  | 'Info Beasiswa';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  status: 'published' | 'draft';
  featuredImage: string;
  views: number;
}

export type LaporCategory = 
  | 'Fasilitas & Sarpras Kampus' 
  | 'Akademik & Perkuliahan' 
  | 'Finansial & Banding UKT' 
  | 'Advokasi Kasus & Kekerasan/Perundungan' 
  | 'Kemahasiswaan & Ormawa' 
  | 'Lainnya';

export type LaporUrgency = 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';

export type LaporStatus = 
  | 'Menunggu Verifikasi' 
  | 'Diproses Advokesma' 
  | 'Audiensi Dekanat' 
  | 'Selesai Ditindaklanjuti' 
  | 'Ditolak';

export interface LaporResponse {
  id: string;
  sender: string;
  role: string;
  message: string;
  date: string;
}

export interface LaporTicket {
  id: string;
  title: string;
  category: LaporCategory;
  urgency: LaporUrgency;
  description: string;
  location?: string;
  proposedSolution?: string;
  reporterName: string;
  reporterNim?: string;
  reporterProdi: string;
  reporterEmail: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  status: LaporStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  officialResolutionNote?: string;
  responses: LaporResponse[];
}

export interface ProgramKerja {
  id: string;
  title: string;
  department: string;
  targetDate: string;
  status: 'Akan Datang' | 'Sedang Berjalan' | 'Terlaksana';
  description: string;
  picName: string;
  location: string;
  indicator: string;
}

export interface DepartmentVisual {
  heroBg?: string;           // gradient start color e.g. '#800016'
  heroBgEnd?: string;        // gradient end color
  accentColor?: string;      // card / badge accent
  bannerImage?: string;      // header banner photo URL
  moto?: string;             // departemen moto/tagline
  visi?: string;             // visi departemen
  misi?: string[];           // misi list
  programUnggulan?: string;  // program unggulan text
  contactEmail?: string;
  contactWhatsapp?: string;
  instagramUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string; // e.g. "ADKESMA", "KEILMUAN", "ELD", "PSDM", "KOMINFO", "KASTRAT", "BPH"
  category: 'Departemen' | 'Biro' | 'Badan Pengurus Harian';
  description: string;
  focus: string;
  kadepName: string;
  kadepNim?: string;
  kadepProdi?: string;
  kadepPhoto?: string;
  kadepQuote?: string;
  visual?: DepartmentVisual; // per-department customization
}

export interface CabinetMember {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  departmentName: string;
  prodi: string;
  generation: string;
  nim?: string;
  photoUrl?: string;
  isKadep?: boolean;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'SOP & Regulasi' | 'Template Surat' | 'Panduan UKT' | 'LPJ & Anggaran';
  fileType: string;
  fileSize: string;
  updatedDate: string;
  downloadUrl: string;
}
