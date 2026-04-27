import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function StrokeUniform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [uniform, setUniform] = useState(true);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    canvas.add(
      new fabric.Rect({ left: 60, top: 80, width: 200, height: 120, fill: '#fde68a', stroke: '#b45309', strokeWidth: 6, strokeUniform: uniform }),
      new fabric.Circle({ left: 320, top: 80, radius: 70, fill: '#bae6fd', stroke: '#1e40af', strokeWidth: 6, strokeUniform: uniform }),
      new fabric.Triangle({ left: 500, top: 80, width: 160, height: 140, fill: '#bbf7d0', stroke: '#166534', strokeWidth: 6, strokeUniform: uniform })
    );
    return () => { canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    canvas.getObjects().forEach(o => { o.set('strokeUniform', uniform); });
    canvas.requestRenderAll();
  }, [uniform]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Stroke uniform" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>strokeUniform</h3>
        <div className="control-group"><label><input type="checkbox" checked={uniform} onChange={e => setUniform(e.target.checked)} /> 啟用</label></div>
        <div className="info-box">打開後縮放物件時邊框粗細不變；關掉則隨縮放變形。請選取物件拖四角觀察。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
