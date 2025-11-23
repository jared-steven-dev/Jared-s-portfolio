#!/usr/bin/env node

/**
 * Manual Sitemap Generator Script
 * 
 * This script can be run manually to regenerate the sitemap
 * Usage: node scripts/generate-sitemap.js
 * 
 * Note: In production, Next.js automatically generates the sitemap
 * on build and on-demand when accessed.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaredsteven.com';

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Supabase credentials not found in environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch all blog posts
  console.log('📝 Fetching blog posts...');
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('slug, date, created_at')
    .order('date', { ascending: false });

  if (postsError) {
    console.error('❌ Error fetching posts:', postsError);
    process.exit(1);
  }

  console.log(`✅ Found ${posts?.length || 0} blog posts`);

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blogs Listing -->
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${posts?.[0]?.created_at || new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog Posts -->
${posts?.map(post => `  <url>
    <loc>${baseUrl}/blogs/${post.slug}</loc>
    <lastmod>${post.date || post.created_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap-manual.xml'), sitemap);
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${path.join(publicDir, 'sitemap-manual.xml')}`);
  console.log(`🔗 URL: ${baseUrl}/sitemap-manual.xml`);
}

generateSitemap().catch(error => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});

