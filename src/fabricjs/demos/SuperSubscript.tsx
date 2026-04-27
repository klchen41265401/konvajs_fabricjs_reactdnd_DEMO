import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function SuperSubscript() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    canvas.add(new fabric.IText('E = mc² 以及 H₂O 與 x³ + y² = z²', {
      left: 60, top: 120, fontSize: 44, fill: '#0f172a'
    }));
    return () => { canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 360);

  const doSuper = () => {
    const t = fabRef.current!.getActiveObject() as fabric.IText;
    if (t && (t as any).setSuperscript) (t as any).setSuperscript(t.selectionStart, t.selectionEnd);
    fabRef.current!.requestRenderAll();
  };
  const doSub = () => {
    const t = fabRef.current!.getActiveObject() as fabric.IText;
    if (t && (t as any).setSubscript) (t as any).setSubscript(t.selectionStart, t.selectionEnd);
    fabRef.current!.requestRenderAll();
  };

  return (
    <DemoLayout title="🎨 Superscript & Subscript" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>操作</h3>
        <div className="info-box">雙擊文字進入編輯，選取要變更的區段，再按鈕套用。</div>
        <div className="control-group">
          <button type="button" onClick={doSuper}>上標 x²</button>
          <button type="button" onClick={doSub}>下標 H₂O</button>
        </div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={360} /></div>
    </DemoLayout>
  );
}
