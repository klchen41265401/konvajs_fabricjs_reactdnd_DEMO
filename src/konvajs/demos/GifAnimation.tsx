import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Sprite } from 'react-konva';
import type Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

function buildSpriteSheet(): HTMLImageElement {
  const FRAME = 64;
  const COUNT = 4;
  const canvas = document.createElement('canvas');
  canvas.width = FRAME * COUNT;
  canvas.height = FRAME;
  const ctx = canvas.getContext('2d')!;
  const colors = ['#ef5350', '#ab47bc', '#42a5f5', '#66bb6a'];
  for (let i = 0; i < COUNT; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(i * FRAME, 0, FRAME, FRAME);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const r = 10 + i * 6;
    ctx.arc(i * FRAME + FRAME / 2, FRAME / 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), i * FRAME + FRAME / 2, FRAME / 2 + 5);
  }
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

export default function GifAnimation() {
  const spriteRef = useRef<Konva.Sprite | null>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);
  const [frameRate, setFrameRate] = useState(6);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const sheet = useMemo(() => buildSpriteSheet(), []);

  useEffect(() => {
    const onLoad = () => { imageRef.current = sheet; setReady(true); };
    if (sheet.complete) onLoad();
    else sheet.addEventListener('load', onLoad);
    return () => sheet.removeEventListener('load', onLoad);
  }, [sheet]);

  useEffect(() => {
    const s = spriteRef.current;
    if (!s) return;
    if (running) s.start(); else s.stop();
  }, [running, ready]);

  useEffect(() => {
    const s = spriteRef.current;
    if (!s) return;
    s.frameRate(frameRate);
  }, [frameRate]);

  const animations = {
    idle: [0, 0, 64, 64, 64, 0, 64, 64, 128, 0, 64, 64, 192, 0, 64, 64],
  };

  return (
    <DemoLayout title="🎞️ GIF / Sprite Animation" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <button type="button" onClick={() => setRunning(r => !r)}>{running ? '⏸️ 暫停' : '▶️ 播放'}</button>
        </div>
        <div className="control-group"><label>FrameRate: {frameRate}</label><input type="range" min="1" max="24" value={frameRate} onChange={e => setFrameRate(+e.target.value)} /></div>
        <div className="info-box">使用 Konva.Sprite 以 64×64 的四格 sprite sheet 播放。sheet 由 canvas 動態繪製成 data URL，再餵給 Sprite 做逐格動畫。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={360}>
          <Layer>
            {ready && imageRef.current && (
              <Sprite
                ref={spriteRef}
                x={300}
                y={130}
                image={imageRef.current}
                animation="idle"
                animations={animations}
                frameRate={frameRate}
                frameIndex={0}
                scaleX={2}
                scaleY={2}
              />
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
