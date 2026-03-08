"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
  Code,
  TextHTwo,
  TextHThree,
} from "@phosphor-icons/react/dist/ssr"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: false,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [value, editor])

  const toolbarButton = (action: () => void, isActive: boolean, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={action}
      className={cn(
        "p-1.5 rounded hover:bg-muted transition-colors",
        isActive && "bg-muted text-foreground"
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  )

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      {editor && (
        <div className="flex flex-wrap gap-0.5 border-b p-1.5 bg-muted/30">
          {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), <TextHTwo size={16} />, "Heading 2")}
          {toolbarButton(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), <TextHThree size={16} />, "Heading 3")}
          <div className="w-px bg-border mx-1" />
          {toolbarButton(() => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), <TextB size={16} />, "Bold")}
          {toolbarButton(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), <TextItalic size={16} />, "Italic")}
          <div className="w-px bg-border mx-1" />
          {toolbarButton(() => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), <ListBullets size={16} />, "Bullet list")}
          {toolbarButton(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), <ListNumbers size={16} />, "Numbered list")}
          <div className="w-px bg-border mx-1" />
          {toolbarButton(() => editor.chain().focus().toggleCode().run(), editor.isActive("code"), <Code size={16} />, "Inline code")}
          {toolbarButton(() => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"), <Code weight="fill" size={16} />, "Code block")}
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[160px] focus-within:outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}
