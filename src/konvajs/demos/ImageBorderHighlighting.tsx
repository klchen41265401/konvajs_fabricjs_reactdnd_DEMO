import { useRef, useState } from 'react';
import { Layer, Image as KonvaImage, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface ThumbProps {
  x: number;
  y: number;
  seed: string;
  w: number;
  h: number;
  highlightColor: string;
  glowRadius: number;
  hovered: boolean;
  onHover: (h: boolean) => void;
}

function Thumb({ x, y, seed, w, h, highlightColor, glowRadius, hovered, onHover }: ThumbProps) {
  const [img, status] = useImage(`https://picsum.photos/seed/${seed}/200/150`, 'anonymous');
  const borderRef = useRef<Konva.Rect>(null);

  return (
    <>
      {status === 'loaded' && img && (
        <KonvaImage
          x={x}
          y={y}
          width={w}
          height={h}
          image={img}
          onMouseEnter={(e) => {
            onHover(true);
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'pointer';
            if (borderRef.current) {
              borderRef.current.to({
                strokeWidth: 6,
                shadowBlur: glowRadius,
                duration: 0.25,
              });
            }
          }}
          onMouseLeave={(e) => {
            onHover(false);
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'default';
            if (borderRef.current) {
              borderRef.current.to({
                strokeWidth: 0,
                shadowBlur: 0,
                duration: 0.25,
              });
            }
          }}
        />
      )}
      <Rect
        ref={borderRef}
        x={x}
        y={y}
        width={w}
        height={h}
        stroke={highlightColor}
        strokeWidth={hovered ? 6 : 0}
        shadowColor={highlightColor}
        shadowBlur={hovered ? glowRadius : 0}
        shadowOpacity={0.9}
        listening={false}
      />
    </>
  );
}

export default function ImageBorderHighlighting() {
  const [color, setColor] = useState('#ff006e');
  const [glowRadius, setGlowRadius] = useState(20);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const cols = 4;
  const rows = 3;
  const tw = 140;
  const th = 100;
  const gap = 20;
  const startX = (720 - (cols * tw + (cols - 1) * gap)) / 2;
  const startY = (540 - (rows * th + (rows - 1) * gap)) / 2;

  const items: { seed: string; x: number; y: number; i: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      items.push({
        seed: `img-${i}`,
        x: startX + c * (tw + gap),
        y: startY + r * (th + gap),
        i,
      });
    }
  }

  return (
    <DemoLayout
      title="🖼️ Image Border Highlighting"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>Hover 顏色</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="control-group">
            <label>光暈半徑：{glowRadius}</label>
            <input
              type="range"
              min={0}
              max={60}
              value={glowRadius}
              onChange={(e) => setGlowRadius(Number(e.target.value))}
            />
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>滑鼠移到縮圖上時，邊框會以 tween 動畫出現發光效果，透過 strokeWidth 與 shadowBlur 實現。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {items.map((it) => (
              <Thumb
                key={it.i}
                x={it.x}
                y={it.y}
                w={tw}
                h={th}
                seed={it.seed}
                highlightColor={color}
                glowRadius={glowRadius}
                hovered={hoverIndex === it.i}
                onHover={(h) => setHoverIndex(h ? it.i : null)}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
