import { useRef, useState } from 'react';
import { Layer, Group, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function RelativePointerPosition() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const groupRef = useRef<Konva.Group | null>(null);
  const [rawPos, setRawPos] = useState({ x: 0, y: 0 });
  const [relPos, setRelPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0 });

  const handleMove = () => {
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    setRawPos({ x: Math.round(pointer.x), y: Math.round(pointer.y) });
    const rel = group.getRelativePointerPosition();
    if (rel) setRelPos({ x: Math.round(rel.x), y: Math.round(rel.y) });
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;
    const oldScale = group.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - group.x()) / oldScale,
      y: (pointer.y - group.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.2, Math.min(4, oldScale * (1 + direction * 0.1)));
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    group.scale({ x: newScale, y: newScale });
    group.position(newPos);
    setScale(newScale);
    setGroupPos({ x: Math.round(newPos.x), y: Math.round(newPos.y) });
  };

  return (
    <DemoLayout title="🎯 Relative Pointer Position" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <div>Raw 滑鼠: ({rawPos.x}, {rawPos.y})</div>
          <div>相對群組: ({relPos.x}, {relPos.y})</div>
          <div>群組縮放: {scale.toFixed(2)}x</div>
          <div>群組位置: ({groupPos.x}, {groupPos.y})</div>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => {
            const g = groupRef.current;
            if (!g) return;
            g.position({ x: 0, y: 0 });
            g.scale({ x: 1, y: 1 });
            setScale(1); setGroupPos({ x: 0, y: 0 });
          }}>重置視角</button>
        </div>
        <div className="info-box">滾輪可縮放、拖曳群組可平移。使用 node.getRelativePointerPosition() 可以得到滑鼠在群組本地座標系下的位置，考慮了縮放與平移。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={480} onMouseMove={handleMove} onWheel={handleWheel}>
          <Layer>
            <Rect x={0} y={0} width={720} height={480} fill="#f3f4f6" />
          </Layer>
          <Layer>
            <Group ref={groupRef} draggable onDragMove={() => {
              const g = groupRef.current; if (!g) return;
              setGroupPos({ x: Math.round(g.x()), y: Math.round(g.y()) });
            }}>
              <Rect x={100} y={100} width={180} height={120} fill="#3b82f6" />
              <Circle x={380} y={200} radius={60} fill="#f59e0b" />
              <Rect x={480} y={260} width={140} height={100} fill="#10b981" />
              <Text x={100} y={20} text="可以拖曳與滾輪縮放此群組" fontSize={16} fill="#111827" />
            </Group>
          </Layer>
          <Layer listening={false}>
            <Text x={20} y={20} text={`Raw: ${rawPos.x}, ${rawPos.y}`} fontSize={14} fill="#111827" />
            <Text x={20} y={40} text={`Rel: ${relPos.x}, ${relPos.y}`} fontSize={14} fill="#b91c1c" />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
