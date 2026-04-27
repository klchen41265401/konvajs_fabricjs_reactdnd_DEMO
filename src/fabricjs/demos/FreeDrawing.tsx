import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

type BrushKind = 'Pencil' | 'Circle' | 'Spray' | 'Pattern';

export default function FreeDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [brush, setBrush] = useState<BrushKind>('Pencil');
  const [color, setColor] = useState('#0ea5e9');
  const [width, setWidth] = useState(6);
  const [shadowOn, setShadowOn] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, { isDrawingMode: true });
    fabRef.current = canvas;
    return () => { canvas.dispose(); };
  }, []);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    let b: fabric.BaseBrush;
    if (brush === 'Pencil') b = new fabric.PencilBrush(canvas);
    else if (brush === 'Circle') b = new (fabric as any).CircleBrush(canvas);
    else if (brush === 'Spray') b = new (fabric as any).SprayBrush(canvas);
    else b = new (fabric as any).PatternBrush(canvas);
    b.color = color;
    b.width = width;
    if (shadowOn) b.shadow = new fabric.Shadow({ blur: 18, offsetX: 0, offsetY: 0, color, affectStroke: true });
    else b.shadow = null as any;
    canvas.freeDrawingBrush = b;
  }, [brush, color, width, shadowOn]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Free drawing" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>筆刷</h3>
        <div className="control-group">
          {(['Pencil', 'Circle', 'Spray', 'Pattern'] as BrushKind[]).map(b => (
            <button type="button" key={b} className={brush === b ? 'active' : ''} onClick={() => setBrush(b)}>{b}</button>
          ))}
        </div>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><label>粗細: {width}</label><input type="range" min="1" max="60" value={width} onChange={e => setWidth(+e.target.value)} /></div>
        <div className="control-group"><label><input type="checkbox" checked={shadowOn} onChange={e => setShadowOn(e.target.checked)} /> 發光 Shadow</label></div>
        <div className="control-group">
          <button type="button" onClick={() => fabRef.current?.clear()}>清除</button>
          <button type="button" onClick={() => { const d = fabRef.current?.toDataURL({ format: 'png' }); if (d) { const a = document.createElement('a'); a.href = d; a.download = 'drawing.png'; a.click(); } }}>匯出 PNG</button>
        </div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
