import { useEffect, useState } from 'react';
import { Layer, Text, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const FONTS = [
  { name: 'Bungee', query: 'Bungee' },
  { name: 'Pacifico', query: 'Pacifico' },
  { name: 'Press Start 2P', query: 'Press+Start+2P' },
];

export default function CustomFont() {
  const [font, setFont] = useState(FONTS[0].name);
  const [text, setText] = useState('Hello Konva!');
  const [size, setSize] = useState(56);
  const [color, setColor] = useState('#111827');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const href = `https://fonts.googleapis.com/css2?${FONTS.map(f => `family=${f.query}`).join('&')}&display=swap`;
    if (!document.querySelector(`link[data-konva-font="custom-font-demo"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-konva-font', 'custom-font-demo');
      document.head.appendChild(link);
    }
    // Force re-render after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => setLoaded(true));
    } else {
      setTimeout(() => setLoaded(true), 800);
    }
  }, []);

  useEffect(() => {
    // Trigger redraw whenever font changes by toggling state
    if (loaded && document.fonts) {
      document.fonts.load(`${size}px "${font}"`).then(() => setLoaded(l => !l ? true : l));
    }
  }, [font, size, loaded]);

  return (
    <DemoLayout title="🔤 Custom Font" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>字體</label>
          <select value={font} onChange={e => setFont(e.target.value)}>
            {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>文字內容</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div className="control-group">
          <label>字體大小: {size}px</label>
          <input type="range" min="12" max="120" value={size} onChange={e => setSize(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>顏色</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="info-box">透過在 useEffect 注入 Google Fonts link 標籤，待字體載入後再套用到 Konva Text 的 fontFamily 屬性。由於 Konva 內部使用 canvas，需要確保字體已載入才能正確繪製。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={440}>
          <Layer>
            <Rect x={0} y={0} width={720} height={440} fill="#f9fafb" />
            <Text
              x={40}
              y={180}
              width={640}
              align="center"
              text={text}
              fontSize={size}
              fontFamily={font}
              fill={color}
              key={`${font}-${loaded}`}
            />
            <Text x={20} y={410} text={`fontFamily: ${font}`} fontSize={14} fill="#6b7280" />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
