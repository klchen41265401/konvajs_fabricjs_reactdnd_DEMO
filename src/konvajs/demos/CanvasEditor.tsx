import { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Circle, Transformer, Text, RegularPolygon, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Shape { id: string; type: 'rect' | 'circle' | 'star' | 'line' | 'text'; x: number; y: number; fill?: string; text?: string; }

let idc = 0;

export default function CanvasEditor() {
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 'r1', type: 'rect', x: 100, y: 80, fill: '#38bdf8' },
    { id: 'c1', type: 'circle', x: 300, y: 130, fill: '#f59e0b' },
    { id: 't1', type: 'text', x: 80, y: 260, fill: '#0f172a', text: 'Konva Canvas Editor' }
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    if (!trRef.current) return;
    const layer = layerRef.current;
    if (!layer) return;
    const node = selected ? layer.findOne('#' + selected) : null;
    trRef.current.nodes(node ? [node] : []);
    layer.batchDraw();
  }, [selected, shapes]);

  const add = (type: Shape['type']) => setShapes(s => [...s, { id: 's' + (++idc), type, x: 80 + Math.random() * 400, y: 80 + Math.random() * 300, fill: `hsl(${Math.random() * 360},70%,60%)`, text: type === 'text' ? 'Hello' : undefined }]);
  const del = () => { if (selected) { setShapes(s => s.filter(x => x.id !== selected)); setSelected(null); } };
  const exportPng = () => {
    const url = layerRef.current!.getStage()!.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'canvas.png'; a.click();
  };

  return (
    <DemoLayout title="🖼️ Canvas Editor" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <h3>新增</h3>
        <div className="control-group">
          <button type="button" onClick={() => add('rect')}>矩形</button>
          <button type="button" onClick={() => add('circle')}>圓</button>
          <button type="button" onClick={() => add('star')}>星形</button>
          <button type="button" onClick={() => add('line')}>線</button>
          <button type="button" onClick={() => add('text')}>文字</button>
        </div>
        <h3>操作</h3>
        <div className="control-group">
          <button type="button" onClick={del}>刪除選取</button>
          <button type="button" onClick={exportPng}>匯出 PNG</button>
          <button type="button" onClick={() => setShapes([])}>清空</button>
        </div>
        <div className="info-box">支援拖曳、縮放、旋轉、刪除、匯出圖片。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540} onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => { if (e.target === e.target.getStage()) setSelected(null); }}>
          <Layer ref={layerRef}>
            {shapes.map(s => {
              const common = { id: s.id, draggable: true, x: s.x, y: s.y, onClick: () => setSelected(s.id), onTap: () => setSelected(s.id), onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => setShapes(cur => cur.map(c => c.id === s.id ? { ...c, x: e.target.x(), y: e.target.y() } : c)) };
              if (s.type === 'rect') return <Rect key={s.id} {...common} width={140} height={90} fill={s.fill} />;
              if (s.type === 'circle') return <Circle key={s.id} {...common} radius={55} fill={s.fill} />;
              if (s.type === 'star') return <RegularPolygon key={s.id} {...common} sides={5} radius={60} fill={s.fill} />;
              if (s.type === 'line') return <Line key={s.id} {...common} points={[0, 0, 140, 0]} stroke={s.fill} strokeWidth={6} />;
              return <Text key={s.id} {...common} text={s.text} fontSize={28} fill={s.fill} />;
            })}
            <Transformer ref={trRef} rotateEnabled keepRatio={false} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
