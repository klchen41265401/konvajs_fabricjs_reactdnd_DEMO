import { useEffect, useRef, useState } from 'react';
import { Layer, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function HeatmapGenerator() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [radius, setRadius] = useState(40);
  const [intensity, setIntensity] = useState(0.35);
  const [bitmap, setBitmap] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = 720; c.height = 480;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, 720, 480);
    // draw gradient heat points
    points.forEach(p => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      g.addColorStop(0, `rgba(255,0,0,${intensity})`);
      g.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
    });
    // colorize alpha -> heatmap colors
    const img = ctx.getImageData(0, 0, 720, 480);
    for (let i = 0; i < img.data.length; i += 4) {
      const a = img.data[i + 3] / 255;
      if (a < 0.02) continue;
      const h = (1 - a) * 240;
      const rgb = hslToRgb(h, 1, 0.5);
      img.data[i] = rgb[0]; img.data[i + 1] = rgb[1]; img.data[i + 2] = rgb[2];
      img.data[i + 3] = Math.min(255, a * 255 * 1.5);
    }
    ctx.putImageData(img, 0, 0);
    setBitmap(c);
  }, [points, radius, intensity]);

  return (
    <DemoLayout title="🖼️ Heatmap Generator" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="info-box">在圖上點擊加熱點。</div>
        <div className="control-group"><label>半徑: {radius}</label><input type="range" min="10" max="100" value={radius} onChange={e => setRadius(+e.target.value)} /></div>
        <div className="control-group"><label>強度: {intensity.toFixed(2)}</label><input type="range" min="0.05" max="1" step="0.05" value={intensity} onChange={e => setIntensity(+e.target.value)} /></div>
        <div className="control-group"><button type="button" onClick={() => setPoints([])}>清除</button></div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={480} onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => { const s = e.target.getStage()!; const p = s.getPointerPosition()!; setPoints(pts => [...pts, { x: p.x / s.scaleX(), y: p.y / s.scaleY() }]); }}>
          <Layer>
            {bitmap && <KonvaImage image={bitmap} />}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
