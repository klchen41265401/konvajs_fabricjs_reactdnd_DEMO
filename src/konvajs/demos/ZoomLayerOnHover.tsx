import { useRef, useState } from 'react';
import { Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface ThumbProps {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: string;
  scaleFactor: number;
  duration: number;
}

function Thumb({ x, y, w, h, seed, scaleFactor, duration }: ThumbProps) {
  const [img, status] = useImage(`https://picsum.photos/seed/${seed}/300/200`, 'anonymous');
  const ref = useRef<Konva.Image>(null);

  if (status !== 'loaded' || !img) return null;

  return (
    <KonvaImage
      ref={ref}
      x={x}
      y={y}
      width={w}
      height={h}
      offsetX={w / 2}
      offsetY={h / 2}
      image={img}
      cornerRadius={6}
      shadowColor="#000"
      shadowBlur={6}
      shadowOpacity={0.3}
      onMouseEnter={(e) => {
        const node = ref.current;
        if (!node) return;
        node.moveToTop();
        node.to({
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          duration,
          easing: Konva.Easings.EaseOut,
        });
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        const node = ref.current;
        if (!node) return;
        node.to({
          scaleX: 1,
          scaleY: 1,
          duration,
          easing: Konva.Easings.EaseOut,
        });
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
      }}
    />
  );
}

export default function ZoomLayerOnHover() {
  const [scaleFactor, setScaleFactor] = useState(1.25);
  const [duration, setDuration] = useState(0.3);

  const cols = 4;
  const rows = 3;
  const tw = 150;
  const th = 110;
  const gap = 25;
  const startX = (720 - (cols * tw + (cols - 1) * gap)) / 2 + tw / 2;
  const startY = (540 - (rows * th + (rows - 1) * gap)) / 2 + th / 2;

  return (
    <DemoLayout
      title="🔍 Zoom Layer On Hover"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>放大倍率：{scaleFactor.toFixed(2)}</label>
            <input
              type="range"
              min={1.1}
              max={2}
              step={0.05}
              value={scaleFactor}
              onChange={(e) => setScaleFactor(Number(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>動畫時長：{duration.toFixed(2)}s</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>滑鼠懸停時，該圖片透過 moveToTop 提升到最上層並使用 tween 放大，離開時恢復。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              return (
                <Thumb
                  key={i}
                  seed={`zoom-${i}`}
                  x={startX + c * (tw + gap)}
                  y={startY + r * (th + gap)}
                  w={tw}
                  h={th}
                  scaleFactor={scaleFactor}
                  duration={duration}
                />
              );
            })}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
