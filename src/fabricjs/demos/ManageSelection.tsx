import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function ManageSelection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState('無選取');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    for (let i = 0; i < 8; i++) {
      canvas.add(new fabric.Rect({
        left: 40 + (i % 4) * 160, top: 40 + Math.floor(i / 4) * 160,
        width: 100, height: 80, fill: `hsl(${i * 45},70%,60%)`
      }));
    }
    const update = () => {
      const arr = canvas.getActiveObjects();
      setInfo(arr.length ? `選取 ${arr.length} 個` : '無選取');
    };
    canvas.on('selection:created', update);
    canvas.on('selection:updated', update);
    canvas.on('selection:cleared', update);
    return () => { canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  const selectAll = () => {
    const canvas = fabRef.current!;
    const sel = new fabric.ActiveSelection(canvas.getObjects(), { canvas });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  };
  const clearSel = () => { fabRef.current?.discardActiveObject(); fabRef.current?.requestRenderAll(); };
  const selectFirst = () => {
    const canvas = fabRef.current!;
    const first = canvas.getObjects()[0]; if (first) { canvas.setActiveObject(first); canvas.requestRenderAll(); }
  };
  const groupSelection = () => {
    const canvas = fabRef.current!;
    const active = canvas.getActiveObject();
    if (active && active.type === 'activeSelection') {
      (active as fabric.ActiveSelection).toGroup();
      canvas.requestRenderAll();
    }
  };
  const ungroup = () => {
    const canvas = fabRef.current!;
    const active = canvas.getActiveObject();
    if (active && active.type === 'group') {
      (active as fabric.Group).toActiveSelection();
      canvas.requestRenderAll();
    }
  };

  return (
    <DemoLayout title="🎨 Manage selection" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>程式化選取</h3>
        <div className="control-group">
          <button type="button" onClick={selectAll}>全選</button>
          <button type="button" onClick={selectFirst}>選第一個</button>
          <button type="button" onClick={clearSel}>清空</button>
        </div>
        <h3>群組</h3>
        <div className="control-group">
          <button type="button" onClick={groupSelection}>Group 選取</button>
          <button type="button" onClick={ungroup}>Ungroup</button>
        </div>
        <div className="info-box">目前：<strong>{info}</strong></div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
