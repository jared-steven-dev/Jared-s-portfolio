"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-background-primary rounded-t-md">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('bold') ? 'bg-accent-primary text-white' : ''}`}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('italic') ? 'bg-accent-primary text-white' : ''}`}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('strike') ? 'bg-accent-primary text-white' : ''}`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>
            <span className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('bulletList') ? 'bg-accent-primary text-white' : ''}`}
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('orderedList') ? 'bg-accent-primary text-white' : ''}`}
                title="Numbered List"
            >
                1. List
            </button>
            <span className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={setLink}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('link') ? 'bg-accent-primary text-white' : ''}`}
                title="Add Link"
            >
                🔗 Link
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                className="px-2 py-1 text-sm rounded hover:bg-background-secondary disabled:opacity-50"
                title="Remove Link"
            >
                Unlink
            </button>
            <span className="w-px bg-border mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('blockquote') ? 'bg-accent-primary text-white' : ''}`}
                title="Quote"
            >
                " Quote
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`px-2 py-1 text-sm rounded hover:bg-background-secondary ${editor.isActive('code') ? 'bg-accent-primary text-white' : ''}`}
                title="Inline Code"
            >
                {'</>'}
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder = "Start typing...", className = "" }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent-primary underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: content || '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none p-3 min-h-[120px] focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    return (
        <div className={`border border-border rounded-md bg-background-secondary ${className}`}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
