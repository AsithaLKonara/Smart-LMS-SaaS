
"use client";

import { useEditor, EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Code,
    Strikethrough,
    Minus
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

const Toolbar = ({ editor }: { editor: TiptapEditor | null }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8", editor.isActive("bold") && "bg-white/10 text-accent-cyan")}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-8 w-8", editor.isActive("italic") && "bg-white/10 text-accent-cyan")}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn("h-8 w-8", editor.isActive("underline") && "bg-white/10 text-accent-cyan")}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn("h-8 w-8", editor.isActive("strike") && "bg-white/10 text-accent-cyan")}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href
                    const url = window.prompt('URL', previousUrl)

                    // cancelled
                    if (url === null) {
                        return
                    }

                    // empty
                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run()
                        return
                    }

                    // update
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
                className={cn("h-8 w-8", editor.isActive("link") && "bg-white/10 text-accent-cyan")}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-white/10 text-accent-cyan")}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-white/10 text-accent-cyan")}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-8 bg-white/10 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-white/10 text-accent-cyan")}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-white/10 text-accent-cyan")}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("h-8 w-8", editor.isActive("blockquote") && "bg-white/10 text-accent-cyan")}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={cn("h-8 w-8", editor.isActive("codeBlock") && "bg-white/10 text-accent-cyan")}
            >
                <Code className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-8 bg-white/10 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                className="h-8 w-8"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                className="h-8 w-8"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};

export const Editor = ({ onChange, value }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none min-h-[150px] p-4 focus:outline-none"
            }
        }
    });

    return (
        <div className="bg-background-secondary border border-white/10 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-accent-cyan transition-all">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
