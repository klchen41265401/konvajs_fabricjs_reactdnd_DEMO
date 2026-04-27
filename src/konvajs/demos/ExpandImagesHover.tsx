import { useEffect, useRef, useState } from 'react';
import { Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface ThumbProps {
  seed: string;
  nodeRef: (n: Konva.Image | null) => void;
  [key: string]: any;
}

function Thumb({ seed, nodeRef, ...rest }: ThumbProps) {
  const [img] = useImage(`https://picsum.photos/seed/${seed}/300/400`, 'anonymous');
  return <KonvaImage ref={nodeRef as any} image={img as any} {...rest} />;
}

export default function ExpandImagesHover() {
  const [expansion, setExpansion] = useState(2);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const refs = useRef<(Konva.Image | null)[]>([]);

  const count = 6;
  const baseW = 100;
  const h = 320;
  const gap = 10;
  const totalAvail = 720 - 40;

  useEffect(() => {
    const expandedW = baseW * expansion;
    const shrinkW = (totalAvail - expandedW - gap * (count - 1)) / (count - 1);

    let cursorX = 20;
    for (let i = 0; i < count; i++) {
      const node = refs.current[i];
      if (!node) continue;
      let targetW: number;
      if (hoverIndex === null) {
        targetW = (totalAvail - gap * (count - 1)) / count;
      } else if (i === hoverIndex) {
        targetW = expandedW;
      } else {
        targetW = shrinkW;
      }
      node.to({
        x: cursorX,
        width: targetW,
        duration: 0.35,
        easing: Konva.Easings.EaseInOut,
      });
      cursorX += targetW + gap;
    }
  }, [hoverIndex, expansion]);

  const initialW = (totalAvail - gap * (count - 1)) / count;
  const y = (540 - h) / 2;

  return (
    <DemoLayout
      title="🎬 Expand Images On Hover"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>放大倍率：{expansion.toFixed(1)}x</label>
            <input
              type="range"
              min={1.5}
              max={4}
              step={0.1}
              value={expansion}
              onChange={(e) => setExpansion(Number(e.target.value))}
            />
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>類似 Netflix 列表，滑鼠懸停的圖片會放大，其餘縮窄讓出空間。使用 Konva.Tween 改變 width。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {Array.from({ length: count }).map((_, i) => (
              <Thumb
                key={i}
                seed={`exp-${i}`}
                nodeRef={(n) => (refs.current[i] = n)}
                x={20 + i * (initialW + gap)}
                y={y}
                width={initialW}
                height={h}
                cornerRadius={8}
                shadowColor="#000"
                shadowBlur={15}
                shadowOpacity={0.5}
                onMouseEnter={(e: Konva.KonvaEventObject<MouseEvent>) => {
                  setHoverIndex(i);
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'pointer';
                }}
                onMouseLeave={(e: Konva.KonvaEventObject<MouseEvent>) => {
                  setHoverIndex(null);
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
                }}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
