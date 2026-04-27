import { useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

export default function QuantumSquiggle() {
  const [lines, setLines] = useState(20);
  const [amplitude, setAmplitude] = useState(40);
  const [speed, setSpeed] = useState(2);
  const [fps, setFps] = useState(0);
  const layerRef = useRef<Konva.Layer | null>(null);
  const ampRef = useRef(amplitude);
  const speedRef = useRef(speed);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (!layerRef.current) return;
    const layer = layerRef.current;
    let lastTime = performance.now();
    let frames = 0;
    let acc = 0;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const time = frame.time / 1000;
      const children = layer.getChildren((n) => n.getClassName() === 'Line');
      for (let i = 0; i < children.length; i++) {
        const line = children[i] as Konva.Line;
        const phase = (i / children.length) * Math.PI * 2 + time * speedRef.current;
        const pts: number[] = [];
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * W;
          const y = H / 2 + Math.sin(s * 0.2 + phase) * ampRef.current + (i - children.length / 2) * 6;
          pts.push(x, y);
        }
        line.points(pts);
      }
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      acc += delta;
      frames++;
      if (acc >= 500) {
        setFps(Math.round((frames * 1000) / acc));
        frames = 0;
        acc = 0;
      }
    }, layer);
    anim.start();
    return () => { anim.stop(); };
  }, [lines]);

  const colors: string[] = [];
  for (let i = 0; i < lines; i++) {
    const hue = (i / lines) * 360;
    colors.push(`hsl(${hue}, 80%, 60%)`);
  }

  return (
    <DemoLayout title="🖼️ Quantum Squiggle" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>線條數: {lines}</label>
          <input type="range" min="5" max="80" step="1" value={lines} onChange={e => setLines(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>振幅: {amplitude}</label>
          <input type="range" min="5" max="100" step="1" value={amplitude} onChange={e => setAmplitude(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>速度: {speed.toFixed(1)}</label>
          <input type="range" min="0.1" max="6" step="0.1" value={speed} onChange={e => setSpeed(+e.target.value)} />
        </div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">多條正弦波 Line 相位差疊加形成「量子抖動」效果，示範 Konva.Animation 動態重算 points。</div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#020617" />
          </Layer>
          <Layer ref={layerRef} listening={false}>
            {Array.from({ length: lines }).map((_, i) => (
              <Line key={i} points={[0, H / 2, W, H / 2]} stroke={colors[i]} strokeWidth={1.5} tension={0.3} opacity={0.7} perfectDrawEnabled={false} />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
