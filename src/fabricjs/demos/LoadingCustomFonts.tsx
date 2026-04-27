import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const FONTS = ['Pacifico', 'Bungee', 'Lobster', 'Press Start 2P', 'Playfair Display'];

async function ensureFont(family: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
  if (![...document.styleSheets].some(s => s.href === url)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = url;
    document.head.appendChild(link);
  }
  if ('fonts' in document) {
    try { await (document as any).fonts.load(`24px "${family}"`); } catch {}
  }
}

export default function LoadingCustomFonts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<fabric.Textbox | null>(null);
  const [font, setFont] = useState('Pacifico');
  const [content, setContent] = useState('Hello Fabric!\nCustom fonts');
  const [size, setSize] = useState(56);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const t = new fabric.Textbox(content, { left: 60, top: 80, width: 560, fontSize: size, fontFamily: font, fill: '#0f172a' });
    textRef.current = t;
    canvas.add(t);
    return () => { canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      await ensureFont(font);
      const t = textRef.current; if (!t) return;
      t.set({ fontFamily: font, text: content, fontSize: size });
      fabRef.current?.requestRenderAll();
    })();
  }, [font, content, size]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Loading custom fonts" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>字型 (Google Fonts)</h3>
        <div className="control-group">
          {FONTS.map(f => (
            <button type="button" key={f} className={font === f ? 'active' : ''} onClick={() => setFont(f)} style={{ fontFamily: f }}>{f}</button>
          ))}
        </div>
        <div className="control-group">
          <label>大小: {size}</label>
          <input type="range" min="16" max="120" value={size} onChange={e => setSize(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>文字內容</label>
          <textarea rows={3} value={content} onChange={e => setContent(e.target.value)} />
        </div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
