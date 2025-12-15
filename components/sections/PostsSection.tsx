"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Post {
  slug: string;
  title: string;
  category: string;
  description: string;
  date: string;
  read_time: string;
  header_image: string;
}

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    // Get total count
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    setTotalPosts(count || 0);

    // Get 3 most recent posts
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, category, description, date, read_time, header_image')
      .order('date', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error loading posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  return (
    <section id="posts" className="py-16 md:py-24 border-t border-border">
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
        Technical Posts & Insights
      </h2>
      <p className="mt-4 text-xl text-text-secondary max-w-3xl">
        Deep dives into MLOps, LLM optimization, and the latest trends in production AI systems.
      </p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading recent posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="block group bg-background-secondary rounded-lg border border-border hover:border-accent-primary transition-colors duration-200 overflow-hidden"
              >
                {post.header_image && (
                  <img
                    src={post.header_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase text-accent-primary">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-text-primary group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-text-secondary text-sm">
                    {post.description}
                  </p>
                  <p className="mt-4 text-xs text-text-secondary opacity-75">
                    {post.date} · {post.read_time}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/blogs"
              className="inline-block text-navigation-active font-medium hover:text-accent-primary transition-colors duration-200 border-b border-navigation-active hover:border-accent-primary"
            >
              View All Posts ({totalPosts} total)
            </a>
          </div>
        </>
      )}
    </section>
  );
}

