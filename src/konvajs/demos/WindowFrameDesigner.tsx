import { useState } from 'react';
import { Layer, Rect, Line, Group, Text } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Cell { w: number; h: number; type: 'glass' | 'frame'; }

export default function WindowFrameDesigner() {
  const [grid, setGrid] = useState<Cell[][]>([
    [{ w: 180, h: 180, type: 'glass' }, { w: 180, h: 180, type: 'glass' }],
    [{ w: 180, h: 120, type: 'glass' }, { w: 180, h: 120, type: 'glass' }]
  ]);
  const [gap, setGap] = useState(8);

  const totalW = grid[0].reduce((s, c) => s + c.w, 0);
  const totalH = grid.reduce((s, row) => s + row[0].h, 0);

  const addCol = () => setGrid(g => g.map(row => [...row, { w: 160, h: row[0].h, type: 'glass' as const }]));
  const addRow = () => setGrid(g => [...g, grid[0].map(c => ({ w: c.w, h: 140, type: 'glass' as const }))]);
  const delCol = () => setGrid(g => g[0].length > 1 ? g.map(row => row.slice(0, -1)) : g);
  const delRow = () => setGrid(g => g.length > 1 ? g.slice(0, -1) : g);

  return (
    <DemoLayout title="🖼️ Window Frame Designer" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <h3>結構</h3>
        <div className="control-group">
          <button type="button" onClick={addCol}>+ 直欄</button>
          <button type="button" onClick={delCol}>- 直欄</button>
          <button type="button" onClick={addRow}>+ 橫列</button>
          <button type="button" onClick={delRow}>- 橫列</button>
        </div>
        <h3>框線</h3>
        <div className="control-group"><label>厚度: {gap}</label><input type="range" min="2" max="20" value={gap} onChange={e => setGap(+e.target.value)} /></div>
        <div className="info-box">共 {grid.length} 列 × {grid[0].length} 欄 = {totalW} × {totalH} 像素</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={780} designHeight={540}>
          <Layer>
            <Group x={30} y={30}>
              <Rect width={totalW + gap * 2} height={totalH + gap * 2} fill="#6b4f2a" />
              {grid.map((row, ri) => {
                let yAcc = gap + grid.slice(0, ri).reduce((s, r) => s + r[0].h + gap, 0);
                return row.map((cell, ci) => {
                  let xAcc = gap + row.slice(0, ci).reduce((s, c) => s + c.w + gap, 0);
                  return (
                    <Group key={ri + '-' + ci} x={xAcc} y={yAcc}>
                      <Rect width={cell.w} height={cell.h} fill="#bae6fd" stroke="#0369a1" strokeWidth={1} />
                      <Line points={[0, 0, cell.w, cell.h]} stroke="#fff" strokeWidth={1} opacity={0.4} />
                      <Text text={`${cell.w}×${cell.h}`} x={6} y={6} fontSize={12} fill="#0c4a6e" />
                    </Group>
                  );
                });
              })}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
