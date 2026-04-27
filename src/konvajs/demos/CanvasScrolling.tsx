import { useMemo } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function CanvasScrolling() {
  const SCENE = 3000;
  const VIEW_W = 720;
  const VIEW_H = 540;
  const CELL = 100;

  const squares = useMemo(() => {
    const arr: { x: number; y: number; fill: string; label: string }[] = [];
    const cols = SCENE / CELL;
    const rows = SCENE / CELL;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = ((r * cols + c) * 7) % 360;
        arr.push({
          x: c * CELL,
          y: r * CELL,
          fill: `hsl(${hue}, 70%, 70%)`,
          label: `${r},${c}`,
        });
      }
    }
    return arr;
  }, []);

  return (
    <DemoLayout title="🗺️ Canvas Scrolling" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="info-box">作法：將一個超大 Stage ({SCENE}×{SCENE}) 放進一個 overflow:auto 的外框 div ({VIEW_W}×{VIEW_H})，使用原生捲軸觀看。</div>
      </>
    }>
      <div style={{ width: VIEW_W, height: VIEW_H, overflow: 'auto', border: '1px solid #ccc', background: '#fafafa' }}>
        <ResponsiveStage designWidth={SCENE} designHeight={SCENE}>
          <Layer>
            {squares.map((s, i) => (
              <Rect key={i} x={s.x} y={s.y} width={CELL - 2} height={CELL - 2} fill={s.fill} stroke="#333" strokeWidth={1} />
            ))}
            {squares.filter((_, i) => i % 5 === 0).map((s, i) => (
              <Text key={'t' + i} x={s.x + 8} y={s.y + 8} text={s.label} fontSize={14} fill="#222" />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
