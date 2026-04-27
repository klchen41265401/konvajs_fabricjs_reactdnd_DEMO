import { useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export default function MultiTouchScaleShape() {
  const rectRef = useRef<Konva.Rect>(null);
  const lastDist = useRef(0);
  const [scale, setScale] = useState(1);

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches;
    if (touches.length !== 2) return;
    e.evt.preventDefault();

    const t1 = { x: touches[0].clientX, y: touches[0].clientY };
    const t2 = { x: touches[1].clientX, y: touches[1].clientY };
    const dist = distance(t1, t2);

    if (!lastDist.current) {
      lastDist.current = dist;
      return;
    }

    const node = rectRef.current;
    if (!node) return;

    const currentScale = node.scaleX();
    const newScale = Math.max(0.3, Math.min(4, (currentScale * dist) / lastDist.current));
    node.scaleX(newScale);
    node.scaleY(newScale);
    setScale(newScale);
    lastDist.current = dist;
  };

  const handleTouchEnd = () => {
    lastDist.current = 0;
  };

  return (
    <DemoLayout
      title="🤏 Multi-Touch Scale Shape"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>目前縮放：{scale.toFixed(2)}x</label>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>在觸控裝置上以兩指縮放矩形。計算兩指距離的比例來調整形狀大小，單指則可拖曳。</p>
            <p>桌面測試可打開開發者工具的「Toggle device toolbar」。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <Stage
          width={720}
          height={540}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            <Rect
              ref={rectRef}
              x={360}
              y={270}
              width={200}
              height={140}
              offsetX={100}
              offsetY={70}
              fill="#4dabf7"
              stroke="#fff"
              strokeWidth={3}
              cornerRadius={8}
              draggable
              shadowColor="#000"
              shadowBlur={15}
              shadowOpacity={0.4}
            />
          </Layer>
        </Stage>
      </div>
    </DemoLayout>
  );
}
