import { useState } from 'react';
import { Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Label { x: number; y: number; w: number; h: number; text: string; color: string; }

export default function DrawingLabels() {
  const [img] = useImage('https://picsum.photos/id/1015/720/480', 'anonymous');
  const [labels, setLabels] = useState<Label[]>([]);
  const [drawing, setDrawing] = useState<{ x: number; y: number; x2: number; y2: number } | null>(null);
  const [tool, setTool] = useState<'draw' | 'move'>('draw');
  const [color, setColor] = useState('#f59e0b');

  const onDown = (e: any) => {
    if (tool !== 'draw') return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const p = { x: pos.x / stage.scaleX(), y: pos.y / stage.scaleY() };
    setDrawing({ x: p.x, y: p.y, x2: p.x, y2: p.y });
  };
  const onMove = (e: any) => {
    if (!drawing) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const p = { x: pos.x / stage.scaleX(), y: pos.y / stage.scaleY() };
    setDrawing({ ...drawing, x2: p.x, y2: p.y });
  };
  const onUp = () => {
    if (!drawing) return;
    const { x, y, x2, y2 } = drawing;
    const w = Math.abs(x2 - x), h = Math.abs(y2 - y);
    if (w > 8 && h > 8) {
      const txt = prompt('標註名稱？') || 'label';
      setLabels(ls => [...ls, { x: Math.min(x, x2), y: Math.min(y, y2), w, h, text: txt, color }]);
    }
    setDrawing(null);
  };

  return (
    <DemoLayout title="🖼️ Drawing Labels on Image" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <h3>工具</h3>
        <div className="control-group">
          <button type="button" className={tool === 'draw' ? 'active' : ''} onClick={() => setTool('draw')}>畫框</button>
          <button type="button" className={tool === 'move' ? 'active' : ''} onClick={() => setTool('move')}>移動</button>
        </div>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><button type="button" onClick={() => setLabels([])}>清除標註</button></div>
        <div className="info-box">拖曳在圖上框選，輸入名稱建立標註。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={480} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
          <Layer>
            {img && <KonvaImage image={img} width={720} height={480} />}
            {labels.map((lb, i) => (
              <Group key={i} x={lb.x} y={lb.y} draggable={tool === 'move'}>
                <Rect width={lb.w} height={lb.h} stroke={lb.color} strokeWidth={3} fill={lb.color + '33'} />
                <Rect width={Math.min(lb.text.length * 8 + 12, 200)} height={20} fill={lb.color} y={-20} />
                <Text text={lb.text} x={6} y={-17} fontSize={13} fill="#0f172a" />
              </Group>
            ))}
            {drawing && <Rect x={Math.min(drawing.x, drawing.x2)} y={Math.min(drawing.y, drawing.y2)} width={Math.abs(drawing.x2 - drawing.x)} height={Math.abs(drawing.y2 - drawing.y)} stroke={color} dash={[4, 4]} />}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
