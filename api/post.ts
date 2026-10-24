import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qozvqigaktfzwvthbxte.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenZxaWdha3Rmend2dGhieHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MjA3NDMsImV4cCI6MjEwODM5Njc0M30.gJmisaPjkGufzgOHdY2VI3HZ1B22fDf2PqHlnLsj-o4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: any, res: any) {
  const { post, slug } = req.query;
  const postIdentifier = (post || slug || '').trim().toLowerCase();

  // Determine host and protocol
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'bem-feb-portal.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const currentUrl = `${proto}://${host}${req.url}`;

  // Default fallback metadata
  let title = 'BEM FEB Universitas Teuku Umar - Lapor BEM FEB';
  let desc = 'Website resmi Badan Eksekutif Mahasiswa Fakultas Ekonomi dan Bisnis Universitas Teuku Umar (BEM FEB UTU) dengan sistem manajemen konten (CMS) dan portal advokasi Lapor BEM FEB.';
  let imageUrl = `https://${host}/src/assets/images/bem_hero_campus_1792265588786.jpg`;

  if (postIdentifier) {
    try {
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, featured_image')
        .or(`id.eq.${postIdentifier},slug.eq.${postIdentifier}`)
        .limit(1);

      if (posts && posts.length > 0) {
        const p = posts[0];
        title = `${p.title} - BEM FEB UTU`;
        desc = p.excerpt || p.title;
        // Direct absolute image URL served as raw binary JPEG
        imageUrl = `${proto}://${host}/api/post-image?post=${encodeURIComponent(p.slug || p.id)}`;
      }
    } catch (e) {
      console.error('Error fetching post for metadata:', e);
    }
  }

  const safeTitle = title.replace(/"/g, '&quot;');
  const safeDesc = desc.replace(/"/g, '&quot;');
  const redirectTarget = `/?page=informasi-publik&post=${encodeURIComponent(postIdentifier)}`;

  // WordPress-like pure HTML document containing 100% valid crawler meta tags & client redirect
  const html = `<!doctype html>
<html lang="id" prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="BEM FEB Universitas Teuku Umar" />
    <meta property="og:url" content="${currentUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${currentUrl}" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <!-- Client-side instant redirection for human visitors (WordPress style) -->
    <meta http-equiv="refresh" content="0; url=${redirectTarget}" />
    <script>
      window.location.replace("${redirectTarget}");
    </script>
  </head>
  <body style="font-family: system-ui, sans-serif; background: #fafafa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; color: #555;">
    <div>
      <p style="font-size: 14px;">Memuat warta BEM FEB UTU...</p>
      <a href="${redirectTarget}" style="color: #800016; text-decoration: none; font-size: 13px;">Klik di sini jika halaman tidak beralih otomatis</a>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
  return res.send(html);
}
