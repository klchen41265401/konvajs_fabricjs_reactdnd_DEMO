import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function PolygonControls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'move' | 'edit'>('move');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const pts = [
      { x: 100, y: 100 }, { x: 260, y: 40 }, { x: 420, y: 140 },
      { x: 360, y: 300 }, { x: 180, y: 320 }
    ];
    const poly = new fabric.Polygon(pts, { left: 120, top: 120, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 2, objectCaching: false, transparentCorners: false, cornerColor: '#f59e0b' });
    canvas.add(poly);
    return () => { canvas.dispose(); };
  }, []);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    const poly = canvas.getObjects().find(o => o.type === 'polygon') as any;
    if (!poly) return;
    if (mode === 'edit') {
      const last = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.hasBorders = false;
      poly.controls = poly.points.reduce((acc: any, _pt: any, idx: number) => {
        acc['p' + idx] = new fabric.Control({
          positionHandler(_dim: any, _fi: any, currentControl: any) {
            const pt = poly.points[currentControl.pointIndex];
            return fabric.util.transformPoint({
              x: pt.x - poly.pathOffset.x,
              y: pt.y - poly.pathOffset.y
            } as any, fabric.util.multiplyTransformMatrices(poly.canvas.viewportTransform, poly.calcTransformMatrix()));
          },
          actionHandler(_e: any, transformData: any, x: number, y: number) {
            const localPoint = poly.toLocalPoint(new fabric.Point(x, y), 'center', 'center');
            poly.points[transformData.pointIndex] = {
              x: localPoint.x + poly.pathOffset.x,
              y: localPoint.y + poly.pathOffset.y
            };
            return true;
          },
          actionName: 'modifyPolygon',
          pointIndex: idx
        } as any);
        return acc;
      }, {});
      void last;
    } else {
      poly.controls = fabric.Object.prototype.controls;
      poly.cornerStyle = 'rect';
      poly.hasBorders = true;
    }
    canvas.requestRenderAll();
  }, [mode]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Polygon controls" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>模式</h3>
        <div className="control-group">
          <button type="button" className={mode === 'move' ? 'active' : ''} onClick={() => setMode('move')}>移動/縮放</button>
          <button type="button" className={mode === 'edit' ? 'active' : ''} onClick={() => setMode('edit')}>編輯頂點</button>
        </div>
        <div className="info-box">編輯模式下每個頂點有獨立 <strong>fabric.Control</strong>，可直接拖曳。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
