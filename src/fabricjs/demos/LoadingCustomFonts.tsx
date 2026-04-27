import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';
import useFileSource from '../../components/useFileSource';

const FONTS = ['Pacifico', 'Bungee', 'Lobster', 'Press Start 2P', 'Playfair Display'];
const USER_FONT = 'UserFont';

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
  const [userFontReady, setUserFontReady] = useState(false);
  const { src, filename, FileInput } = useFileSource('', '.ttf,.otf,.woff,.woff2');

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
    if (!filename) return;
    const face = new (window as any).FontFace(USER_FONT, `url(${src})`);
    face.load().then((loaded: any) => {
      (document as any).fonts.add(loaded);
      setUserFontReady(true);
      setFont(USER_FONT);
    }).catch((err: any) => {
      console.warn('font load failed', err);
      alert(`字型載入失敗: ${err.message ?? err}`);
    });
  }, [src, filename]);

  useEffect(() => {
    (async () => {
      if (font !== USER_FONT) await ensureFont(font);
      const t = textRef.current; if (!t) return;
      t.set({ fontFamily: font, text: content, fontSize: size });
      fabRef.current?.requestRenderAll();
    })();
  }, [font, content, size, userFontReady]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Loading custom fonts" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <FileInput label="上傳字型檔" />
        <h3>字型 (Google Fonts)</h3>
        <div className="control-group">
          {FONTS.map(f => (
            <button type="button" key={f} className={font === f ? 'active' : ''} onClick={() => setFont(f)} style={{ fontFamily: f }}>{f}</button>
          ))}
          {userFontReady && (
            <button type="button" key={USER_FONT} className={font === USER_FONT ? 'active' : ''} onClick={() => setFont(USER_FONT)} style={{ fontFamily: USER_FONT }}>📤 User Font</button>
          )}
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
