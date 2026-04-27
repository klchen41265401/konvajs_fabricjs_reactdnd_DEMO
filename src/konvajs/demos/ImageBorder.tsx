import { useState } from 'react';
import { Layer, Image as KImage, Rect } from 'react-konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

const W = 720;
const H = 540;
const IMG_URL = 'https://konvajs.org/assets/yoda.jpg';

export default function ImageBorder() {
  const { src, FileInput } = useFileSource(IMG_URL, 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [color, setColor] = useState('#ef4444');
  const [width, setWidth] = useState(8);
  const [dash, setDash] = useState(false);

  const imgW = 360;
  const imgH = 360;
  const x = (W - imgW) / 2;
  const y = (H - imgH) / 2;

  return (
    <DemoLayout title="🖼️ Image Border" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="圖片" />
        <div className="control-group">
          <label>邊框顏色</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="control-group">
          <label>邊框寬度: {width}</label>
          <input type="range" min="0" max="40" step="1" value={width} onChange={e => setWidth(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>
            <input type="checkbox" checked={dash} onChange={e => setDash(e.target.checked)} /> 虛線
          </label>
        </div>
        <div className="info-box">影像外加一個可調顏色、寬度與虛實樣式的 Rect 作為邊框，展示 Konva stroke 相關屬性。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            {img && <KImage image={img} x={x} y={y} width={imgW} height={imgH} />}
            <Rect
              x={x}
              y={y}
              width={imgW}
              height={imgH}
              stroke={color}
              strokeWidth={width}
              dash={dash ? [12, 8] : undefined}
              listening={false}
            />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
