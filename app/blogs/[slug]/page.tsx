"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import DataVisualization from "@/components/DataVisualization";

interface Block {
    id: string;
    type: string;
    content: string;
    level?: number;
    sponsoredData?: {
        heading: string;
        paragraph: string;
        imageUrl: string;
        buttonText: string;
        buttonLink: string;
    };
}

interface Post {
    title: string;
    date: string;
    category: string;
    header_image: string;
    blocks: Block[];
}

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg" />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                    <p className="text-gray-400">Failed to load image</p>
                </div>
            )}
        </div>
    );
};

const BlockRenderer = ({ block, allBlocks }: { block: Block; allBlocks: Block[] }) => {
    switch (block.type) {
        case 'heading':
            const HeadingTag = `h${block.level || 2}` as keyof React.JSX.IntrinsicElements;
            const headingClass = block.level === 1
                ? "text-3xl md:text-4xl font-bold text-text-primary mt-8"
                : block.level === 2
                    ? "text-2xl md:text-3xl font-bold text-text-primary mt-8"
                    : "text-xl md:text-2xl font-bold text-text-primary mt-8";
            return <HeadingTag id={block.content.toLowerCase().replace(/\s+/g, '-')} className={headingClass}>{block.content}</HeadingTag>;

        case 'paragraph':
            return (
                <div 
                    className="mt-4 text-text-primary leading-relaxed prose prose-invert max-w-none
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                        [&_li]:my-1
                        [&_a]:text-accent-primary [&_a]:underline
                        [&_strong]:font-bold
                        [&_em]:italic
                        [&_s]:line-through
                        [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded
                        [&_blockquote]:border-l-4 [&_blockquote]:border-accent-primary [&_blockquote]:pl-4 [&_blockquote]:italic"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            );

        case 'image':
            return <LazyImage src={block.content} alt="Blog content" className="rounded-lg my-8 w-full h-auto" />;

        case 'code':
            return (
                <pre className="bg-gray-800 text-white p-4 rounded-lg my-8 overflow-x-auto">
                    <code>{block.content}</code>
                </pre>
            );

        case 'blockquote':
            return (
                <blockquote 
                    className="border-l-4 border-accent-primary pl-4 italic text-text-secondary my-8 prose prose-invert max-w-none
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                        [&_a]:text-accent-primary [&_a]:underline
                        [&_strong]:font-bold"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            );

        case 'keytakeaways':
            return (
                <div className="bg-background-secondary p-6 rounded-lg border border-accent-primary my-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Key Takeaways</h2>
                    <div 
                        className="prose prose-invert max-w-none
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                            [&_li]:my-1
                            [&_a]:text-accent-primary [&_a]:underline
                            [&_strong]:font-bold
                            [&_em]:italic"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                </div>
            );

        case 'toc':
            const headings = allBlocks.filter(b => b.type === 'heading');
            return (
                <div className="bg-background-secondary p-6 rounded-lg border border-border my-8">
                    <h2 className="text-xl font-bold text-accent-primary">Table of Contents</h2>
                    {headings.length > 0 ? (
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            {headings.map((heading, index) => {
                                const headingId = heading.content.toLowerCase().replace(/\s+/g, '-');
                                const indent = heading.level === 1 ? 'ml-0' : heading.level === 2 ? 'ml-4' : 'ml-8';
                                return (
                                    <li key={index} className={indent}>
                                        <a href={`#${headingId}`} className="hover:underline text-text-primary">
                                            {heading.content}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-text-secondary">
                            No headings found in this post
                        </p>
                    )}
                </div>
            );

        case 'sponsored':
            const sponsoredData = block.sponsoredData || {
                heading: '',
                paragraph: '',
                imageUrl: '',
                buttonText: '',
                buttonLink: '',
            };
            return (
                <div className="bg-background-secondary p-6 rounded-lg border-2 border-accent-primary my-8 relative">
                    <div className="absolute top-2 right-2 text-xs font-bold text-accent-primary uppercase bg-background-primary px-2 py-1 rounded z-10">
                        Sponsored
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                        <div className="flex-1 flex flex-col justify-center">
                            {sponsoredData.heading && (
                                <h3 className="text-2xl font-bold text-text-primary mb-3">
                                    {sponsoredData.heading}
                                </h3>
                            )}
                            {sponsoredData.paragraph && (
                                <p className="text-text-secondary mb-4 leading-relaxed">
                                    {sponsoredData.paragraph}
                                </p>
                            )}
                            {sponsoredData.buttonText && sponsoredData.buttonLink && (
                                <a
                                    href={sponsoredData.buttonLink}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="inline-block px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity self-start"
                                >
                                    {sponsoredData.buttonText}
                                </a>
                            )}
                        </div>
                        {sponsoredData.imageUrl && (
                            <div className="md:w-1/2 flex-shrink-0">
                                <LazyImage
                                    src={sponsoredData.imageUrl}
                                    alt={sponsoredData.heading}
                                    className="w-full h-full min-h-[200px] object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            );

        default:
            return null;
    }
};

export default function BlogPost() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            loadPost();
        }
    }, [slug]);

    useEffect(() => {
        // Update document title when post is loaded
        if (post) {
            document.title = `${post.title} | Jared Steven | AI Engineer`;
        }

        // Cleanup: reset to default title when component unmounts
        return () => {
            document.title = 'Jared Steven | AI Engineer';
        };
    }, [post]);

    const loadPost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error loading post:', error);
            setError('Post not found');
        } else {
            setPost(data);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="bg-background-primary text-text-primary min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <p className="text-center">Loading...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-background-primary text-text-primary min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <p className="text-center text-red-500">{error || 'Post not found'}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background-primary text-text-primary">
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <article className="prose prose-invert lg:prose-xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
                            {post.title}
                        </h1>
                        <p className="mt-2 text-sm text-text-secondary">{post.date}</p>
                    </div>

                    {post.header_image && (
                        <LazyImage
                            src={post.header_image}
                            alt="Article header image"
                            className="rounded-lg mb-8 w-full h-auto"
                        />
                    )}

                    <div className="space-y-4">
                        {post.blocks && post.blocks.map((block) => (
                            <BlockRenderer key={block.id} block={block} allBlocks={post.blocks} />
                        ))}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
