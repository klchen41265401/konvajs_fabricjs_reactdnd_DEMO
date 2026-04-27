import { useRef, useState } from 'react';
import { Layer, Image as KImage, Text, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

export default function Watermark() {
  const { src, FileInput } = useFileSource('https://picsum.photos/id/1015/720/540', 'image/*');
  const [img] = useImage(src, 'anonymous');
  const [text, setText] = useState('© CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState('#ffffff');
  const [angle, setAngle] = useState(-30);
  const [density, setDensity] = useState(140);
  const stageRef = useRef<Konva.Stage | null>(null);

  const exportPng = () => {
    if (!stageRef.current) return;
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'watermarked.png'; a.click();
  };

  const items: Array<{ x: number; y: number }> = [];
  for (let y = -100; y < 700; y += density) {
    for (let x = -200; x < 900; x += density * 1.6) {
      items.push({ x, y });
    }
  }

  return (
    <DemoLayout title="🖼️ Watermark" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="底圖" />
        <div className="control-group"><label>水印文字</label><input value={text} onChange={e => setText(e.target.value)} /></div>
        <div className="control-group"><label>透明度: {opacity.toFixed(2)}</label><input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e => setOpacity(+e.target.value)} /></div>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><label>角度: {angle}°</label><input type="range" min="-90" max="90" value={angle} onChange={e => setAngle(+e.target.value)} /></div>
        <div className="control-group"><label>密度: {density}</label><input type="range" min="60" max="260" value={density} onChange={e => setDensity(+e.target.value)} /></div>
        <div className="control-group"><button type="button" onClick={exportPng}>匯出 PNG</button></div>
        <div className="info-box">在圖片上加入重複旋轉的文字水印，可調整文字、顏色、透明度、角度和密度。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={540}>
          <Layer>
            {img && <KImage image={img} width={720} height={540} />}
            <Group
              clipFunc={(ctx) => { ctx.rect(0, 0, 720, 540); }}
            >
              {items.map((p, i) => (
                <Text
                  key={i}
                  x={p.x}
                  y={p.y}
                  text={text}
                  fontSize={22}
                  fontStyle="bold"
                  fill={color}
                  opacity={opacity}
                  rotation={angle}
                />
              ))}
            </Group>
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
