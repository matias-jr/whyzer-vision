import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { uploadCoverImage } from '@/lib/articles';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const btnBase =
  'font-mono text-xs uppercase tracking-wider px-2 py-1 rounded hover:bg-foreground/10 transition-colors';
const btnActive = 'bg-foreground/15 text-foreground';
const btnIdle = 'text-text-secondary';

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write your article…',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'article-body font-body text-[17px] leading-[1.75] text-foreground min-h-[400px] focus:outline-none px-4 py-6',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
    // we only sync external `value` changes when editor first mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-foreground/15 rounded p-6 font-mono text-sm text-text-secondary">
        Loading editor…
      </div>
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadCoverImage(file);
        editor.chain().focus().setImage({ src: url, alt: '' }).run();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Image upload failed';
        alert(msg);
      }
    };
    input.click();
  };

  return (
    <div className="border border-foreground/15 rounded">
      <div className="flex flex-wrap gap-1 border-b border-foreground/10 p-2 bg-foreground/[0.02]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} ${editor.isActive('bold') ? btnActive : btnIdle}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnBase} italic ${editor.isActive('italic') ? btnActive : btnIdle}`}
        >
          I
        </button>
        <span className="w-px bg-foreground/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btnBase} ${editor.isActive('heading', { level: 2 }) ? btnActive : btnIdle}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btnBase} ${editor.isActive('heading', { level: 3 }) ? btnActive : btnIdle}`}
        >
          H3
        </button>
        <span className="w-px bg-foreground/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnBase} ${editor.isActive('bulletList') ? btnActive : btnIdle}`}
        >
          •  List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnBase} ${editor.isActive('orderedList') ? btnActive : btnIdle}`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btnBase} ${editor.isActive('blockquote') ? btnActive : btnIdle}`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${btnBase} ${editor.isActive('codeBlock') ? btnActive : btnIdle}`}
        >
          Code
        </button>
        <span className="w-px bg-foreground/10 mx-1" />
        <button type="button" onClick={setLink} className={`${btnBase} ${btnIdle}`}>
          Link
        </button>
        <button type="button" onClick={insertImage} className={`${btnBase} ${btnIdle}`}>
          Image
        </button>
        <span className="w-px bg-foreground/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`${btnBase} ${btnIdle}`}
        >
          ──
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={`${btnBase} ${btnIdle}`}
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={`${btnBase} ${btnIdle}`}
        >
          ↷
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
