import { useEffect, useRef, useState } from 'react';
import { Layer, Circle, Text, Group } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Planet = {
  name: string;
  color: string;
  orbit: number;
  size: number;
  speed: number;
  fact: string;
};

const PLANETS: Planet[] = [
  { name: '水星', color: '#a3a3a3', orbit: 90, size: 6, speed: 1.4, fact: '水星是太陽系最內側的行星，表面溫差極大。' },
  { name: '金星', color: '#facc15', orbit: 140, size: 10, speed: 1.0, fact: '金星擁有最濃厚的大氣層，地表溫度約 465°C。' },
  { name: '地球', color: '#3b82f6', orbit: 195, size: 11, speed: 0.72, fact: '地球是目前唯一已知有生命存在的行星。' },
  { name: '火星', color: '#ef4444', orbit: 250, size: 9, speed: 0.5, fact: '火星又稱紅色星球，擁有太陽系最大的火山奧林帕斯山。' },
];

export default function PlanetsImageMap() {
  const [angles, setAngles] = useState<number[]>(PLANETS.map(() => Math.random() * Math.PI * 2));
  const [selected, setSelected] = useState<Planet | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    const tick = (t: number) => {
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;
      setAngles(prev => prev.map((a, i) => a + PLANETS[i].speed * dt));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const cx = 360, cy = 270;

  return (
    <DemoLayout title="🖼️ Planets Image Map" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>行星資訊</label>
          <div className="info-box">
            {selected ? (
              <div><strong>{selected.name}</strong><div style={{ marginTop: 6 }}>{selected.fact}</div></div>
            ) : (
              <div>點擊軌道上的行星查看介紹。</div>
            )}
          </div>
        </div>
        <div className="info-box">太陽系的簡化示意：太陽與 4 個繞軌行星。點擊行星可在側邊欄顯示簡介。</div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {PLANETS.map((p, i) => (
              <Circle
                key={'o' + i}
                x={cx}
                y={cy}
                radius={p.orbit}
                stroke="#475569"
                strokeWidth={1}
                dash={[4, 4]}
              />
            ))}
            <Circle x={cx} y={cy} radius={55} fill="#fde047" shadowColor="#facc15" shadowBlur={40} shadowOpacity={0.9} />
            <Circle x={cx} y={cy} radius={40} fill="#facc15" />
            <Text x={cx - 18} y={cy - 8} text="☀️" fontSize={28} />
            {PLANETS.map((p, i) => {
              const a = angles[i] ?? 0;
              const px = cx + Math.cos(a) * p.orbit;
              const py = cy + Math.sin(a) * p.orbit;
              return (
                <Group key={p.name} x={px} y={py} onClick={() => setSelected(p)} onTap={() => setSelected(p)}>
                  <Circle radius={p.size} fill={p.color} stroke="#e2e8f0" strokeWidth={1} />
                  <Text text={p.name} fontSize={12} fill="#e2e8f0" x={p.size + 4} y={-7} />
                </Group>
              );
            })}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
