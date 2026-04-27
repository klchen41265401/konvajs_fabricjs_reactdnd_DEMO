import { useRef, useState } from 'react';
import { Layer, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function SignaturePad() {
  const [lines, setLines] = useState<{ pts: number[]; color: string; width: number }[]>([]);
  const [color, setColor] = useState('#0f172a');
  const [width, setWidth] = useState(3);
  const drawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  const down = (e: any) => {
    drawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = pos.x / stage.scaleX(), y = pos.y / stage.scaleY();
    setLines(l => [...l, { pts: [x, y], color, width }]);
  };
  const move = (e: any) => {
    if (!drawing.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = pos.x / stage.scaleX(), y = pos.y / stage.scaleY();
    setLines(l => l.map((ln, i) => i === l.length - 1 ? { ...ln, pts: [...ln.pts, x, y] } : ln));
  };
  const up = () => { drawing.current = false; };
  const save = () => {
    const url = stageRef.current!.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'signature.png'; a.click();
  };

  return (
    <DemoLayout title="🖼️ Signature Pad" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><label>粗細: {width}</label><input type="range" min="1" max="12" value={width} onChange={e => setWidth(+e.target.value)} /></div>
        <div className="control-group"><button type="button" onClick={() => setLines([])}>清除</button><button type="button" onClick={save}>儲存 PNG</button></div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={640} designHeight={360} onMouseDown={down} onMouseMove={move} onMouseUp={up} onTouchStart={down} onTouchMove={move} onTouchEnd={up}>
          <Layer>
            {lines.map((ln, i) => <Line key={i} points={ln.pts} stroke={ln.color} strokeWidth={ln.width} lineCap="round" lineJoin="round" tension={0.5} />)}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
