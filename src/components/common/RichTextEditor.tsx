import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link, Image, Minus,
  Heading1, Heading2, Heading3, Code, Undo, Redo,
  Type, RemoveFormatting, X, Check, Youtube,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// ── Toolbar button ─────────────────────────────────────────────────────────
const Btn: React.FC<{
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  active?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}> = ({ onMouseDown, title, active, danger, children }) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    title={title}
    className={`w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0
      ${active  ? 'bg-zinc-900 text-white'
      : danger  ? 'text-zinc-500 hover:bg-rose-50 hover:text-rose-600'
      :            'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}`}
  >
    {children}
  </button>
);

const Sep = () => <div className="w-px h-5 bg-zinc-200 mx-0.5 self-center shrink-0" />;

// ── Inline dialog for link / image / video ─────────────────────────────────
type DialogType = 'link' | 'image' | 'video' | null;

interface InlineDialogProps {
  type: DialogType;
  onClose: () => void;
  onInsert: (value: string, text?: string) => void;
}

const InlineDialog: React.FC<InlineDialogProps> = ({ type, onClose, onInsert }) => {
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    urlRef.current?.focus();
    urlRef.current?.select();
  }, []);

  const handleInsert = () => {
    if (!url.trim() || url === 'https://') return;
    onInsert(url.trim(), text.trim());
    onClose();
  };

  const labels: Record<NonNullable<DialogType>, { title: string; placeholder: string; showText: boolean }> = {
    link:  { title: 'Sisipkan Tautan',       placeholder: 'https://contoh.com',          showText: true  },
    image: { title: 'Sisipkan Gambar (URL)', placeholder: 'https://contoh.com/foto.jpg', showText: false },
    video: { title: 'Sisipkan Video YouTube', placeholder: 'https://youtube.com/watch?v=...', showText: false },
  };

  if (!type) return null;
  const cfg = labels[type];

  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-zinc-200 rounded-b-lg shadow-xl p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-100">
      <p className="text-[11px] font-semibold text-zinc-700">{cfg.title}</p>

      {cfg.showText && (
        <input
          type="text"
          placeholder="Teks tautan (kosongkan jika teks sudah dipilih)"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full px-3 py-1.5 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400"
        />
      )}

      <div className="flex gap-2">
        <input
          ref={urlRef}
          type="url"
          placeholder={cfg.placeholder}
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleInsert(); if (e.key === 'Escape') onClose(); }}
          className="flex-1 px-3 py-1.5 text-xs border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-500 font-mono"
        />
        <button
          type="button"
          onClick={handleInsert}
          className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-md hover:bg-zinc-700 transition-colors flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" /> Sisipkan
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── Main Editor ────────────────────────────────────────────────────────────
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tulis isi artikel di sini...',
  minHeight = 320,
}) => {
  const editorRef  = useRef<HTMLDivElement>(null);
  const internal   = useRef(false);
  const savedRange = useRef<Range | null>(null);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [wordCount, setWordCount] = useState(0);

  // Sync value → DOM only when external update
  useEffect(() => {
    if (editorRef.current && !internal.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        updateWordCount();
      }
    }
    internal.current = false;
  }, [value]);

  const updateWordCount = () => {
    const text = editorRef.current?.innerText?.trim() || '';
    setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
  };

  const emit = useCallback(() => {
    if (editorRef.current) {
      internal.current = true;
      onChange(editorRef.current.innerHTML);
      updateWordCount();
    }
  }, [onChange]);

  const exec = useCallback((cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    emit();
  }, [emit]);

  const isOn = (cmd: string) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  // Save selection before opening dialog
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const openDialog = (type: DialogType) => {
    saveSelection();
    setDialog(type);
  };

  const handleInsert = (url: string, text?: string) => {
    restoreSelection();
    editorRef.current?.focus();

    if (dialog === 'link') {
      const sel = window.getSelection();
      const hasSelection = sel && sel.toString().trim().length > 0;
      if (hasSelection) {
        exec('createLink', url);
      } else {
        const displayText = text || url;
        exec('insertHTML', `<a href="${url}" target="_blank" rel="noopener">${displayText}</a>&nbsp;`);
      }
    } else if (dialog === 'image') {
      exec('insertHTML',
        `<figure style="margin:16px 0;text-align:center;">
          <img src="${url}" alt="Gambar Artikel" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.08);" />
        </figure>`
      );
    } else if (dialog === 'video') {
      // Extract YouTube video ID
      const ytMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        exec('insertHTML',
          `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;border-radius:8px;">
            <iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
          </div>`
        );
      } else {
        exec('insertHTML',
          `<a href="${url}" target="_blank" rel="noopener" style="display:inline-block;padding:8px 16px;background:#f4f4f5;border-radius:6px;font-size:13px;">▶ ${url}</a>`
        );
      }
    }
    setDialog(null);
  };

  // Toolbar sections definition
  const sections = [
    [
      { cmd: () => exec('undo'),  icon: <Undo className="w-3.5 h-3.5" />,  title: 'Undo (Ctrl+Z)' },
      { cmd: () => exec('redo'),  icon: <Redo className="w-3.5 h-3.5" />,  title: 'Redo (Ctrl+Y)' },
    ],
    [
      { cmd: () => exec('formatBlock','h1'), icon: <Heading1 className="w-3.5 h-3.5" />, title: 'Judul H1' },
      { cmd: () => exec('formatBlock','h2'), icon: <Heading2 className="w-3.5 h-3.5" />, title: 'Judul H2' },
      { cmd: () => exec('formatBlock','h3'), icon: <Heading3 className="w-3.5 h-3.5" />, title: 'Judul H3' },
      { cmd: () => exec('formatBlock','p'),  icon: <Type      className="w-3.5 h-3.5" />, title: 'Paragraf' },
    ],
    [
      { cmd: () => exec('bold'),          icon: <Bold          className="w-3.5 h-3.5" />, title: 'Tebal (Ctrl+B)',        activeCmd: 'bold' },
      { cmd: () => exec('italic'),        icon: <Italic        className="w-3.5 h-3.5" />, title: 'Miring (Ctrl+I)',       activeCmd: 'italic' },
      { cmd: () => exec('underline'),     icon: <Underline     className="w-3.5 h-3.5" />, title: 'Garis Bawah (Ctrl+U)', activeCmd: 'underline' },
      { cmd: () => exec('strikethrough'), icon: <Strikethrough className="w-3.5 h-3.5" />, title: 'Coret',                activeCmd: 'strikethrough' },
    ],
    [
      { cmd: () => exec('justifyLeft'),   icon: <AlignLeft    className="w-3.5 h-3.5" />, title: 'Rata Kiri',   activeCmd: 'justifyLeft' },
      { cmd: () => exec('justifyCenter'), icon: <AlignCenter  className="w-3.5 h-3.5" />, title: 'Tengah',      activeCmd: 'justifyCenter' },
      { cmd: () => exec('justifyRight'),  icon: <AlignRight   className="w-3.5 h-3.5" />, title: 'Rata Kanan',  activeCmd: 'justifyRight' },
      { cmd: () => exec('justifyFull'),   icon: <AlignJustify className="w-3.5 h-3.5" />, title: 'Rata Full',   activeCmd: 'justifyFull' },
    ],
    [
      { cmd: () => exec('insertUnorderedList'), icon: <List        className="w-3.5 h-3.5" />, title: 'Daftar Butir',  activeCmd: 'insertUnorderedList' },
      { cmd: () => exec('insertOrderedList'),   icon: <ListOrdered className="w-3.5 h-3.5" />, title: 'Daftar Nomor', activeCmd: 'insertOrderedList' },
      { cmd: () => exec('formatBlock','blockquote'), icon: <Quote className="w-3.5 h-3.5" />, title: 'Kutipan' },
      { cmd: () => exec('formatBlock','pre'),   icon: <Code className="w-3.5 h-3.5" />,        title: 'Blok Kode' },
    ],
  ];

  return (
    <div className="border border-zinc-300 rounded-lg overflow-visible bg-white focus-within:border-zinc-500 transition-colors relative">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-zinc-50 border-b border-zinc-200 relative z-10">
        {sections.map((sec, si) => (
          <React.Fragment key={si}>
            {si > 0 && <Sep />}
            {sec.map((btn, bi) => (
              <Btn
                key={bi}
                onMouseDown={(e) => { e.preventDefault(); btn.cmd(); }}
                title={btn.title}
                active={'activeCmd' in btn ? isOn(btn.activeCmd!) : false}
              >
                {btn.icon}
              </Btn>
            ))}
          </React.Fragment>
        ))}

        {/* ── Insert group ── */}
        <Sep />

        {/* Link */}
        <Btn
          onMouseDown={(e) => { e.preventDefault(); openDialog('link'); }}
          title="Sisipkan Tautan"
          active={dialog === 'link'}
        >
          <Link className="w-3.5 h-3.5" />
        </Btn>

        {/* Image */}
        <Btn
          onMouseDown={(e) => { e.preventDefault(); openDialog('image'); }}
          title="Sisipkan Gambar via URL"
          active={dialog === 'image'}
        >
          <Image className="w-3.5 h-3.5" />
        </Btn>

        {/* Video YouTube */}
        <Btn
          onMouseDown={(e) => { e.preventDefault(); openDialog('video'); }}
          title="Sisipkan Video YouTube"
          active={dialog === 'video'}
        >
          <Youtube className="w-3.5 h-3.5" />
        </Btn>

        {/* HR */}
        <Btn
          onMouseDown={(e) => {
            e.preventDefault();
            exec('insertHTML', '<hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;"/><p><br/></p>');
          }}
          title="Garis Pemisah"
        >
          <Minus className="w-3.5 h-3.5" />
        </Btn>

        {/* ── Color group ── */}
        <Sep />

        <label
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-100 cursor-pointer relative"
          title="Warna Teks"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
        >
          <span className="text-xs font-bold text-zinc-700 underline decoration-[#800016]">A</span>
          <input
            type="color"
            className="sr-only"
            onChange={(e) => { restoreSelection(); exec('foreColor', e.target.value); }}
          />
        </label>

        <label
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-100 cursor-pointer"
          title="Sorot Teks"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
        >
          <span className="text-xs font-bold bg-yellow-200 px-0.5 rounded">ab</span>
          <input
            type="color"
            className="sr-only"
            defaultValue="#fef08a"
            onChange={(e) => { restoreSelection(); exec('hiliteColor', e.target.value); }}
          />
        </label>

        {/* ── Clear ── */}
        <Sep />
        <Btn
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
          title="Hapus Format"
          danger
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </Btn>
      </div>

      {/* ── Inline Dialog ── */}
      {dialog && (
        <InlineDialog
          type={dialog}
          onClose={() => setDialog(null)}
          onInsert={handleInsert}
        />
      )}

      {/* ── Editable Area ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onKeyDown={(e) => {
          // Close dialog on Escape
          if (e.key === 'Escape') setDialog(null);
          // Ctrl+K = quick link
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openDialog('link');
          }
        }}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="
          px-5 py-4 text-sm text-zinc-900 leading-relaxed outline-none overflow-y-auto
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zinc-950 [&_h1]:my-4
          [&_h2]:text-xl  [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:my-3
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-800 [&_h3]:my-2
          [&_p]:mb-3 [&_p]:leading-relaxed
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#800016] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600 [&_blockquote]:my-4 [&_blockquote]:bg-rose-50/40 [&_blockquote]:py-2 [&_blockquote]:rounded-r
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_a]:text-[#800016] [&_a]:underline [&_a]:cursor-pointer
          [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:text-xs [&_pre]:font-mono [&_pre]:my-3 [&_pre]:overflow-x-auto
          [&_hr]:border-zinc-200 [&_hr]:my-4
          [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3 [&_img]:shadow-sm
          [&_figure]:my-4 [&_figure]:text-center
          [&_iframe]:rounded-lg
          empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-300 empty:before:pointer-events-none
        "
      />

      {/* ── Footer bar ── */}
      <div className="px-4 py-1.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span className="flex items-center gap-3">
          <span>Ctrl+B Bold · Ctrl+I Italic · Ctrl+K Tautan</span>
        </span>
        <span>{wordCount} kata</span>
      </div>
    </div>
  );
};
