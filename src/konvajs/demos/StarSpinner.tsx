import { useEffect, useRef, useState } from 'react';
import { Layer, Star, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

export default function StarSpinner() {
  const [speed, setSpeed] = useState(90);
  const [playing, setPlaying] = useState(true);
  const [color, setColor] = useState('#f59e0b');
  const starRef = useRef<Konva.Star | null>(null);
  const speedRef = useRef(speed);
  const playingRef = useRef(playing);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    if (!starRef.current) return;
    const layer = starRef.current.getLayer();
    if (!layer) return;
    const anim = new Konva.Animation((frame) => {
      if (!frame || !playingRef.current || !starRef.current) return;
      const dt = frame.timeDiff / 1000;
      starRef.current.rotation(starRef.current.rotation() + speedRef.current * dt);
    }, layer);
    anim.start();
    return () => { anim.stop(); };
  }, []);

  return (
    <DemoLayout title="🖼️ Star Spinner" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>旋轉速度 (度/秒): {speed}</label>
          <input type="range" min="0" max="720" step="10" value={speed} onChange={e => setSpeed(+e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={() => setPlaying(p => !p)}>{playing ? '暫停' : '播放'}</button>
        </div>
        <div className="control-group">
          <label>顏色</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="info-box">使用 <code>Konva.Animation</code> 以 <code>timeDiff</code> 做 framerate-independent 的等速旋轉。</div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#0f172a" />
          </Layer>
          <Layer>
            <Star
              ref={starRef}
              x={W / 2}
              y={H / 2}
              numPoints={5}
              innerRadius={60}
              outerRadius={140}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
              shadowBlur={30}
              shadowColor={color}
            />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
