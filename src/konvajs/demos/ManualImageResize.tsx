import { useState } from 'react';
import { Layer, Image as KImage, Circle, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

const W = 720;
const H = 540;
const IMG_URL = 'https://konvajs.org/assets/yoda.jpg';

const INITIAL = { x: 200, y: 120, w: 300, h: 300 };

export default function ManualImageResize() {
  const { src, FileInput } = useFileSource(IMG_URL, 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [box, setBox] = useState(INITIAL);

  const corners = [
    { key: 'tl', x: box.x, y: box.y },
    { key: 'tr', x: box.x + box.w, y: box.y },
    { key: 'br', x: box.x + box.w, y: box.y + box.h },
    { key: 'bl', x: box.x, y: box.y + box.h },
  ];

  const onDragCorner = (key: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const mx = e.target.x();
    const my = e.target.y();
    setBox(prev => {
      let { x, y, w, h } = prev;
      const right = x + w;
      const bottom = y + h;
      if (key === 'tl') {
        const nw = right - mx;
        const nh = bottom - my;
        if (nw < 20 || nh < 20) return prev;
        x = mx; y = my; w = nw; h = nh;
      } else if (key === 'tr') {
        const nw = mx - x;
        const nh = bottom - my;
        if (nw < 20 || nh < 20) return prev;
        y = my; w = nw; h = nh;
      } else if (key === 'br') {
        const nw = mx - x;
        const nh = my - y;
        if (nw < 20 || nh < 20) return prev;
        w = nw; h = nh;
      } else if (key === 'bl') {
        const nw = right - mx;
        const nh = my - y;
        if (nw < 20 || nh < 20) return prev;
        x = mx; w = nw; h = nh;
      }
      return { x, y, w, h };
    });
  };

  return (
    <DemoLayout title="🖼️ Manual Image Resize" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="圖片" />
        <div className="control-group">
          <button type="button" onClick={() => setBox(INITIAL)}>重設</button>
        </div>
        <div className="control-group" style={{ fontSize: 13 }}>
          x: {box.x.toFixed(0)}, y: {box.y.toFixed(0)}<br />
          w: {box.w.toFixed(0)}, h: {box.h.toFixed(0)}
        </div>
        <div className="info-box">不使用 Transformer，改以 4 個角落 Circle 作為自訂把手，拖曳時直接修改 image 的 x/y/width/height。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f1f5f9" listening={false} />
            {img && (
              <KImage
                image={img}
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
              />
            )}
            <Rect x={box.x} y={box.y} width={box.w} height={box.h} stroke="#3b82f6" strokeWidth={2} listening={false} />
            {corners.map(c => (
              <Circle
                key={c.key}
                x={c.x}
                y={c.y}
                radius={8}
                fill="#fff"
                stroke="#3b82f6"
                strokeWidth={2}
                draggable
                onDragMove={(e) => onDragCorner(c.key, e)}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
