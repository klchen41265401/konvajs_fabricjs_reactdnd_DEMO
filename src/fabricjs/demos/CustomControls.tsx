import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function CustomControls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;

    const renderIcon = (icon: string) => function (ctx: CanvasRenderingContext2D, left: number, top: number, _: any, obj: fabric.Object) {
      const size = 26;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(obj.angle || 0));
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, 0, 1);
      ctx.restore();
    };

    const deleteObject: fabric.Control['mouseUpHandler'] = (_e, t) => {
      const target = (t as any).target as fabric.Object;
      target.canvas?.remove(target);
      target.canvas?.requestRenderAll();
      return true;
    };
    const cloneObject: fabric.Control['mouseUpHandler'] = (_e, t) => {
      const target = (t as any).target as fabric.Object;
      (target as any).clone((c: fabric.Object) => {
        c.set({ left: (target.left || 0) + 20, top: (target.top || 0) + 20, evented: true });
        target.canvas?.add(c);
        target.canvas?.setActiveObject(c);
      });
      return true;
    };

    (fabric.Object.prototype.controls as any).deleteControl = new fabric.Control({
      x: 0.5, y: -0.5, offsetY: -24, offsetX: 24,
      cursorStyle: 'pointer', mouseUpHandler: deleteObject,
      render: renderIcon('✕'), sizeX: 28, sizeY: 28
    });
    (fabric.Object.prototype.controls as any).cloneControl = new fabric.Control({
      x: -0.5, y: -0.5, offsetY: -24, offsetX: -24,
      cursorStyle: 'pointer', mouseUpHandler: cloneObject,
      render: renderIcon('⧉'), sizeX: 28, sizeY: 28
    });

    canvas.add(
      new fabric.Rect({ left: 120, top: 120, width: 180, height: 130, fill: '#a78bfa' }),
      new fabric.Circle({ left: 380, top: 160, radius: 60, fill: '#4ade80' }),
      new fabric.Textbox('Custom controls', { left: 120, top: 320, width: 240, fontSize: 24, fill: '#111827' })
    );

    return () => {
      delete (fabric.Object.prototype.controls as any).deleteControl;
      delete (fabric.Object.prototype.controls as any).cloneControl;
      canvas.dispose();
    };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Custom controls" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>說明</h3>
        <div className="info-box">選取物件後，外框角落有自訂的 <strong>✕刪除</strong> 與 <strong>⧉複製</strong>。使用 <strong>fabric.Control</strong> 自訂 render 與 mouseUpHandler。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
