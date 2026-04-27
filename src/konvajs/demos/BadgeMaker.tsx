import { useState, useRef } from 'react';
import { Layer, Rect, Text, Circle, Image as KImage, Group } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

export default function BadgeMaker() {
  const [title, setTitle] = useState('KONVA');
  const [subtitle, setSubtitle] = useState('Badge Maker');
  const [bg, setBg] = useState('#22c55e');
  const [fg, setFg] = useState('#ffffff');
  const { src, FileInput } = useFileSource('https://i.pravatar.cc/240?img=12', 'image/*');
  const [img] = useImage(src, 'anonymous');
  const stageRef = useRef<Konva.Stage | null>(null);

  const save = () => {
    const url = stageRef.current!.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'badge.png'; a.click();
  };

  return (
    <DemoLayout title="🖼️ Badge Maker" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="頭像照片" />
        <div className="control-group"><label>標題</label><input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div className="control-group"><label>副標</label><input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></div>
        <div className="control-group"><label>底色</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} /></div>
        <div className="control-group"><label>文字色</label><input type="color" value={fg} onChange={e => setFg(e.target.value)} /></div>
        <div className="control-group"><button type="button" onClick={save}>匯出 PNG</button></div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={480} designHeight={400}>
          <Layer>
            <Rect width={480} height={400} fill="#fff" />
            <Circle x={240} y={200} radius={160} fill={bg} />
            <Circle x={240} y={200} radius={140} stroke={fg} strokeWidth={4} />
            {img && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.arc(240, 130, 50, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}
              >
                <KImage image={img} x={190} y={80} width={100} height={100} />
              </Group>
            )}
            <Text text={title} x={0} y={195} width={480} align="center" fontSize={44} fontStyle="bold" fill={fg} />
            <Text text={subtitle} x={0} y={250} width={480} align="center" fontSize={20} fill={fg} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
