import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Group, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function ScrollByEdgeDrag() {
  const VIEW_W = 720;
  const VIEW_H = 540;
  const SCENE_W = 2400;
  const SCENE_H = 1800;

  const stageRef = useRef<Konva.Stage | null>(null);
  const groupRef = useRef<Konva.Group | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const animRef = useRef<Konva.Animation | null>(null);

  const [enabled, setEnabled] = useState(true);
  const [edge, setEdge] = useState(50);
  const [speed, setSpeed] = useState(5);

  const enabledRef = useRef(enabled);
  const edgeRef = useRef(edge);
  const speedRef = useRef(speed);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { edgeRef.current = edge; }, [edge]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const anim = new Konva.Animation(() => {
      if (!enabledRef.current) return false;
      if (!draggingRef.current || !pointerRef.current || !groupRef.current) return false;
      const { x, y } = pointerRef.current;
      const e = edgeRef.current;
      const s = speedRef.current;
      let dx = 0, dy = 0;
      if (x < e) dx = s;
      else if (x > VIEW_W - e) dx = -s;
      if (y < e) dy = s;
      else if (y > VIEW_H - e) dy = -s;
      if (dx === 0 && dy === 0) return false;
      const g = groupRef.current;
      const nx = Math.min(0, Math.max(VIEW_W - SCENE_W, g.x() + dx));
      const ny = Math.min(0, Math.max(VIEW_H - SCENE_H, g.y() + dy));
      g.position({ x: nx, y: ny });
      return true;
    }, groupRef.current?.getLayer());
    animRef.current = anim;
    return () => { anim.stop(); };
  }, []);

  const shapes = Array.from({ length: 80 }, (_, i) => ({
    x: Math.random() * (SCENE_W - 80),
    y: Math.random() * (SCENE_H - 80),
    w: 60 + Math.random() * 80,
    h: 60 + Math.random() * 80,
    fill: `hsl(${(i * 23) % 360},70%,65%)`,
  }));

  return (
    <DemoLayout title="🖱️ Scroll By Edge Drag" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> 啟用邊緣捲動</label>
        </div>
        <div className="control-group"><label>邊緣寬度: {edge}px</label><input type="range" min="10" max="150" value={edge} onChange={e => setEdge(+e.target.value)} /></div>
        <div className="control-group"><label>捲動速度: {speed}</label><input type="range" min="1" max="20" value={speed} onChange={e => setSpeed(+e.target.value)} /></div>
        <div className="info-box">拖曳時若指標靠近舞台邊緣 (預設 50px)，會以 Konva.Animation 持續平移整個場景 Group，模擬自動捲動攝影機。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage
          ref={stageRef}
          designWidth={VIEW_W}
          designHeight={VIEW_H}
          onMouseDown={() => { draggingRef.current = true; animRef.current?.start(); }}
          onMouseUp={() => { draggingRef.current = false; }}
          onMouseLeave={() => { draggingRef.current = false; }}
          onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage();
            const p = stage?.getPointerPosition();
            if (p && stage) pointerRef.current = { x: p.x / stage.scaleX(), y: p.y / stage.scaleY() };
            if (draggingRef.current) animRef.current?.start();
          }}
        >
          <Layer>
            <Rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f4f4f4" />
            <Group ref={groupRef} x={0} y={0}>
              <Rect x={0} y={0} width={SCENE_W} height={SCENE_H} fill="#fff" stroke="#bbb" />
              {shapes.map((s, i) => (
                <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} cornerRadius={6} />
              ))}
              <Text x={20} y={20} text="Scene top-left" fontSize={24} fill="#333" />
              <Text x={SCENE_W - 260} y={SCENE_H - 40} text="Scene bottom-right" fontSize={24} fill="#333" />
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
