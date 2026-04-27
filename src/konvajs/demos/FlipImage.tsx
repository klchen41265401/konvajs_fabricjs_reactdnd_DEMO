import { useState } from 'react';
import { Layer, Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

export default function FlipImage() {
  const { src, FileInput } = useFileSource('https://picsum.photos/id/1018/480/320', 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

  const W = 480;
  const H = 320;

  return (
    <DemoLayout title="🔁 Flip Image" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="圖片" />
        <div className="control-group">
          <button type="button" onClick={() => setFlipX(x => -x)}>⇆ 水平翻轉</button>
          <button type="button" onClick={() => setFlipY(y => -y)}>⇅ 垂直翻轉</button>
          <button type="button" onClick={() => { setFlipX(1); setFlipY(1); }}>重置</button>
        </div>
        <div className="control-group">
          <label>目前狀態</label>
          <div>scaleX = {flipX}</div>
          <div>scaleY = {flipY}</div>
        </div>
        <div className="info-box">透過 scaleX / scaleY 乘以 -1 即可翻轉，搭配 offsetX / offsetY 將錨點設在圖片中心，翻轉時位置不會跑掉。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={440}>
          <Layer>
            <Group x={360} y={220} scaleX={flipX} scaleY={flipY}>
              {img && (
                <KonvaImage image={img} width={W} height={H} offsetX={W / 2} offsetY={H / 2} />
              )}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
