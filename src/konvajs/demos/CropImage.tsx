import { useRef, useState } from 'react';
import { Layer, Image as KImage, Rect, Circle, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function CropImage() {
  const [img] = useImage('https://picsum.photos/id/1018/700/500', 'anonymous');
  const initial = { x: 120, y: 80, w: 360, h: 260 };
  const [crop, setCrop] = useState(initial);
  const stageRef = useRef<Konva.Stage | null>(null);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const updateCorner = (corner: 'tl' | 'tr' | 'bl' | 'br', x: number, y: number) => {
    setCrop(c => {
      let { x: cx, y: cy, w, h } = c;
      const right = cx + w;
      const bottom = cy + h;
      if (corner === 'tl') { cx = clamp(x, 0, right - 20); cy = clamp(y, 0, bottom - 20); w = right - cx; h = bottom - cy; }
      if (corner === 'tr') { const nx = clamp(x, cx + 20, 700); cy = clamp(y, 0, bottom - 20); w = nx - cx; h = bottom - cy; }
      if (corner === 'bl') { cx = clamp(x, 0, right - 20); const ny = clamp(y, cy + 20, 500); w = right - cx; h = ny - cy; }
      if (corner === 'br') { const nx = clamp(x, cx + 20, 700); const ny = clamp(y, cy + 20, 500); w = nx - cx; h = ny - cy; }
      return { x: cx, y: cy, w, h };
    });
  };

  const exportCropped = () => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scaleX = img.width / 700;
    const scaleY = img.height / 500;
    ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.w * scaleX, crop.h * scaleY, 0, 0, crop.w, crop.h);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'cropped.png'; a.click();
  };

  const handles: Array<{ k: 'tl' | 'tr' | 'bl' | 'br'; x: number; y: number }> = [
    { k: 'tl', x: crop.x, y: crop.y },
    { k: 'tr', x: crop.x + crop.w, y: crop.y },
    { k: 'bl', x: crop.x, y: crop.y + crop.h },
    { k: 'br', x: crop.x + crop.w, y: crop.y + crop.h },
  ];

  return (
    <DemoLayout title="🖼️ Crop Image" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><button type="button" onClick={exportCropped}>匯出裁切 PNG</button></div>
        <div className="control-group"><button type="button" onClick={() => setCrop(initial)}>重設</button></div>
        <div className="info-box">拖曳四個角落控制點來調整裁切範圍，按下匯出按鈕可下載裁切後的影像。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={700} designHeight={500}>
          <Layer>
            {img && <KImage image={img} width={700} height={500} />}
            <Rect x={0} y={0} width={700} height={500} fill="black" opacity={0.45} />
            <Group
              clipFunc={(ctx) => {
                ctx.rect(crop.x, crop.y, crop.w, crop.h);
              }}
            >
              {img && <KImage image={img} width={700} height={500} />}
            </Group>
            <Rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} stroke="#60a5fa" strokeWidth={2} dash={[6, 4]} />
            {handles.map(h => (
              <Circle
                key={h.k}
                x={h.x}
                y={h.y}
                radius={8}
                fill="#60a5fa"
                stroke="#ffffff"
                strokeWidth={2}
                draggable
                onDragMove={(e) => updateCorner(h.k, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
