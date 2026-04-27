import { useState } from 'react';
import { Layer, Circle } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

type Marker = { id: number; x: number; y: number };

export default function CanvasOverlay() {
  const { src, FileInput } = useFileSource('https://picsum.photos/id/1043/720/540', 'image/*');
  const [markers, setMarkers] = useState<Marker[]>([
    { id: 1, x: 220, y: 180 },
    { id: 2, x: 480, y: 320 },
  ]);
  const [nextId, setNextId] = useState(3);

  const addMarker = (e: any) => {
    if (e.target !== e.target.getStage()) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setMarkers(m => [...m, { id: nextId, x: pos.x / stage.scaleX(), y: pos.y / stage.scaleY() }]);
    setNextId(n => n + 1);
  };

  const removeMarker = (id: number) => {
    setMarkers(m => m.filter(x => x.id !== id));
  };

  const moveMarker = (id: number, x: number, y: number) => {
    setMarkers(m => m.map(p => p.id === id ? { ...p, x, y } : p));
  };

  return (
    <DemoLayout title="🖼️ Canvas Overlay" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="底圖" />
        <div className="control-group">
          <label>標記清單 ({markers.length})</label>
          <div style={{ maxHeight: 280, overflow: 'auto', fontSize: 13 }}>
            {markers.map(m => (
              <div key={m.id} style={{ padding: '4px 6px', borderBottom: '1px solid #e5e7eb' }}>
                #{m.id} — ({Math.round(m.x)}, {Math.round(m.y)})
              </div>
            ))}
          </div>
        </div>
        <div className="control-group"><button type="button" onClick={() => setMarkers([])}>清除全部</button></div>
        <div className="info-box">Konva Stage 疊在 HTML 背景圖片上方：點擊空白處新增標記、點擊標記可移除、亦可拖曳。</div>
      </>
    }>
      <div
        className="stage-wrapper"
        style={{
          position: 'relative',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <ResponsiveStage
          designWidth={720}
          designHeight={540}
          onClick={addMarker}
          onTap={addMarker}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Layer>
            {markers.map(m => (
              <Circle
                key={m.id}
                x={m.x}
                y={m.y}
                radius={14}
                fill="rgba(239,68,68,0.85)"
                stroke="#ffffff"
                strokeWidth={3}
                draggable
                onClick={(e) => { e.cancelBubble = true; removeMarker(m.id); }}
                onTap={(e) => { e.cancelBubble = true; removeMarker(m.id); }}
                onDragMove={(e) => moveMarker(m.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
