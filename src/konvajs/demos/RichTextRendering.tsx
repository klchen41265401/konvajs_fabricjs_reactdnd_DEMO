import { useMemo, useState } from 'react';
import { Layer, Text } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Seg {
  text: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
}

export default function RichTextRendering() {
  const [segs, setSegs] = useState<Seg[]>([
    { text: 'Hello ', color: '#222' },
    { text: 'World', color: '#d32f2f', bold: true },
    { text: '!', color: '#1565c0', italic: true },
  ]);

  const fontSize = 48;
  const startX = 60;
  const startY = 140;

  // Measure each segment using canvas to stack horizontally
  const positioned = useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    let x = startX;
    return segs.map(s => {
      const style = `${s.italic ? 'italic ' : ''}${s.bold ? 'bold ' : ''}${fontSize}px Arial`;
      ctx.font = style;
      const w = ctx.measureText(s.text).width;
      const entry = { ...s, x, width: w };
      x += w;
      return entry;
    });
  }, [segs]);

  const updateSeg = (i: number, patch: Partial<Seg>) => {
    setSegs(list => list.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  };

  return (
    <DemoLayout title="📝 Rich Text Rendering" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        {segs.map((s, i) => (
          <div className="control-group" key={i}>
            <label>段落 {i + 1} {s.bold ? '(粗)' : ''}{s.italic ? '(斜)' : ''}</label>
            <textarea value={s.text} onChange={e => updateSeg(i, { text: e.target.value })} rows={2} />
            <input type="color" value={s.color} onChange={e => updateSeg(i, { color: e.target.value })} />
          </div>
        ))}
        <div className="info-box">Konva 原生 Text 不支援行內混合樣式。做法：拆成多個 Text 節點，用 measureText 計算寬度後依序在同一行堆疊。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={360}>
          <Layer>
            {positioned.map((p, i) => (
              <Text
                key={i}
                text={p.text}
                x={p.x}
                y={startY}
                fontSize={fontSize}
                fontFamily="Arial"
                fontStyle={`${p.italic ? 'italic' : ''} ${p.bold ? 'bold' : ''}`.trim() || 'normal'}
                fill={p.color}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
