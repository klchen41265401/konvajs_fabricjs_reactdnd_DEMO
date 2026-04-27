import { useState } from 'react';
import { Layer, Rect, Circle, Star, Label, Tag, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface ShapeDef {
  id: number;
  type: 'rect' | 'circle' | 'star';
  x: number;
  y: number;
  color: string;
  tooltip: string;
}

const SHAPES: ShapeDef[] = [
  { id: 1, type: 'rect', x: 150, y: 200, color: '#ff6b6b', tooltip: '紅色矩形\n我是一個方正的朋友' },
  { id: 2, type: 'circle', x: 360, y: 200, color: '#4dabf7', tooltip: '藍色圓圈\n滾動中的哲學家' },
  { id: 3, type: 'star', x: 560, y: 200, color: '#feca57', tooltip: '黃色星星\n五角的明星' },
  { id: 4, type: 'rect', x: 260, y: 380, color: '#1dd1a1', tooltip: '綠色矩形\n環保主義者' },
  { id: 5, type: 'circle', x: 460, y: 380, color: '#ff9ff3', tooltip: '粉紅圓圈\n甜美又可愛' },
];

export default function ShapeTooltip() {
  const [enabled, setEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);

  const handleEnter = (e: Konva.KonvaEventObject<MouseEvent>, s: ShapeDef) => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = 'pointer';
    if (!enabled) return;
    const pos = e.target.getClientRect();
    setHover({ id: s.id, x: pos.x + pos.width / 2, y: pos.y });
  };
  const handleLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = 'default';
    setHover(null);
  };

  const hoveredShape = hover ? SHAPES.find((s) => s.id === hover.id) : null;

  return (
    <DemoLayout
      title="💬 Shape Tooltip"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />{' '}
              啟用 Tooltip
            </label>
          </div>
          <div className="control-group">
            <label>文字大小：{fontSize}px</label>
            <input
              type="range"
              min={10}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>使用 Konva.Label + Tag + Text 元件組合出浮動提示框，滑鼠懸停時顯示於圖形上方。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {SHAPES.map((s) => {
              const common = {
                onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => handleEnter(e, s),
                onMouseLeave: handleLeave,
              };
              if (s.type === 'rect') {
                return (
                  <Rect
                    key={s.id}
                    x={s.x}
                    y={s.y}
                    width={100}
                    height={80}
                    offsetX={50}
                    offsetY={40}
                    fill={s.color}
                    cornerRadius={8}
                    {...common}
                  />
                );
              }
              if (s.type === 'circle') {
                return <Circle key={s.id} x={s.x} y={s.y} radius={50} fill={s.color} {...common} />;
              }
              return (
                <Star
                  key={s.id}
                  x={s.x}
                  y={s.y}
                  numPoints={5}
                  innerRadius={22}
                  outerRadius={50}
                  fill={s.color}
                  {...common}
                />
              );
            })}
            {enabled && hover && hoveredShape && (
              <Label x={hover.x} y={hover.y - 10} opacity={0.9}>
                <Tag
                  fill="#222"
                  pointerDirection="down"
                  pointerWidth={10}
                  pointerHeight={10}
                  lineJoin="round"
                  shadowColor="#000"
                  shadowBlur={10}
                  shadowOpacity={0.4}
                  cornerRadius={4}
                />
                <Text
                  text={hoveredShape.tooltip}
                  fontSize={fontSize}
                  padding={8}
                  fill="#fff"
                  align="center"
                />
              </Label>
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
