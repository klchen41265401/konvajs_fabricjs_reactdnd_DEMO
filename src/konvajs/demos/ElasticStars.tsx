import { useEffect, useRef, useState } from 'react';
import { Layer, Star } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface StarItem {
  id: number;
  x: number;
  y: number;
  color: string;
}

function randomColor(): string {
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function ElasticStars() {
  const [count, setCount] = useState(20);
  const [speed, setSpeed] = useState(1);
  const [stars, setStars] = useState<StarItem[]>([]);
  const starRefs = useRef<Map<number, Konva.Star>>(new Map());
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const items: StarItem[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: 60 + Math.random() * 600,
        y: 60 + Math.random() * 420,
        color: randomColor(),
      });
    }
    setStars(items);
  }, [count]);

  useEffect(() => {
    const tweens: Konva.Tween[] = [];
    const timers: number[] = [];

    stars.forEach((s, i) => {
      const node = starRefs.current.get(s.id);
      if (!node) return;
      const timer = window.setTimeout(() => {
        const pulse = () => {
          const t = new Konva.Tween({
            node,
            duration: 0.8 / speedRef.current,
            scaleX: 1.2,
            scaleY: 1.2,
            easing: Konva.Easings.ElasticEaseOut,
            onFinish: () => {
              const t2 = new Konva.Tween({
                node,
                duration: 0.8 / speedRef.current,
                scaleX: 1,
                scaleY: 1,
                easing: Konva.Easings.ElasticEaseOut,
                onFinish: pulse,
              });
              tweens.push(t2);
              t2.play();
            },
          });
          tweens.push(t);
          t.play();
        };
        pulse();
      }, i * 80);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      tweens.forEach((t) => t.destroy());
    };
  }, [stars]);

  return (
    <DemoLayout
      title="⭐ Elastic Stars"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>星星數量：{count}</label>
            <input
              type="range"
              min={5}
              max={60}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>速度：{speed.toFixed(1)}x</label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>使用 Konva.Tween 與 ElasticEaseOut 緩動函數製作彈性脈動效果，星星大小在 1 ~ 1.2 間振盪。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {stars.map((s) => (
              <Star
                key={s.id}
                ref={(node) => {
                  if (node) starRefs.current.set(s.id, node);
                }}
                x={s.x}
                y={s.y}
                numPoints={5}
                innerRadius={10}
                outerRadius={22}
                fill={s.color}
                stroke="#333"
                strokeWidth={1}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
