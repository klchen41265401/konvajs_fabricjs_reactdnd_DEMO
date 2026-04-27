import { useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Star } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';

function getCenter(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}
function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export default function MultiTouchScaleStage() {
  const stageRef = useRef<Konva.Stage>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef(0);
  const [scale, setScale] = useState(1);

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touches = e.evt.touches;
    const stage = stageRef.current;
    if (!stage) return;

    if (touches.length === 2) {
      stage.stopDrag();
      const t1 = { x: touches[0].clientX, y: touches[0].clientY };
      const t2 = { x: touches[1].clientX, y: touches[1].clientY };

      const newCenter = getCenter(t1, t2);
      const dist = getDistance(t1, t2);

      if (!lastCenter.current) {
        lastCenter.current = newCenter;
        lastDist.current = dist;
        return;
      }

      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      const newScale = Math.max(0.3, Math.min(5, (stage.scaleX() * dist) / lastDist.current));
      stage.scaleX(newScale);
      stage.scaleY(newScale);
      setScale(newScale);

      const dx = newCenter.x - lastCenter.current.x;
      const dy = newCenter.y - lastCenter.current.y;

      stage.position({
        x: newCenter.x - pointTo.x * newScale + dx,
        y: newCenter.y - pointTo.y * newScale + dy,
      });

      lastDist.current = dist;
      lastCenter.current = newCenter;
    }
  };

  const handleTouchEnd = () => {
    lastCenter.current = null;
    lastDist.current = 0;
  };

  return (
    <DemoLayout
      title="🤲 Multi-Touch Scale Stage"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>Stage 縮放：{scale.toFixed(2)}x</label>
          </div>
          <div className="control-group">
            <button
              onClick={() => {
                const stage = stageRef.current;
                if (!stage) return;
                stage.scale({ x: 1, y: 1 });
                stage.position({ x: 0, y: 0 });
                setScale(1);
              }}
            >
              重置視圖
            </button>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>以兩指縮放整個 Stage 內容（pinch-zoom），單指則可拖曳整個畫布（pan）。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <Stage
          ref={stageRef}
          width={720}
          height={540}
          draggable
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Layer>
            <Rect x={100} y={100} width={120} height={80} fill="#ff6b6b" cornerRadius={8} />
            <Circle x={400} y={150} radius={60} fill="#4dabf7" />
            <Star x={560} y={280} numPoints={5} innerRadius={25} outerRadius={55} fill="#feca57" />
            <Rect x={200} y={320} width={150} height={150} fill="#1dd1a1" cornerRadius={12} />
            <Circle x={500} y={420} radius={50} fill="#ff9ff3" />
          </Layer>
        </Stage>
      </div>
    </DemoLayout>
  );
}
