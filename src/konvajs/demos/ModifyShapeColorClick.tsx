import { useState } from 'react';
import { Layer, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const PALETTE = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3'];

export default function ModifyShapeColorClick() {
  const [colors, setColors] = useState<number[]>(Array(9).fill(0));
  const [counts, setCounts] = useState<number[]>(Array(PALETTE.length).fill(0));

  const handleClick = (i: number) => {
    setColors((prev) => {
      const next = [...prev];
      const newColorIdx = (next[i] + 1) % PALETTE.length;
      next[i] = newColorIdx;
      setCounts((c) => {
        const nc = [...c];
        nc[newColorIdx] += 1;
        return nc;
      });
      return next;
    });
  };

  const reset = () => {
    setColors(Array(9).fill(0));
    setCounts(Array(PALETTE.length).fill(0));
  };

  const cols = 3;
  const rows = 3;
  const size = 120;
  const gap = 20;
  const startX = (720 - (cols * size + (cols - 1) * gap)) / 2;
  const startY = (540 - (rows * size + (rows - 1) * gap)) / 2;

  return (
    <DemoLayout
      title="🎨 Modify Shape Color on Click"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <button type="button" onClick={reset}>🔄 重置</button>
          </div>
          <div className="control-group">
            <label>各色點擊次數</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PALETTE.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: c,
                      borderRadius: 4,
                      border: '1px solid #333',
                    }}
                  />
                  <span style={{ fontFamily: 'monospace' }}>{counts[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>點擊任一格矩形，會依順序循環切換色盤的 6 種顏色，並統計每種顏色被選中的次數。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              return (
                <Rect
                  key={i}
                  x={startX + c * (size + gap)}
                  y={startY + r * (size + gap)}
                  width={size}
                  height={size}
                  fill={PALETTE[colors[i]]}
                  cornerRadius={10}
                  stroke="#333"
                  strokeWidth={2}
                  onClick={() => handleClick(i)}
                  onTap={() => handleClick(i)}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'default';
                  }}
                />
              );
            })}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
