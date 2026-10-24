import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qozvqigaktfzwvthbxte.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenZxaWdha3Rmend2dGhieHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MjA3NDMsImV4cCI6MjEwODM5Njc0M30.gJmisaPjkGufzgOHdY2VI3HZ1B22fDf2PqHlnLsj-o4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: any, res: any) {
  const { post, slug } = req.query;
  const postIdentifier = (post || slug || '').trim().toLowerCase();

  // Read the original index.html from dist
  let html = '';
  try {
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      html = fs.readFileSync(indexPath, 'utf-8');
    }
  } catch (e) {
    console.error('Failed to read dist/index.html:', e);
  }

  // Fallback to basic html if dist/index.html not found
  if (!html) {
    html = `<!doctype html><html><head><meta charset="utf-8"><title>BEM FEB UTU</title></head><body><div id="root"></div></body></html>`;
  }

  // If no post requested, serve default html
  if (!postIdentifier) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, featured_image')
      .or(`id.eq.${postIdentifier},slug.eq.${postIdentifier}`)
      .limit(1);

    if (posts && posts.length > 0) {
      const p = posts[0];
      const title = `${p.title} - BEM FEB UTU`;
      const desc = p.excerpt || p.title;

      // Construct live dynamic image URL served by our /api/post-image endpoint
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'bem-feb-portal.vercel.app';
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const imageUrl = `${proto}://${host}/api/post-image?post=${encodeURIComponent(p.slug || p.id)}`;
      const pageUrl = `${proto}://${host}/?page=informasi-publik&post=${encodeURIComponent(p.slug || p.id)}`;

      // Inject dynamically into HTML head for WhatsApp, Facebook, Twitter
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${desc}" />`);
      html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${imageUrl}" />`);
      html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${imageUrl}" />`);
      html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${desc}" />`);

      // Add og:url if not present
      if (!html.includes('property="og:url"')) {
        html = html.replace('</head>', `<meta property="og:url" content="${pageUrl}" />\n</head>`);
      }
    }
  } catch (err) {
    console.error('API share preview error:', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.send(html);
}
