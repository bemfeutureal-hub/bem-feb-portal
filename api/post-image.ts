import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qozvqigaktfzwvthbxte.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenZxaWdha3Rmend2dGhieHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MjA3NDMsImV4cCI6MjEwODM5Njc0M30.gJmisaPjkGufzgOHdY2VI3HZ1B22fDf2PqHlnLsj-o4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: any, res: any) {
  const { post, slug } = req.query;
  const postIdentifier = (post || slug || '').trim().toLowerCase();

  if (!postIdentifier) {
    return res.status(400).send('Parameter post atau slug diperlukan.');
  }

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, featured_image')
      .or(`id.eq.${postIdentifier},slug.eq.${postIdentifier}`)
      .limit(1);

    if (error || !posts || posts.length === 0 || !posts[0].featured_image) {
      // Redirect to placeholder / fallback image
      return res.redirect(302, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop');
    }

    const featuredImage = posts[0].featured_image;

    // If it's a direct HTTP URL, redirect
    if (featuredImage.startsWith('http://') || featuredImage.startsWith('https://')) {
      return res.redirect(302, featuredImage);
    }

    // If it's a base64 Data URL, serve as actual binary image stream
    if (featuredImage.startsWith('data:image/')) {
      const matches = featuredImage.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1] === 'jpeg' || matches[1] === 'jpg' ? 'image/jpeg' : `image/${matches[1]}`;
        const buffer = Buffer.from(matches[2], 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        return res.send(buffer);
      }
    }

    // Fallback
    return res.redirect(302, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop');
  } catch (err: any) {
    return res.redirect(302, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop');
  }
}
