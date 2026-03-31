"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded">
      <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50">
        <ToolButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          title="Negrita"
          bold
        />
        <ToolButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          title="Itálica"
          italic
        />
        <ToolButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="H2"
          title="Título"
        />
        <ToolButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="H3"
          title="Subtítulo"
        />
        <ToolButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="• Lista"
          title="Lista"
        />
        <ToolButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="❝"
          title="Cita"
        />
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL de la imagen:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 text-xs rounded hover:bg-gray-200"
          title="Imagen"
        >
          🖼
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL del enlace:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
          className="px-2 py-1 text-xs rounded hover:bg-gray-200"
          title="Enlace"
        >
          🔗
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-3 min-h-[200px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
      />
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  label,
  title,
  bold,
  italic,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title: string;
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-xs rounded ${active ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"} ${bold ? "font-bold" : ""} ${italic ? "italic" : ""}`}
    >
      {label}
    </button>
  );
}
