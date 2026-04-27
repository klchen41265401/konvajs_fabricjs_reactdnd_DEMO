import { useState } from 'react';
import { Layer, Circle } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const BGS = [
  { id: 'a', label: '山景', url: 'https://picsum.photos/seed/mountain-bg/720/540' },
  { id: 'b', label: '海景', url: 'https://picsum.photos/seed/ocean-bg/720/540' },
  { id: 'c', label: '城市', url: 'https://picsum.photos/seed/city-bg/720/540' },
];

export default function CanvasBackground() {
  const [bg, setBg] = useState(BGS[0]);

  const circles = [
    { x: 180, y: 200, r: 60, fill: 'rgba(239,83,80,0.8)' },
    { x: 360, y: 300, r: 80, fill: 'rgba(66,165,245,0.8)' },
    { x: 540, y: 220, r: 70, fill: 'rgba(102,187,106,0.8)' },
    { x: 260, y: 400, r: 50, fill: 'rgba(171,71,188,0.8)' },
    { x: 500, y: 420, r: 55, fill: 'rgba(255,167,38,0.8)' },
  ];

  return (
    <DemoLayout title="🖼️ Canvas Background Image" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>背景圖</label>
          {BGS.map(b => (
            <button type="button" key={b.id} onClick={() => setBg(b)} style={{ fontWeight: bg.id === b.id ? 700 : 400 }}>{b.label}</button>
          ))}
        </div>
        <div className="info-box">背景以 CSS background-image 設定在外框 div，Konva Stage / Layer 保持透明，圖形便會疊加在 CSS 背景之上。</div>
      </>
    }>
      <div
        className="stage-wrapper"
        style={{
          backgroundImage: `url(${bg.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <ResponsiveStage designWidth={720} designHeight={540} style={{ background: 'transparent' }}>
          <Layer>
            {circles.map((c, i) => (
              <Circle key={i} x={c.x} y={c.y} radius={c.r} fill={c.fill} draggable stroke="#fff" strokeWidth={2} />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
