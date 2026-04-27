import { useState } from 'react';
import { Layer, Group, Circle } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface CircleItem {
  x: number;
  y: number;
  r: number;
  fill: string;
}

const PALETTE = ['#ef5350', '#42a5f5', '#66bb6a', '#ab47bc', '#ffa726', '#26c6da'];

export default function TransparentGroup() {
  const [opacity, setOpacity] = useState(0.6);
  const [circles, setCircles] = useState<CircleItem[]>([
    { x: 320, y: 200, r: 90, fill: '#ef5350' },
    { x: 380, y: 240, r: 90, fill: '#42a5f5' },
    { x: 350, y: 290, r: 90, fill: '#66bb6a' },
  ]);

  const addCircle = () => {
    setCircles(list => [
      ...list,
      {
        x: 200 + Math.random() * 320,
        y: 150 + Math.random() * 200,
        r: 60 + Math.random() * 40,
        fill: PALETTE[list.length % PALETTE.length],
      },
    ]);
  };
  const removeCircle = () => setCircles(list => list.slice(0, -1));

  return (
    <DemoLayout title="🫧 Transparent Group" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>Group opacity: {opacity.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(+e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={addCircle}>➕ 新增圓</button>
          <button type="button" onClick={removeCircle} disabled={circles.length === 0}>➖ 移除</button>
        </div>
        <div className="info-box">Group 的 opacity 會同時套用到其所有子節點，並以群組整體合成，避免子節點重疊處產生疊加變暗的瑕疵。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            <Group opacity={opacity} draggable>
              {circles.map((c, i) => (
                <Circle key={i} x={c.x} y={c.y} radius={c.r} fill={c.fill} />
              ))}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
