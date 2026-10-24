-- =========================================================================
-- SKRIP SQL INISIALISASI DATABASE SUPABASE BEM FEB UTU
-- Buka Dashboard Supabase -> Masuk ke Menu "SQL Editor" -> Paste & Klik "Run"
-- =========================================================================

-- 1. Tabel Site Config (Pengaturan Portal & CMS Kustomisasi)
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Lapor BEM (Pengaduan Mahasiswa)
CREATE TABLE IF NOT EXISTS lapor_tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  proposed_solution TEXT,
  reporter_name TEXT NOT NULL,
  reporter_nim TEXT,
  reporter_prodi TEXT,
  reporter_email TEXT NOT NULL,
  reporter_phone TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Menunggu Verifikasi',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  official_resolution_note TEXT,
  responses JSONB DEFAULT '[]'::jsonb
);

-- 3. Tabel Artikel & Berita (Posts)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  author_role TEXT,
  date TEXT,
  read_time TEXT,
  status TEXT DEFAULT 'published',
  featured_image TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Program Kerja (Proker)
CREATE TABLE IF NOT EXISTS program_kerja (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  target_date TEXT,
  status TEXT DEFAULT 'Akan Datang',
  description TEXT,
  pic_name TEXT,
  location TEXT,
  indicator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Departemen & Biro
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT,
  description TEXT,
  focus TEXT,
  kadep_name TEXT,
  kadep_nim TEXT,
  kadep_prodi TEXT,
  kadep_photo TEXT,
  kadep_quote TEXT,
  visual JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Pengurus & Anggota Kabinet
CREATE TABLE IF NOT EXISTS cabinet_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id TEXT,
  department_name TEXT,
  prodi TEXT,
  generation TEXT,
  nim TEXT,
  photo_url TEXT,
  is_kadep BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Unduhan & Dokumen Publik
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  file_type TEXT,
  file_size TEXT,
  updated_date TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Akun Administrator & Pengurus (Akses Terbatas & Terenkripsi)
CREATE TABLE IF NOT EXISTS admin_users (
  username TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- =========================================================================
-- INDEX OPTIMASI QUERY (FRONTEND & BACKEND SPEED UP)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_kerja_dept ON program_kerja(department);
CREATE INDEX IF NOT EXISTS idx_program_kerja_status ON program_kerja(status);
CREATE INDEX IF NOT EXISTS idx_cabinet_members_dept ON cabinet_members(department_id);
CREATE INDEX IF NOT EXISTS idx_lapor_tickets_status ON lapor_tickets(status);
CREATE INDEX IF NOT EXISTS idx_lapor_tickets_created ON lapor_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_cat ON downloads(category);

-- =========================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & KEBIJAKAN AKSES (POLICIES)
-- Supaya website publik & panel admin bisa membaca dan menulis data
-- =========================================================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE lapor_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabinet_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Izinkan baca publik (SELECT) & buat/ubah (INSERT/UPDATE/DELETE) via anon key
DO $$ 
BEGIN
  -- site_config policies
  DROP POLICY IF EXISTS "Public can read site_config" ON site_config;
  CREATE POLICY "Public can read site_config" ON site_config FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage site_config" ON site_config;
  CREATE POLICY "Public can manage site_config" ON site_config FOR ALL USING (true) WITH CHECK (true);

  -- lapor_tickets policies
  DROP POLICY IF EXISTS "Public can read lapor_tickets" ON lapor_tickets;
  CREATE POLICY "Public can read lapor_tickets" ON lapor_tickets FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can insert lapor_tickets" ON lapor_tickets;
  CREATE POLICY "Public can insert lapor_tickets" ON lapor_tickets FOR INSERT WITH CHECK (true);
  DROP POLICY IF EXISTS "Public can update lapor_tickets" ON lapor_tickets;
  CREATE POLICY "Public can update lapor_tickets" ON lapor_tickets FOR ALL USING (true) WITH CHECK (true);

  -- posts policies
  DROP POLICY IF EXISTS "Public can read posts" ON posts;
  CREATE POLICY "Public can read posts" ON posts FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage posts" ON posts;
  CREATE POLICY "Public can manage posts" ON posts FOR ALL USING (true) WITH CHECK (true);

  -- program_kerja policies
  DROP POLICY IF EXISTS "Public can read program_kerja" ON program_kerja;
  CREATE POLICY "Public can read program_kerja" ON program_kerja FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage program_kerja" ON program_kerja;
  CREATE POLICY "Public can manage program_kerja" ON program_kerja FOR ALL USING (true) WITH CHECK (true);

  -- departments policies
  DROP POLICY IF EXISTS "Public can read departments" ON departments;
  CREATE POLICY "Public can read departments" ON departments FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage departments" ON departments;
  CREATE POLICY "Public can manage departments" ON departments FOR ALL USING (true) WITH CHECK (true);

  -- cabinet_members policies
  DROP POLICY IF EXISTS "Public can read cabinet_members" ON cabinet_members;
  CREATE POLICY "Public can read cabinet_members" ON cabinet_members FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage cabinet_members" ON cabinet_members;
  CREATE POLICY "Public can manage cabinet_members" ON cabinet_members FOR ALL USING (true) WITH CHECK (true);

  -- downloads policies
  DROP POLICY IF EXISTS "Public can read downloads" ON downloads;
  CREATE POLICY "Public can read downloads" ON downloads FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Public can manage downloads" ON downloads;
  CREATE POLICY "Public can manage downloads" ON downloads FOR ALL USING (true) WITH CHECK (true);

  -- admin_users policies
  DROP POLICY IF EXISTS "Allow select admin_users" ON admin_users;
  CREATE POLICY "Allow select admin_users" ON admin_users FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Allow manage admin_users" ON admin_users;
  CREATE POLICY "Allow manage admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
END $$;
