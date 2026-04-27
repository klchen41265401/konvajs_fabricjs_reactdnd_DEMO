import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';
import useFileSource from '../../components/useFileSource';

export default function RealtimeLanczos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<fabric.Image | null>(null);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<'lanczos' | 'bilinear' | 'hermite'>('lanczos');
  const { src, FileInput } = useFileSource('https://picsum.photos/id/1011/800/560', 'image/*');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    return () => { canvas.dispose(); };
  }, []);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    canvas.getObjects().filter(o => o.type === 'image').forEach(o => canvas.remove(o));
    imgRef.current = null;
    fabric.Image.fromURL(src, img => {
      img.set({ left: 20, top: 20, selectable: false });
      imgRef.current = img;
      canvas.add(img);
      apply(scale, mode);
      canvas.requestRenderAll();
    }, { crossOrigin: 'anonymous' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const apply = (s: number, m: string) => {
    const img = imgRef.current; if (!img) return;
    const Resize: any = fabric.Image.filters.Resize;
    const f = new Resize({ scaleX: s, scaleY: s, resizeType: m, lanczosLobes: 3 });
    img.filters = [f];
    img.applyFilters();
    fabRef.current?.requestRenderAll();
  };
  useEffect(() => { apply(scale, mode); }, [scale, mode]);

  useFabricResponsive(wrapperRef, fabRef, 860, 600);

  return (
    <DemoLayout title="🎨 Realtime Lanczos resize" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>來源圖片</h3>
        <FileInput />
        <h3>縮放演算法</h3>
        <div className="control-group">
          {(['lanczos', 'bilinear', 'hermite'] as const).map(m => (
            <button type="button" key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className="control-group">
          <label>Scale: {scale.toFixed(2)}</label>
          <input type="range" min="0.1" max="2" step="0.05" value={scale} onChange={e => setScale(+e.target.value)} />
        </div>
        <div className="info-box">Fabric 的 <strong>Resize filter</strong> 支援三種 resize 模式。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={860} height={600} /></div>
    </DemoLayout>
  );
}
