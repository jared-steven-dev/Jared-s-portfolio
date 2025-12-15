"use client";

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Blog {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    date: string;
    read_time: string;
    header_image: string;
}

export default function PostsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, slug, category, description, date, read_time, header_image')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error loading blogs:', error);
        } else {
            setBlogs(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="bg-background-primary text-text-primary">
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h1 className="text-3xl md:text-5xl font-bold text-text-primary text-center">
                    Blog
                </h1>
                <p className="mt-4 text-xl text-text-secondary max-w-3xl mx-auto text-center">
                    Deep dives into AI and Data Governance, MLOps, LLM optimization, AI Research and the latest trends in production AI systems.
                </p>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">Loading posts...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.slug}
                                href={"/blogs/" + blog.slug}
                                className="block group bg-background-secondary rounded-lg border border-border hover:border-accent-primary transition-colors duration-200 overflow-hidden"
                            >
                                {blog.header_image && (
                                    <img
                                        src={blog.header_image}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <p className="text-sm font-semibold uppercase text-accent-primary">
                                        {blog.category}
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-text-primary group-hover:underline">
                                        {blog.title}
                                    </h3>
                                    <p className="mt-3 text-text-secondary text-sm">
                                        {blog.description}
                                    </p>
                                    <p className="mt-4 text-xs text-text-secondary opacity-75">
                                        {blog.date} · {blog.read_time}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
