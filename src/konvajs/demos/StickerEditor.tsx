import { useEffect, useRef, useState } from 'react';
import { Layer, Image as KImage, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Sticker = { id: number; emoji: string; x: number; y: number; scale: number; rotation: number };

const PALETTE = ['😀', '🎉', '⭐️', '🔥', '💧', '🌟', '🐶', '🎈'];

export default function StickerEditor() {
  const [img] = useImage('https://picsum.photos/id/1062/720/540', 'anonymous');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  const addSticker = (emoji: string) => {
    const s: Sticker = { id: nextId, emoji, x: 280 + Math.random() * 120, y: 200 + Math.random() * 120, scale: 1, rotation: 0 };
    setStickers(arr => [...arr, s]);
    setNextId(n => n + 1);
    setSelectedId(s.id);
  };

  useEffect(() => {
    if (!trRef.current || !layerRef.current) return;
    if (selectedId == null) { trRef.current.nodes([]); trRef.current.getLayer()?.batchDraw(); return; }
    const node = layerRef.current.findOne('#sticker-' + selectedId);
    if (node) {
      trRef.current.nodes([node]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, stickers]);

  const exportPng = () => {
    if (!stageRef.current) return;
    const prev = selectedId;
    trRef.current?.nodes([]);
    trRef.current?.getLayer()?.batchDraw();
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'stickers.png'; a.click();
    if (prev != null && layerRef.current && trRef.current) {
      const node = layerRef.current.findOne('#sticker-' + prev);
      if (node) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw(); }
    }
  };

  const handleBgClick = (e: any) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  return (
    <DemoLayout title="🖼️ Sticker Editor" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>貼圖調色盤</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {PALETTE.map(e => (
              <button type="button" key={e} onClick={() => addSticker(e)} style={{ fontSize: 22, padding: '6px 0' }}>{e}</button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => { if (selectedId != null) { setStickers(s => s.filter(x => x.id !== selectedId)); setSelectedId(null); } }}>刪除選取貼圖</button>
        </div>
        <div className="control-group"><button type="button" onClick={exportPng}>匯出 PNG</button></div>
        <div className="info-box">點選左側表情符號加入貼圖，選中後可用 Transformer 進行縮放與旋轉，最後匯出 PNG。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={540} onMouseDown={handleBgClick} onTouchStart={handleBgClick}>
          <Layer ref={layerRef}>
            {img && <KImage image={img} width={720} height={540} />}
            {stickers.map(s => (
              <Text
                key={s.id}
                id={'sticker-' + s.id}
                text={s.emoji}
                x={s.x}
                y={s.y}
                fontSize={64}
                scaleX={s.scale}
                scaleY={s.scale}
                rotation={s.rotation}
                draggable
                onClick={() => setSelectedId(s.id)}
                onTap={() => setSelectedId(s.id)}
                onDragEnd={(e) => {
                  setStickers(arr => arr.map(x => x.id === s.id ? { ...x, x: e.target.x(), y: e.target.y() } : x));
                }}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Text;
                  setStickers(arr => arr.map(x => x.id === s.id ? {
                    ...x,
                    x: node.x(),
                    y: node.y(),
                    scale: node.scaleX(),
                    rotation: node.rotation(),
                  } : x));
                }}
              />
            ))}
            <Transformer ref={trRef} rotateEnabled={true} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
