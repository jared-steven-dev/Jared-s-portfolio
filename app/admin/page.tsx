"use client";

import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type BlockType = 'heading' | 'paragraph' | 'image' | 'code' | 'blockquote' | 'keytakeaways' | 'toc' | 'sponsored';

interface Block {
    id: string;
    type: BlockType;
    content: string;
    level?: number; // for headings
    sponsoredData?: {
        heading: string;
        paragraph: string;
        imageUrl: string;
        buttonText: string;
        buttonLink: string;
    };
}

interface Post {
    id?: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    date: string;
    readTime: string;
    headerImage: string;
    blocks: Block[];
}

const SortableBlockEditor = ({ block, onChange, onDelete }: { block: Block; onChange: (block: Block) => void; onDelete: () => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const updateContent = (content: string) => {
        onChange({ ...block, content });
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'heading':
                return (
                    <div className="mb-4">
                        <select
                            value={block.level || 2}
                            onChange={(e) => onChange({ ...block, level: parseInt(e.target.value) })}
                            className="mb-2 p-2 bg-background-secondary border border-border rounded-md text-sm"
                        >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                        </select>
                        <input
                            type="text"
                            value={block.content}
                            onChange={(e) => updateContent(e.target.value)}
                            placeholder="Enter heading..."
                            className="w-full p-3 bg-background-secondary border border-border rounded-md text-xl font-bold"
                        />
                    </div>
                );
            case 'paragraph':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Enter paragraph text..."
                        rows={4}
                        className="w-full p-3 bg-background-secondary border border-border rounded-md"
                    />
                );
            case 'image':
                return (
                    <div className="mb-4">
                        <input
                            type="text"
                            value={block.content}
                            onChange={(e) => updateContent(e.target.value)}
                            placeholder="Enter image URL..."
                            className="w-full p-3 bg-background-secondary border border-border rounded-md mb-2"
                        />
                        {block.content && (
                            <img src={block.content} alt="Preview" className="w-full rounded-md" />
                        )}
                    </div>
                );
            case 'code':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Enter code..."
                        rows={6}
                        className="w-full p-3 bg-gray-800 text-white font-mono border border-border rounded-md"
                    />
                );
            case 'blockquote':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Enter quote..."
                        rows={3}
                        className="w-full p-3 bg-background-secondary border-l-4 border-accent-primary rounded-md italic"
                    />
                );
            case 'keytakeaways':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Enter key takeaways (one per line)..."
                        rows={5}
                        className="w-full p-3 bg-background-secondary border border-accent-primary rounded-md"
                    />
                );
            case 'toc':
                return (
                    <div className="p-4 bg-background-secondary border border-border rounded-md">
                        <p className="text-sm text-text-secondary">Table of Contents will be auto-generated from headings</p>
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
                    <div className="mb-4 space-y-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">Heading</label>
                            <input
                                type="text"
                                value={sponsoredData.heading}
                                onChange={(e) => onChange({ 
                                    ...block, 
                                    sponsoredData: { ...sponsoredData, heading: e.target.value }
                                })}
                                placeholder="Sponsored content heading..."
                                className="w-full p-2 bg-background-primary border border-border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Description</label>
                            <textarea
                                value={sponsoredData.paragraph}
                                onChange={(e) => onChange({ 
                                    ...block, 
                                    sponsoredData: { ...sponsoredData, paragraph: e.target.value }
                                })}
                                placeholder="Sponsored content description..."
                                rows={3}
                                className="w-full p-2 bg-background-primary border border-border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                value={sponsoredData.imageUrl}
                                onChange={(e) => onChange({ 
                                    ...block, 
                                    sponsoredData: { ...sponsoredData, imageUrl: e.target.value }
                                })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full p-2 bg-background-primary border border-border rounded-md text-sm"
                            />
                            {sponsoredData.imageUrl && (
                                <img src={sponsoredData.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-md" />
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={sponsoredData.buttonText}
                                    onChange={(e) => onChange({ 
                                        ...block, 
                                        sponsoredData: { ...sponsoredData, buttonText: e.target.value }
                                    })}
                                    placeholder="Learn More"
                                    className="w-full p-2 bg-background-primary border border-border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Button Link</label>
                                <input
                                    type="text"
                                    value={sponsoredData.buttonLink}
                                    onChange={(e) => onChange({ 
                                        ...block, 
                                        sponsoredData: { ...sponsoredData, buttonLink: e.target.value }
                                    })}
                                    placeholder="https://..."
                                    className="w-full p-2 bg-background-primary border border-border rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary">This will be displayed as a highlighted sponsored content block</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`mb-4 p-4 border border-border rounded-lg bg-background-secondary ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <button
                        className="cursor-move text-text-secondary hover:text-text-primary p-1"
                        {...attributes}
                        {...listeners}
                    >
                        ⋮⋮
                    </button>
                    <span className="text-xs font-semibold text-accent-primary uppercase">{block.type}</span>
                </div>
                <button
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Delete
                </button>
            </div>
            {renderBlock()}
        </div>
    );
};

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPost, setCurrentPost] = useState<Post>({
        title: '',
        slug: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        headerImage: '',
        blocks: [],
    });
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [showPostList, setShowPostList] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading posts:', error);
        } else {
            setPosts(data || []);
        }
    };

    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: Date.now().toString(),
            type,
            content: '',
            level: type === 'heading' ? 2 : undefined,
        };
        setCurrentPost({ ...currentPost, blocks: [...currentPost.blocks, newBlock] });
    };

    const updateBlock = (index: number, updatedBlock: Block) => {
        const newBlocks = [...currentPost.blocks];
        newBlocks[index] = updatedBlock;
        setCurrentPost({ ...currentPost, blocks: newBlocks });
    };

    const deleteBlock = (index: number) => {
        const newBlocks = currentPost.blocks.filter((_, i) => i !== index);
        setCurrentPost({ ...currentPost, blocks: newBlocks });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = currentPost.blocks.findIndex((block) => block.id === active.id);
            const newIndex = currentPost.blocks.findIndex((block) => block.id === over.id);

            const newBlocks = arrayMove(currentPost.blocks, oldIndex, newIndex);
            setCurrentPost({ ...currentPost, blocks: newBlocks });
        }
    };

    const savePost = async () => {
        if (!currentPost.title || !currentPost.slug) {
            alert('Please fill in title and slug');
            return;
        }

        const postData = {
            title: currentPost.title,
            slug: currentPost.slug,
            category: currentPost.category,
            description: currentPost.description,
            date: currentPost.date,
            read_time: currentPost.readTime,
            header_image: currentPost.headerImage,
            blocks: currentPost.blocks,
        };

        if (editingPostId) {
            const { error } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', editingPostId);

            if (error) {
                console.error('Error updating post:', error);
                alert('Error updating post: ' + error.message);
            } else {
                alert('Post updated successfully!');
                loadPosts();
            }
        } else {
            const { error } = await supabase
                .from('posts')
                .insert([postData]);

            if (error) {
                console.error('Error saving post:', error);
                alert('Error saving post: ' + error.message);
            } else {
                alert('Post saved successfully!');
                loadPosts();
                resetEditor();
            }
        }
    };

    const loadPost = (post: any) => {
        setCurrentPost({
            title: post.title,
            slug: post.slug,
            category: post.category,
            description: post.description,
            date: post.date,
            readTime: post.read_time,
            headerImage: post.header_image,
            blocks: post.blocks || [],
        });
        setEditingPostId(post.id);
        setShowPostList(false);
    };

    const resetEditor = () => {
        setCurrentPost({
            title: '',
            slug: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read',
            headerImage: '',
            blocks: [],
        });
        setEditingPostId(null);
    };

    const deletePost = async (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting post:', error);
            } else {
                alert('Post deleted successfully!');
                loadPosts();
            }
        }
    };

    return (
        <div className="bg-background-primary text-text-primary min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
                        {editingPostId ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setShowPostList(!showPostList)}
                            className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary transition-colors"
                        >
                            {showPostList ? 'Hide Posts' : 'View Posts'}
                        </button>
                        {editingPostId && (
                            <button
                                onClick={resetEditor}
                                className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary transition-colors"
                            >
                                New Post
                            </button>
                        )}
                    </div>
                </div>

                {showPostList && (
                    <div className="mb-8 p-6 bg-background-secondary border border-border rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">All Posts</h2>
                        {posts.length === 0 ? (
                            <p className="text-text-secondary">No posts yet</p>
                        ) : (
                            <div className="space-y-2">
                                {posts.map((post: any) => (
                                    <div key={post.id} className="flex justify-between items-center p-4 bg-background-primary border border-border rounded-md">
                                        <div>
                                            <h3 className="font-semibold">{post.title}</h3>
                                            <p className="text-sm text-text-secondary">{post.date}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => loadPost(post)}
                                                className="px-3 py-1 bg-accent-primary text-white rounded-md hover:opacity-80"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:opacity-80"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                placeholder="Blog Post Title"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Slug *</label>
                            <input
                                type="text"
                                value={currentPost.slug}
                                onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                placeholder="blog-post-slug"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <input
                                type="text"
                                value={currentPost.category}
                                onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                placeholder="Tech, MLOps, etc."
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Read Time</label>
                            <input
                                type="text"
                                value={currentPost.readTime}
                                onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                                placeholder="5 min read"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                value={currentPost.date}
                                onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Header Image URL</label>
                            <input
                                type="text"
                                value={currentPost.headerImage}
                                onChange={(e) => setCurrentPost({ ...currentPost, headerImage: e.target.value })}
                                placeholder="https://..."
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={currentPost.description}
                            onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
                            placeholder="Brief description of the post..."
                            rows={3}
                            className="w-full p-3 bg-background-secondary border border-border rounded-md"
                        />
                    </div>

                    <div className="border-t border-border pt-6">
                        <h2 className="text-2xl font-bold mb-4">Content Blocks</h2>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button onClick={() => addBlock('heading')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Heading
                            </button>
                            <button onClick={() => addBlock('paragraph')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Paragraph
                            </button>
                            <button onClick={() => addBlock('image')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Image
                            </button>
                            <button onClick={() => addBlock('code')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Code
                            </button>
                            <button onClick={() => addBlock('blockquote')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Quote
                            </button>
                            <button onClick={() => addBlock('keytakeaways')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Key Takeaways
                            </button>
                            <button onClick={() => addBlock('toc')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Table of Contents
                            </button>
                            <button onClick={() => addBlock('sponsored')} className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary">
                                + Sponsored
                            </button>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={currentPost.blocks.map(block => block.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {currentPost.blocks.map((block, index) => (
                                        <SortableBlockEditor
                                            key={block.id}
                                            block={block}
                                            onChange={(updatedBlock) => updateBlock(index, updatedBlock)}
                                            onDelete={() => deleteBlock(index)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {currentPost.blocks.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                Click a button above to add your first content block
                            </div>
                        )}
                    </div>

                    <button
                        onClick={savePost}
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                    >
                        {editingPostId ? 'Update Post' : 'Save Post'}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
