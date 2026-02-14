
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: true,
            }),
        ],
        content: value,
        editable: false,
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none"
            }
        }
    });

    return (
        <div className="bg-transparent overflow-hidden">
            <EditorContent editor={editor} />
        </div>
    );
};
