import { useState } from 'react';
import { Layer, Rect, Image as KonvaImage, Group, Text } from 'react-konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

type Mode = 'contain' | 'cover';
type Position = 'center' | 'left' | 'right' | 'top' | 'bottom';

export default function ImageScaleToFit() {
  const { src, FileInput } = useFileSource('https://picsum.photos/id/1015/800/600', 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [mode, setMode] = useState<Mode>('contain');
  const [frameW, setFrameW] = useState(400);
  const [frameH, setFrameH] = useState(300);
  const [position, setPosition] = useState<Position>('center');

  let drawW = 0, drawH = 0, offsetX = 0, offsetY = 0;
  if (img) {
    const iw = img.width;
    const ih = img.height;
    const frameRatio = frameW / frameH;
    const imgRatio = iw / ih;

    if (mode === 'contain') {
      if (imgRatio > frameRatio) {
        drawW = frameW;
        drawH = frameW / imgRatio;
      } else {
        drawH = frameH;
        drawW = frameH * imgRatio;
      }
    } else {
      if (imgRatio > frameRatio) {
        drawH = frameH;
        drawW = frameH * imgRatio;
      } else {
        drawW = frameW;
        drawH = frameW / imgRatio;
      }
    }

    switch (position) {
      case 'center':
        offsetX = (frameW - drawW) / 2;
        offsetY = (frameH - drawH) / 2;
        break;
      case 'left':
        offsetX = 0;
        offsetY = (frameH - drawH) / 2;
        break;
      case 'right':
        offsetX = frameW - drawW;
        offsetY = (frameH - drawH) / 2;
        break;
      case 'top':
        offsetX = (frameW - drawW) / 2;
        offsetY = 0;
        break;
      case 'bottom':
        offsetX = (frameW - drawW) / 2;
        offsetY = frameH - drawH;
        break;
    }
  }

  const stageW = 720;
  const stageH = 480;
  const frameX = (stageW - frameW) / 2;
  const frameY = (stageH - frameH) / 2;

  return (
    <DemoLayout title="🖼️ Image Scale to Fit" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="圖片" />
        <div className="control-group">
          <label>模式</label>
          <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
            <option value="contain">contain</option>
            <option value="cover">cover</option>
          </select>
        </div>
        <div className="control-group">
          <label>框寬: {frameW}px</label>
          <input type="range" min="120" max="640" value={frameW} onChange={e => setFrameW(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>框高: {frameH}px</label>
          <input type="range" min="80" max="440" value={frameH} onChange={e => setFrameH(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>對齊位置</label>
          <select value={position} onChange={e => setPosition(e.target.value as Position)}>
            <option value="center">center</option>
            <option value="left">left</option>
            <option value="right">right</option>
            <option value="top">top</option>
            <option value="bottom">bottom</option>
          </select>
        </div>
        <div className="info-box">模擬 CSS object-fit contain / cover 行為：比較圖片與框的寬高比，計算繪製尺寸後依 object-position 對齊。Group 配合 clipFunc 裁切超出框的部分。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={stageW} designHeight={stageH}>
          <Layer>
            <Rect x={0} y={0} width={stageW} height={stageH} fill="#1f2937" />
            <Group
              x={frameX}
              y={frameY}
              clipX={0}
              clipY={0}
              clipWidth={frameW}
              clipHeight={frameH}
            >
              <Rect x={0} y={0} width={frameW} height={frameH} fill="#0b1220" />
              {img && (
                <KonvaImage image={img} x={offsetX} y={offsetY} width={drawW} height={drawH} />
              )}
            </Group>
            <Rect x={frameX} y={frameY} width={frameW} height={frameH} stroke="#fbbf24" strokeWidth={3} />
            <Text x={frameX} y={frameY - 24} text={`${frameW}×${frameH} · ${mode} · ${position}`} fill="#fbbf24" fontSize={14} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
