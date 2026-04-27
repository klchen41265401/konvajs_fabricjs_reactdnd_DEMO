import { useRef, useState } from 'react';
import { Layer, Rect, Circle, Text, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const SCALE_BY = 1.1;

export default function ZoomRelativeToPointer() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    // Convert raw pointer (in ResponsiveStage-scaled coords) to design-space pointer
    const baseScale = stage.scaleX() / oldScale || 1;
    const designPointer = { x: pointer.x / baseScale, y: pointer.y / baseScale };
    const mousePointTo = {
      x: (designPointer.x - pos.x) / oldScale,
      y: (designPointer.y - pos.y) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.1, Math.min(10, direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY));
    const newPos = {
      x: designPointer.x - mousePointTo.x * newScale,
      y: designPointer.y - mousePointTo.y * newScale,
    };
    setScale(newScale);
    setPos(newPos);
  };

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  return (
    <DemoLayout title="🔍 Zoom Relative to Pointer" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <div>縮放倍率: {scale.toFixed(2)}x</div>
          <div>舞台位置: ({pos.x.toFixed(0)}, {pos.y.toFixed(0)})</div>
        </div>
        <div className="control-group">
          <button type="button" onClick={reset}>重置縮放</button>
        </div>
        <div className="info-box">滾輪在畫布上縮放時，指標下方的內容會保持靜止，產生「以滑鼠為中心縮放」的自然效果。公式：newPos = pointer − mousePointTo × newScale。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={480} onWheel={handleWheel}>
          <Layer x={pos.x} y={pos.y} scaleX={scale} scaleY={scale} draggable onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
            setPos({ x: e.target.x(), y: e.target.y() });
          }}>
            <Rect x={0} y={0} width={720} height={480} fill="#f3f4f6" />
            {Array.from({ length: 10 }).map((_, i) => (
              <Line key={`h${i}`} points={[0, i * 48, 720, i * 48]} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <Line key={`v${i}`} points={[i * 48, 0, i * 48, 480]} stroke="#e5e7eb" strokeWidth={1} />
            ))}
            <Rect x={100} y={100} width={160} height={100} fill="#3b82f6" />
            <Circle x={420} y={200} radius={70} fill="#f59e0b" />
            <Rect x={500} y={300} width={140} height={100} fill="#10b981" />
            <Text x={120} y={140} text="Scroll to Zoom" fontSize={20} fill="white" />
            <Text x={360} y={190} text="Drag to Pan" fontSize={18} fill="#111827" />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
