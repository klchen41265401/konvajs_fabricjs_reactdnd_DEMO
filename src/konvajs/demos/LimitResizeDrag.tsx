import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const STAGE_W = 720;
const STAGE_H = 480;

export default function LimitResizeDrag() {
  const rectRef = useRef<Konva.Rect | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const [minSize, setMinSize] = useState(20);
  const [maxSize, setMaxSize] = useState(300);
  const [limitToStage, setLimitToStage] = useState(true);

  useEffect(() => {
    if (!rectRef.current || !trRef.current) return;
    trRef.current.nodes([rectRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, []);

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    if (!limitToStage || !rectRef.current) return pos;
    const node = rectRef.current;
    const w = node.width() * node.scaleX();
    const h = node.height() * node.scaleY();
    return {
      x: Math.max(0, Math.min(STAGE_W - w, pos.x)),
      y: Math.max(0, Math.min(STAGE_H - h, pos.y)),
    };
  };

  const boundBoxFunc = (oldBox: any, newBox: any) => {
    const nb = newBox as { x: number; y: number; width: number; height: number; rotation: number };
    if (nb.width < minSize || nb.height < minSize) return oldBox;
    if (nb.width > maxSize || nb.height > maxSize) return oldBox;
    if (limitToStage) {
      if (nb.x < 0 || nb.y < 0) return oldBox;
      if (nb.x + nb.width > STAGE_W) return oldBox;
      if (nb.y + nb.height > STAGE_H) return oldBox;
    }
    return newBox;
  };

  return (
    <DemoLayout title="📐 Limit Resize & Drag" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>最小尺寸: {minSize}px</label>
          <input type="range" min="10" max="100" value={minSize} onChange={e => setMinSize(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>最大尺寸: {maxSize}px</label>
          <input type="range" min="120" max="600" value={maxSize} onChange={e => setMaxSize(+e.target.value)} />
        </div>
        <div className="control-group">
          <label><input type="checkbox" checked={limitToStage} onChange={e => setLimitToStage(e.target.checked)} /> 限制在舞台內</label>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => {
            const n = rectRef.current; if (!n) return;
            n.position({ x: 200, y: 150 });
            n.size({ width: 160, height: 120 });
            n.scale({ x: 1, y: 1 });
            n.getLayer()?.batchDraw();
          }}>重置矩形</button>
        </div>
        <div className="info-box">使用 dragBoundFunc 限制拖曳不可超出舞台邊界；Transformer 的 boundBoxFunc 拒絕尺寸小於 min 或大於 max 的縮放結果，也能同步限制在舞台內。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={STAGE_W} designHeight={STAGE_H}>
          <Layer>
            <Rect x={0} y={0} width={STAGE_W} height={STAGE_H} fill="#f9fafb" />
            <Rect
              ref={rectRef}
              x={200}
              y={150}
              width={160}
              height={120}
              fill="#3b82f6"
              draggable
              dragBoundFunc={dragBoundFunc}
            />
            <Transformer
              ref={trRef}
              boundBoxFunc={boundBoxFunc}
              rotateEnabled={false}
            />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
