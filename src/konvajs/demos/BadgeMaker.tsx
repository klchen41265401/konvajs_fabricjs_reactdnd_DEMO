import { useState, useRef } from 'react';
import { Layer, Rect, Text, Circle } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function BadgeMaker() {
  const [title, setTitle] = useState('KONVA');
  const [subtitle, setSubtitle] = useState('Badge Maker');
  const [bg, setBg] = useState('#22c55e');
  const [fg, setFg] = useState('#ffffff');
  const stageRef = useRef<Konva.Stage | null>(null);

  const save = () => {
    const url = stageRef.current!.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'badge.png'; a.click();
  };

  return (
    <DemoLayout title="🖼️ Badge Maker" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
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
            <Text text={title} x={0} y={150} width={480} align="center" fontSize={52} fontStyle="bold" fill={fg} />
            <Text text={subtitle} x={0} y={220} width={480} align="center" fontSize={22} fill={fg} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
