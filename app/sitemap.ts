import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaredsteven.com';
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch all blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, date, created_at')
    .order('date', { ascending: false });

  // Fetch all work projects
  const { data: projects } = await supabase
    .from('work_projects')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: posts?.[0]?.created_at ? new Date(posts[0].created_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic blog post pages
  const blogPages = posts?.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date || post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || [];

  return [...staticPages, ...blogPages];
}

