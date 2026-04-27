import { useState } from 'react';
import { Layer, Rect, Line, Group } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function SimpleWindowFrame() {
  const [w, setW] = useState(360);
  const [h, setH] = useState(240);
  const [cols, setCols] = useState(2);
  const [rows, setRows] = useState(2);

  const pad = 10;
  const ox = 180, oy = 120;

  return (
    <DemoLayout title="🖼️ Simple Window Frame" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <h3>尺寸</h3>
        <div className="control-group"><label>寬: {w}</label><input type="range" min="120" max="560" value={w} onChange={e => setW(+e.target.value)} /></div>
        <div className="control-group"><label>高: {h}</label><input type="range" min="120" max="400" value={h} onChange={e => setH(+e.target.value)} /></div>
        <h3>分割</h3>
        <div className="control-group"><label>直欄: {cols}</label><input type="range" min="1" max="6" value={cols} onChange={e => setCols(+e.target.value)} /></div>
        <div className="control-group"><label>橫列: {rows}</label><input type="range" min="1" max="6" value={rows} onChange={e => setRows(+e.target.value)} /></div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            <Group x={ox} y={oy}>
              <Rect x={0} y={0} width={w} height={h} fill="#fde68a" stroke="#92400e" strokeWidth={pad} />
              {Array.from({ length: cols - 1 }).map((_, i) => (
                <Line key={'v' + i} points={[((i + 1) * w) / cols, pad, ((i + 1) * w) / cols, h - pad]} stroke="#92400e" strokeWidth={4} />
              ))}
              {Array.from({ length: rows - 1 }).map((_, i) => (
                <Line key={'h' + i} points={[pad, ((i + 1) * h) / rows, w - pad, ((i + 1) * h) / rows]} stroke="#92400e" strokeWidth={4} />
              ))}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
