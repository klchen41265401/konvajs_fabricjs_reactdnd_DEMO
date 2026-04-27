import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Dancer {
  id: number;
  type: 'rect' | 'circle';
  baseAngle: number;
  radius: number;
  color: string;
  size: number;
}

export default function ShapeTango() {
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const layerRef = useRef<Konva.Layer>(null);
  const animRef = useRef<Konva.Animation | null>(null);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);

  const [dancers] = useState<Dancer[]>(() => {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3', '#54a0ff', '#ee5253'];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'rect' : 'circle',
      baseAngle: (i / 8) * Math.PI * 2,
      radius: 140 + (i % 3) * 25,
      color: colors[i % colors.length],
      size: 24 + (i % 3) * 6,
    }));
  });

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!layerRef.current) return;
    const cx = 360;
    const cy = 270;

    const anim = new Konva.Animation((frame) => {
      if (!frame || pausedRef.current) return;
      const t = (frame.time / 1000) * speedRef.current;
      const layer = layerRef.current;
      if (!layer) return;
      layer.children.forEach((node, i) => {
        const d = dancers[i];
        if (!d) return;
        const angle = d.baseAngle + t;
        const x = cx + Math.cos(angle) * d.radius;
        const y = cy + Math.sin(angle) * d.radius * 0.7;
        node.position({ x, y });
        node.rotation((angle * 180) / Math.PI);
      });
    }, layerRef.current);
    animRef.current = anim;
    anim.start();

    return () => {
      anim.stop();
    };
  }, [dancers]);

  return (
    <DemoLayout
      title="💃 Shape Tango"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>速度：{speed.toFixed(1)}x</label>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          <div className="control-group">
            <button type="button" onClick={() => setPaused((p) => !p)}>
              {paused ? '▶️ 繼續' : '⏸️ 暫停'}
            </button>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>使用 Konva.Animation 加上正弦/餘弦函數驅動形狀的圓周運動，所有形狀同步編舞。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer ref={layerRef}>
            {dancers.map((d) =>
              d.type === 'rect' ? (
                <Rect
                  key={d.id}
                  width={d.size}
                  height={d.size}
                  offsetX={d.size / 2}
                  offsetY={d.size / 2}
                  fill={d.color}
                  cornerRadius={4}
                />
              ) : (
                <Circle key={d.id} radius={d.size / 2} fill={d.color} />
              )
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
