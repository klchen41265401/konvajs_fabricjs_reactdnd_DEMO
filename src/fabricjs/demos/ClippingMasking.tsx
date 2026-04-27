import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';
import useFileSource from '../../components/useFileSource';

const SAMPLE = 'https://picsum.photos/id/1018/700/500';
type Shape = 'circle' | 'rect' | 'triangle' | 'star';

export default function ClippingMasking() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<fabric.Image | null>(null);
  const [shape, setShape] = useState<Shape>('circle');
  const [inverted, setInverted] = useState(false);
  const [absolute, setAbsolute] = useState(false);
  const { src, FileInput } = useFileSource(SAMPLE, 'image/*');

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
      img.set({ left: 20, top: 20, selectable: true });
      imgRef.current = img;
      canvas.add(img);
      applyClip(shape, inverted, absolute);
      canvas.requestRenderAll();
    }, { crossOrigin: 'anonymous' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const makeShape = (s: Shape): fabric.Object => {
    if (s === 'circle') return new fabric.Circle({ radius: 140, originX: 'center', originY: 'center' });
    if (s === 'rect') return new fabric.Rect({ width: 300, height: 220, originX: 'center', originY: 'center' });
    if (s === 'triangle') return new fabric.Triangle({ width: 300, height: 260, originX: 'center', originY: 'center' });
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 140 : 60;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    return new fabric.Polygon(pts, { originX: 'center', originY: 'center' });
  };

  const applyClip = (s: Shape, inv: boolean, abs: boolean) => {
    const canvas = fabRef.current!;
    const img = imgRef.current;
    if (!img) return;
    const clip = makeShape(s);
    (clip as any).inverted = inv;
    (clip as any).absolutePositioned = abs;
    if (abs) { clip.left = canvas.getWidth() / 2; clip.top = canvas.getHeight() / 2; }
    img.clipPath = clip;
    canvas.requestRenderAll();
  };

  useEffect(() => { applyClip(shape, inverted, absolute); }, [shape, inverted, absolute]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Clipping and masking" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>來源圖片</h3>
        <FileInput label="圖片" />
        <h3>遮罩形狀</h3>
        <div className="control-group">
          {(['circle', 'rect', 'triangle', 'star'] as Shape[]).map(s => (
            <button type="button" key={s} className={shape === s ? 'active' : ''} onClick={() => setShape(s)}>{s}</button>
          ))}
        </div>
        <h3>模式</h3>
        <div className="control-group">
          <label><input type="checkbox" checked={inverted} onChange={e => setInverted(e.target.checked)} /> Inverted</label>
          <label><input type="checkbox" checked={absolute} onChange={e => setAbsolute(e.target.checked)} /> Absolute positioned</label>
        </div>
        <div className="info-box">使用 <strong>clipPath</strong> 設定物件裁切形狀。拖曳物件觀察 absolute 差異。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
