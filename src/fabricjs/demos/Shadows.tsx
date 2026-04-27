import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function Shadows() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const objRef = useRef<fabric.Object | null>(null);
  const [color, setColor] = useState('#000000');
  const [blur, setBlur] = useState(20);
  const [ox, setOx] = useState(10);
  const [oy, setOy] = useState(10);
  const [affectStroke, setAffectStroke] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const t = new fabric.Textbox('Shadows', { left: 100, top: 80, width: 520, fontSize: 96, fontWeight: 'bold', fill: '#f59e0b', stroke: '#111827', strokeWidth: 2 });
    const r = new fabric.Rect({ left: 120, top: 280, width: 200, height: 140, fill: '#38bdf8' });
    const c = new fabric.Circle({ left: 420, top: 300, radius: 70, fill: '#a78bfa' });
    canvas.add(t, r, c);
    canvas.setActiveObject(t);
    objRef.current = t;
    return () => { canvas.dispose(); };
  }, []);

  useEffect(() => {
    const canvas = fabRef.current!;
    const active = canvas.getActiveObject() || objRef.current;
    if (!active) return;
    active.set('shadow', new fabric.Shadow({ color, blur, offsetX: ox, offsetY: oy, affectStroke }));
    canvas.requestRenderAll();
  }, [color, blur, ox, oy, affectStroke]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Shadows" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <div className="info-box">先點選一個物件，再調整數值。</div>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><label>模糊: {blur}</label><input type="range" min="0" max="80" value={blur} onChange={e => setBlur(+e.target.value)} /></div>
        <div className="control-group"><label>offsetX: {ox}</label><input type="range" min="-40" max="40" value={ox} onChange={e => setOx(+e.target.value)} /></div>
        <div className="control-group"><label>offsetY: {oy}</label><input type="range" min="-40" max="40" value={oy} onChange={e => setOy(+e.target.value)} /></div>
        <div className="control-group"><label><input type="checkbox" checked={affectStroke} onChange={e => setAffectStroke(e.target.checked)} /> affectStroke</label></div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
