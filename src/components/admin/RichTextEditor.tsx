import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { uploadCoverImage } from '@/lib/articles';
import { cleanPastedHtml } from '@/lib/pasteClean';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

/* ---------- options ---------- */

const FONT_SIZES = ['12px', '14px', '16px', '17px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];

const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: "'JetBrains Mono', ui-monospace, monospace" },
];

const TEXT_COLORS = [
  '#14141F', '#55556B', '#8A8AA0', '#FFFFFF',
  '#6262E9', '#4A4AD1', '#2A2665', '#0E7490',
  '#B3413F', '#D97706', '#1A8259', '#8D5DB8',
];

const HIGHLIGHT_COLORS = ['#FEF08A', '#FDE68A', '#BBF7D0', '#BAE6FD', '#EAD8FF', '#FBCFE8', '#FECACA', '#E5E7EB'];

const BLOCKS = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
];

/* ---------- small UI pieces ---------- */

const btn =
  'inline-flex items-center justify-center min-w-[30px] h-[30px] px-1.5 rounded text-[13px] leading-none transition-colors disabled:opacity-35 disabled:cursor-not-allowed';
const btnIdle = 'text-text-secondary hover:bg-foreground/[0.07]';
const btnOn = 'bg-primary/15 text-primary';
const selectCls =
  'h-[30px] rounded border border-foreground/15 bg-background px-1.5 text-[13px] text-foreground focus:outline-none focus:border-primary';

function Btn({
  on, onClick, title, children, disabled,
}: { on?: boolean; onClick: () => void; title: string; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`${btn} ${on ? btnOn : btnIdle}`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px self-center bg-foreground/10" />;

/** Colour button with a swatch popover, a custom picker and a reset. */
function ColorMenu({
  title, icon, current, colors, onPick, onReset,
}: {
  title: string; icon: ReactNode; current?: string; colors: string[]; onPick: (c: string) => void; onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title={title}
        aria-label={title}
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className={`${btn} ${btnIdle} flex-col gap-0.5 ${open ? 'bg-foreground/[0.07]' : ''}`}
      >
        <span className="leading-none">{icon}</span>
        <span className="block h-[3px] w-4 rounded-sm" style={{ background: current || 'transparent', outline: current ? 'none' : '1px solid rgba(0,0,0,.25)' }} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[196px] rounded-lg border border-foreground/15 bg-card p-3 shadow-lg">
          <div className="grid grid-cols-6 gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                aria-label={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(c); setOpen(false); }}
                className="h-6 w-6 rounded border border-foreground/20 hover:scale-110 transition-transform"
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-foreground/10 pt-3 text-[12px] text-text-secondary">
            <label className="flex items-center gap-2 cursor-pointer">
              Custom
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(current ?? '') ? (current as string) : '#6262e9'}
                onChange={(e) => onPick(e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border border-foreground/20 bg-transparent p-0"
              />
            </label>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onReset(); setOpen(false); }}
              className="rounded px-2 py-1 hover:bg-foreground/[0.07]"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- toolbar ---------- */

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const ts = e.getAttributes('textStyle');
      const block = e.isActive('heading', { level: 1 }) ? 'h1'
        : e.isActive('heading', { level: 2 }) ? 'h2'
        : e.isActive('heading', { level: 3 }) ? 'h3'
        : e.isActive('heading', { level: 4 }) ? 'h4' : 'p';
      return {
        block,
        fontSize: (ts.fontSize as string) || '',
        fontFamily: (ts.fontFamily as string) || '',
        color: (ts.color as string) || '',
        highlight: (e.getAttributes('highlight').color as string) || '',
        bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'),
        strike: e.isActive('strike'), code: e.isActive('code'),
        sub: e.isActive('subscript'), sup: e.isActive('superscript'),
        left: e.isActive({ textAlign: 'left' }), center: e.isActive({ textAlign: 'center' }),
        right: e.isActive({ textAlign: 'right' }), justify: e.isActive({ textAlign: 'justify' }),
        bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'), task: e.isActive('taskList'),
        quote: e.isActive('blockquote'), codeBlock: e.isActive('codeBlock'), link: e.isActive('link'),
        canUndo: e.can().undo(), canRedo: e.can().redo(),
      };
    },
  });

  const run = () => editor.chain().focus();

  const setBlock = (v: string) => {
    if (v === 'p') run().setParagraph().run();
    else run().setHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 | 4 }).run();
  };

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave empty to remove)', prev ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') { run().extendMarkRange('link').unsetLink().run(); return; }
    run().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadCoverImage(file);
        run().setImage({ src: url, alt: '' }).run();
      } catch (e: unknown) {
        window.alert(e instanceof Error ? e.message : 'Image upload failed');
      }
    };
    input.click();
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 rounded-t border-b border-foreground/10 bg-card p-2">
      <Btn title="Undo (⌘Z)" disabled={!s.canUndo} onClick={() => run().undo().run()}>↶</Btn>
      <Btn title="Redo (⇧⌘Z)" disabled={!s.canRedo} onClick={() => run().redo().run()}>↷</Btn>
      <Sep />
      <select aria-label="Text style" className={`${selectCls} w-[108px]`} value={s.block} onChange={(e) => setBlock(e.target.value)}>
        {BLOCKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
      </select>
      <select
        aria-label="Font"
        className={`${selectCls} w-[118px]`}
        value={FONT_FAMILIES.some((f) => f.value === s.fontFamily) ? s.fontFamily : ''}
        onChange={(e) => (e.target.value ? run().setFontFamily(e.target.value).run() : run().unsetFontFamily().run())}
      >
        <option value="">Default font</option>
        {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <select
        aria-label="Font size"
        className={`${selectCls} w-[84px]`}
        value={FONT_SIZES.includes(s.fontSize) ? s.fontSize : ''}
        onChange={(e) => (e.target.value ? run().setFontSize(e.target.value).run() : run().unsetFontSize().run())}
      >
        <option value="">Size</option>
        {FONT_SIZES.map((f) => <option key={f} value={f}>{f.replace('px', '')}</option>)}
      </select>
      <Sep />
      <Btn title="Bold (⌘B)" on={s.bold} onClick={() => run().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Italic (⌘I)" on={s.italic} onClick={() => run().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Underline (⌘U)" on={s.underline} onClick={() => run().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Strikethrough" on={s.strike} onClick={() => run().toggleStrike().run()}><s>S</s></Btn>
      <Btn title="Inline code" on={s.code} onClick={() => run().toggleCode().run()}>{'</>'}</Btn>
      <Btn title="Subscript" on={s.sub} onClick={() => run().toggleSubscript().run()}>x<sub>2</sub></Btn>
      <Btn title="Superscript" on={s.sup} onClick={() => run().toggleSuperscript().run()}>x<sup>2</sup></Btn>
      <Sep />
      <ColorMenu
        title="Text colour"
        icon={<b className="text-[14px]">A</b>}
        current={s.color}
        colors={TEXT_COLORS}
        onPick={(c) => run().setColor(c).run()}
        onReset={() => run().unsetColor().run()}
      />
      <ColorMenu
        title="Highlight colour"
        icon={<span className="rounded-sm px-1 text-[12px] font-semibold" style={{ background: s.highlight || '#FEF08A' }}>ab</span>}
        current={s.highlight}
        colors={HIGHLIGHT_COLORS}
        onPick={(c) => run().setHighlight({ color: c }).run()}
        onReset={() => run().unsetHighlight().run()}
      />
      <Sep />
      <Btn title="Align left" on={s.left} onClick={() => run().setTextAlign('left').run()}>⇤</Btn>
      <Btn title="Align centre" on={s.center} onClick={() => run().setTextAlign('center').run()}>↔</Btn>
      <Btn title="Align right" on={s.right} onClick={() => run().setTextAlign('right').run()}>⇥</Btn>
      <Btn title="Justify" on={s.justify} onClick={() => run().setTextAlign('justify').run()}>☰</Btn>
      <Sep />
      <Btn title="Bullet list" on={s.bullet} onClick={() => run().toggleBulletList().run()}>• List</Btn>
      <Btn title="Numbered list" on={s.ordered} onClick={() => run().toggleOrderedList().run()}>1. List</Btn>
      <Btn title="Checklist" on={s.task} onClick={() => run().toggleTaskList().run()}>☑ List</Btn>
      <Btn title="Indent list item" onClick={() => run().sinkListItem(s.task ? 'taskItem' : 'listItem').run()}>→</Btn>
      <Btn title="Outdent list item" onClick={() => run().liftListItem(s.task ? 'taskItem' : 'listItem').run()}>←</Btn>
      <Sep />
      <Btn title="Quote" on={s.quote} onClick={() => run().toggleBlockquote().run()}>❝</Btn>
      <Btn title="Code block" on={s.codeBlock} onClick={() => run().toggleCodeBlock().run()}>{'{ }'}</Btn>
      <Btn title="Divider" onClick={() => run().setHorizontalRule().run()}>──</Btn>
      <Sep />
      <Btn title="Link" on={s.link} onClick={setLink}>Link</Btn>
      <Btn title="Image" onClick={insertImage}>Image</Btn>
      <Sep />
      <Btn title="Clear formatting" onClick={() => run().unsetAllMarks().clearNodes().run()}>Tx</Btn>
    </div>
  );
}

/* ---------- editor ---------- */

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } },
      }),
      TextStyleKit, // text-style + colour, font family, font size, background colour, line height
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Placeholder.configure({ placeholder: 'Write your article…' }),
    ],
    content: value || '',
    editorProps: {
      // Pasted rich text: drop the source's font sizes/families and emoji images, link bare URLs.
      transformPastedHTML: cleanPastedHtml,
      attributes: {
        class:
          'article-body font-body text-[17px] leading-[1.75] text-foreground min-h-[460px] focus:outline-none px-5 py-6',
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
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

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded border border-foreground/15 bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-4 rounded-b border-t border-foreground/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
        <span>{words} words</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
