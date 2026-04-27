import { useState } from 'react';
import { Layer, Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

export default function RotateFlipImage() {
  const { src, FileInput } = useFileSource('https://picsum.photos/id/237/480/320', 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

  return (
    <DemoLayout title="🖼️ Rotate & Flip Image" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="圖片" />
        <div className="control-group"><label>角度: {angle}°</label><input type="range" min="-180" max="180" value={angle} onChange={e => setAngle(+e.target.value)} /></div>
        <div className="control-group">
          <button type="button" onClick={() => setAngle(a => a - 90)}>↺ 90°</button>
          <button type="button" onClick={() => setAngle(a => a + 90)}>↻ 90°</button>
          <button type="button" onClick={() => setAngle(0)}>歸零</button>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => setFlipX(x => -x)}>⇆ 水平翻轉</button>
          <button type="button" onClick={() => setFlipY(y => -y)}>⇅ 垂直翻轉</button>
        </div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={640} designHeight={440}>
          <Layer>
            <Group x={320} y={220} rotation={angle} scaleX={flipX} scaleY={flipY}>
              {img && <KonvaImage image={img} width={480} height={320} offsetX={240} offsetY={160} />}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
