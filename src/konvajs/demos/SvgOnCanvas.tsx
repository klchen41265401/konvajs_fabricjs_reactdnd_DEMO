import { useEffect, useState } from 'react';
import { Layer, Path } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';
import useFileSource from '../../components/useFileSource';

interface SvgShape {
  id: string;
  label: string;
  data: string;
  color: string;
  x: number;
  y: number;
  scale: number;
}

const SHAPES: SvgShape[] = [
  {
    id: 'star',
    label: '⭐ 星星',
    data: 'M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z',
    color: '#fbc02d',
    x: 120,
    y: 180,
    scale: 2,
  },
  {
    id: 'heart',
    label: '❤️ 愛心',
    data: 'M 50 80 C 20 60 0 40 0 20 C 0 5 15 -5 30 5 C 40 10 45 20 50 30 C 55 20 60 10 70 5 C 85 -5 100 5 100 20 C 100 40 80 60 50 80 Z',
    color: '#e53935',
    x: 360,
    y: 200,
    scale: 1.8,
  },
  {
    id: 'arrow',
    label: '➡️ 箭頭',
    data: 'M 0 30 L 60 30 L 60 10 L 100 50 L 60 90 L 60 70 L 0 70 Z',
    color: '#1e88e5',
    x: 520,
    y: 220,
    scale: 1.6,
  },
];

export default function SvgOnCanvas() {
  const [visible, setVisible] = useState<Record<string, boolean>>({ star: true, heart: true, arrow: true, uploaded: true });
  const [colors, setColors] = useState<Record<string, string>>({ ...Object.fromEntries(SHAPES.map(s => [s.id, s.color])), uploaded: '#10b981' });
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const { src, filename, FileInput } = useFileSource('', '.svg,image/svg+xml');

  useEffect(() => {
    if (!filename) return;
    fetch(src)
      .then(r => r.text())
      .then(text => {
        try {
          const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
          const parserError = doc.querySelector('parsererror');
          if (parserError) throw new Error('SVG 解析失敗');
          const path = doc.querySelector('path');
          const d = path?.getAttribute('d');
          if (!d) throw new Error('找不到 <path d="...">');
          setUploadedPath(d);
        } catch (err) {
          alert(`無法解析 SVG: ${(err as Error).message}`);
          setUploadedPath(null);
        }
      })
      .catch(err => alert(`讀取 SVG 失敗: ${err.message}`));
  }, [src, filename]);

  return (
    <DemoLayout title="🖇️ SVG on Canvas" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <FileInput label="上傳 SVG 檔" />
        {SHAPES.map(s => (
          <div className="control-group" key={s.id}>
            <label><input type="checkbox" checked={visible[s.id]} onChange={e => setVisible(v => ({ ...v, [s.id]: e.target.checked }))} /> {s.label}</label>
            <input type="color" value={colors[s.id]} onChange={e => setColors(c => ({ ...c, [s.id]: e.target.value }))} />
          </div>
        ))}
        {uploadedPath && (
          <div className="control-group">
            <label><input type="checkbox" checked={!!visible.uploaded} onChange={e => setVisible(v => ({ ...v, uploaded: e.target.checked }))} /> 📤 已上傳 SVG</label>
            <input type="color" value={colors.uploaded} onChange={e => setColors(c => ({ ...c, uploaded: e.target.value }))} />
          </div>
        )}
        <div className="info-box">Konva.Path 接受 SVG path 的 d 字串，便能直接把 SVG 圖示繪到 Canvas 並享有旋轉、填色、拖曳等能力。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            {SHAPES.filter(s => visible[s.id]).map(s => (
              <Path
                key={s.id}
                x={s.x}
                y={s.y}
                data={s.data}
                fill={colors[s.id]}
                scaleX={s.scale}
                scaleY={s.scale}
                stroke="#333"
                strokeWidth={1}
                draggable
              />
            ))}
            {uploadedPath && visible.uploaded && (
              <Path
                key={`uploaded-${uploadedPath.length}`}
                x={300}
                y={250}
                data={uploadedPath}
                fill={colors.uploaded}
                stroke="#333"
                strokeWidth={1}
                draggable
              />
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
