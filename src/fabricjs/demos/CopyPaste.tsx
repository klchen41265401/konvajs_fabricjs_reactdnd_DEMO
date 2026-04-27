import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function CopyPaste() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const clipboardRef = useRef<fabric.Object | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    canvas.add(new fabric.Rect({ left: 60, top: 60, width: 120, height: 90, fill: '#f59e0b' }));
    canvas.add(new fabric.Circle({ left: 220, top: 80, radius: 45, fill: '#38bdf8' }));
    canvas.add(new fabric.Textbox('Hello Fabric', { left: 60, top: 220, width: 220, fontSize: 26, fill: '#0f172a' }));

    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') { copy(); e.preventDefault(); }
        else if (e.key === 'v') { paste(); e.preventDefault(); }
        else if (e.key === 'x') { copy(); del(); e.preventDefault(); }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) { del(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  const copy = () => {
    const canvas = fabRef.current!;
    const active = canvas.getActiveObject();
    if (!active) return;
    (active as any).clone((c: fabric.Object) => (clipboardRef.current = c));
  };
  const paste = () => {
    const canvas = fabRef.current!;
    const clip = clipboardRef.current;
    if (!clip) return;
    (clip as any).clone((c: fabric.Object) => {
      canvas.discardActiveObject();
      c.set({ left: (clip.left || 0) + 20, top: (clip.top || 0) + 20, evented: true });
      if (c.type === 'activeSelection') {
        (c as any).canvas = canvas;
        (c as fabric.ActiveSelection).forEachObject(o => canvas.add(o));
        (c as any).setCoords();
      } else {
        canvas.add(c);
      }
      clip.set({ top: (clip.top || 0) + 20, left: (clip.left || 0) + 20 });
      canvas.setActiveObject(c);
      canvas.requestRenderAll();
    });
  };
  const del = () => {
    const canvas = fabRef.current!;
    canvas.getActiveObjects().forEach(o => canvas.remove(o));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };
  const addRect = () => fabRef.current!.add(new fabric.Rect({ left: 100 + Math.random() * 200, top: 100 + Math.random() * 200, width: 90, height: 70, fill: '#a78bfa' }));
  const addCircle = () => fabRef.current!.add(new fabric.Circle({ left: 100 + Math.random() * 200, top: 100 + Math.random() * 200, radius: 40, fill: '#4ade80' }));
  const addText = () => fabRef.current!.add(new fabric.Textbox('文字', { left: 100 + Math.random() * 200, top: 100 + Math.random() * 200, width: 180, fontSize: 24, fill: '#111827' }));

  return (
    <DemoLayout title="🎨 Copy and paste" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>操作</h3>
        <div className="control-group">
          <button type="button" onClick={copy}>Copy (Ctrl+C)</button>
          <button type="button" onClick={paste}>Paste (Ctrl+V)</button>
          <button type="button" onClick={() => { copy(); del(); }}>Cut (Ctrl+X)</button>
          <button type="button" onClick={del}>Delete</button>
        </div>
        <h3>新增</h3>
        <div className="control-group">
          <button type="button" onClick={addRect}>加矩形</button>
          <button type="button" onClick={addCircle}>加圓</button>
          <button type="button" onClick={addText}>加文字</button>
        </div>
        <div className="info-box">選物件後複製貼上，支援多選與鍵盤快捷鍵。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
