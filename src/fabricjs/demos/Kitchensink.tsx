import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

type Tab = 'add' | 'object' | 'text' | 'canvas' | 'filter' | 'json';

export default function Kitchensink() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<Tab>('add');
  const [, force] = useState(0);
  const rerender = () => force(n => n + 1);
  const [bg, setBg] = useState('#ffffff');
  const [drawMode, setDrawMode] = useState(false);
  const [brushSize, setBrushSize] = useState(6);
  const [brushColor, setBrushColor] = useState('#0ea5e9');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, { backgroundColor: bg });
    fabRef.current = canvas;
    canvas.on('selection:created', rerender);
    canvas.on('selection:updated', rerender);
    canvas.on('selection:cleared', rerender);
    canvas.on('object:modified', rerender);
    return () => { canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 900, 600);

  useEffect(() => {
    const c = fabRef.current; if (!c) return;
    c.setBackgroundColor(bg, () => c.requestRenderAll());
  }, [bg]);

  useEffect(() => {
    const c = fabRef.current; if (!c) return;
    c.isDrawingMode = drawMode;
    if (drawMode) {
      const b = new fabric.PencilBrush(c);
      b.color = brushColor;
      b.width = brushSize;
      c.freeDrawingBrush = b;
    }
  }, [drawMode, brushSize, brushColor]);

  const c = fabRef.current;
  const active = c?.getActiveObject();

  const add = (maker: () => fabric.Object) => {
    if (!c) return;
    const o = maker();
    c.add(o);
    c.setActiveObject(o);
    c.requestRenderAll();
    rerender();
  };
  const rnd = () => ({ left: 120 + Math.random() * 400, top: 80 + Math.random() * 300 });

  const addRect = () => add(() => new fabric.Rect({ ...rnd(), width: 120, height: 80, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }));
  const addCircle = () => add(() => new fabric.Circle({ ...rnd(), radius: 50, fill: '#38bdf8' }));
  const addTri = () => add(() => new fabric.Triangle({ ...rnd(), width: 100, height: 100, fill: '#a78bfa' }));
  const addLine = () => add(() => new fabric.Line([50, 50, 200, 50], { ...rnd(), stroke: '#0f172a', strokeWidth: 4 }));
  const addPoly = () => add(() => {
    const pts: { x: number; y: number }[] = [];
    const sides = 6;
    for (let i = 0; i < sides; i++) pts.push({ x: 50 * Math.cos((i / sides) * Math.PI * 2), y: 50 * Math.sin((i / sides) * Math.PI * 2) });
    return new fabric.Polygon(pts, { ...rnd(), fill: '#4ade80' });
  });
  const addStar = () => add(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 55 : 25;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    return new fabric.Polygon(pts, { ...rnd(), fill: '#facc15' });
  });
  const addText = () => add(() => new fabric.IText('可編輯文字', { ...rnd(), fontSize: 36, fill: '#0f172a', fontFamily: 'Arial' }));
  const addTextbox = () => add(() => new fabric.Textbox('這是一個可自動換行的 textbox。', { ...rnd(), width: 240, fontSize: 20, fill: '#0f172a' }));
  const addImage = () => {
    if (!c) return;
    const url = `https://picsum.photos/seed/ks${Math.floor(Math.random() * 1000)}/300/200`;
    fabric.Image.fromURL(url, img => {
      img.set({ left: 120 + Math.random() * 200, top: 80 + Math.random() * 200, scaleX: 0.7, scaleY: 0.7 });
      c.add(img);
      c.setActiveObject(img);
      c.requestRenderAll();
      rerender();
    }, { crossOrigin: 'anonymous' });
  };
  const addGradient = () => {
    if (!c) return;
    const rect = new fabric.Rect({ ...rnd(), width: 220, height: 140 });
    rect.set('fill', new fabric.Gradient({
      type: 'linear', coords: { x1: 0, y1: 0, x2: 220, y2: 140 },
      colorStops: [{ offset: 0, color: '#ec4899' }, { offset: 1, color: '#38bdf8' }]
    }));
    c.add(rect); c.setActiveObject(rect); c.requestRenderAll(); rerender();
  };
  const loadSvg = () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><polygon points="60,5 73,45 115,45 81,70 93,110 60,85 27,110 39,70 5,45 47,45" fill="#f59e0b" stroke="#0f172a" stroke-width="2"/></svg>';
    fabric.loadSVGFromString(svg, (objects, options) => {
      const group = fabric.util.groupSVGElements(objects, options);
      group.set({ left: 120 + Math.random() * 300, top: 100 + Math.random() * 200 });
      c?.add(group); c?.setActiveObject(group); c?.requestRenderAll(); rerender();
    });
  };

  const del = () => {
    if (!c) return;
    c.getActiveObjects().forEach(o => c.remove(o));
    c.discardActiveObject();
    c.requestRenderAll();
    rerender();
  };
  const dup = () => {
    if (!c || !active) return;
    active.clone((clone: fabric.Object) => {
      clone.set({ left: (active.left || 0) + 20, top: (active.top || 0) + 20 });
      c.add(clone);
      c.setActiveObject(clone);
      c.requestRenderAll();
      rerender();
    });
  };
  const group = () => {
    if (!c) return;
    const sel = c.getActiveObject();
    if (sel && sel.type === 'activeSelection') {
      (sel as fabric.ActiveSelection).toGroup();
      c.requestRenderAll();
      rerender();
    }
  };
  const ungroup = () => {
    if (!c) return;
    const sel = c.getActiveObject();
    if (sel && sel.type === 'group') {
      (sel as fabric.Group).toActiveSelection();
      c.requestRenderAll();
      rerender();
    }
  };

  const exportJson = () => {
    if (!c) return;
    const s = JSON.stringify(c.toJSON(), null, 2);
    const blob = new Blob([s], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'canvas.json'; a.click();
  };
  const importJson = (text: string) => {
    if (!c) return;
    c.loadFromJSON(text, () => { c.requestRenderAll(); rerender(); });
  };
  const exportPng = () => {
    if (!c) return;
    const url = c.toDataURL({ format: 'png', multiplier: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'canvas.png'; a.click();
  };
  const exportSvg = () => {
    if (!c) return;
    const svg = c.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'canvas.svg'; a.click();
  };

  const applyFilter = (filterName: string) => {
    if (!c) return;
    const img = c.getActiveObject() as fabric.Image;
    if (!img || img.type !== 'image') return alert('請先選取一張圖片');
    img.filters = img.filters || [];
    const F = fabric.Image.filters as any;
    const add: fabric.IBaseFilter = filterName === 'Grayscale' ? new F.Grayscale() :
      filterName === 'Invert' ? new F.Invert() :
      filterName === 'Sepia' ? new F.Sepia() :
      filterName === 'Brightness' ? new F.Brightness({ brightness: 0.2 }) :
      filterName === 'Contrast' ? new F.Contrast({ contrast: 0.3 }) :
      filterName === 'Blur' ? new F.Blur({ blur: 0.2 }) :
      new F.Pixelate({ blocksize: 8 });
    img.filters.push(add);
    img.applyFilters();
    c.requestRenderAll();
    rerender();
  };
  const clearFilters = () => {
    const img = c?.getActiveObject() as fabric.Image;
    if (!img || img.type !== 'image') return;
    img.filters = []; img.applyFilters(); c?.requestRenderAll(); rerender();
  };

  const setProp = (key: string, value: unknown) => {
    if (!active || !c) return;
    active.set(key as keyof fabric.Object, value as never);
    active.setCoords();
    c.requestRenderAll();
    rerender();
  };

  const sidebar = (
    <>
      <div className="control-group tab-row">
        {(['add', 'object', 'text', 'canvas', 'filter', 'json'] as Tab[]).map(t => (
          <button type="button" key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'add' && <>
        <h3>新增物件</h3>
        <div className="control-group">
          <button onClick={addRect}>矩形</button>
          <button onClick={addCircle}>圓</button>
          <button onClick={addTri}>三角</button>
          <button onClick={addLine}>線</button>
          <button onClick={addPoly}>六邊形</button>
          <button onClick={addStar}>星形</button>
          <button onClick={addGradient}>漸層矩形</button>
          <button onClick={loadSvg}>載入 SVG</button>
          <button onClick={addText}>IText</button>
          <button onClick={addTextbox}>Textbox</button>
          <button onClick={addImage}>載入圖片</button>
        </div>
        <h3>畫筆</h3>
        <div className="control-group">
          <label><input type="checkbox" checked={drawMode} onChange={e => setDrawMode(e.target.checked)} /> 自由繪圖模式</label>
        </div>
        <div className="control-group"><label>筆刷色</label><input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} /></div>
        <div className="control-group"><label>筆刷粗細: {brushSize}</label><input type="range" min="1" max="40" value={brushSize} onChange={e => setBrushSize(+e.target.value)} /></div>
      </>}

      {tab === 'object' && <>
        <h3>物件屬性</h3>
        {!active && <div className="info-box">先選取一個物件。</div>}
        {active && <>
          <div className="control-group"><label>Fill</label><input type="color" value={(active.fill as string) || '#000000'} onChange={e => setProp('fill', e.target.value)} /></div>
          <div className="control-group"><label>Stroke</label><input type="color" value={(active.stroke as string) || '#000000'} onChange={e => setProp('stroke', e.target.value)} /></div>
          <div className="control-group"><label>Stroke width: {active.strokeWidth || 0}</label><input type="range" min="0" max="20" value={active.strokeWidth || 0} onChange={e => setProp('strokeWidth', +e.target.value)} /></div>
          <div className="control-group"><label>Opacity: {(active.opacity ?? 1).toFixed(2)}</label><input type="range" min="0" max="1" step="0.01" value={active.opacity ?? 1} onChange={e => setProp('opacity', +e.target.value)} /></div>
          <div className="control-group"><label>Angle: {Math.round(active.angle || 0)}°</label><input type="range" min="-180" max="180" value={active.angle || 0} onChange={e => setProp('angle', +e.target.value)} /></div>
          <h3>圖層</h3>
          <div className="control-group">
            <button onClick={() => { c?.bringToFront(active); c?.requestRenderAll(); }}>Bring to front</button>
            <button onClick={() => { c?.sendToBack(active); c?.requestRenderAll(); }}>Send to back</button>
            <button onClick={() => { c?.bringForward(active); c?.requestRenderAll(); }}>Forward</button>
            <button onClick={() => { c?.sendBackwards(active); c?.requestRenderAll(); }}>Backward</button>
          </div>
          <h3>動作</h3>
          <div className="control-group">
            <button onClick={dup}>複製</button>
            <button onClick={del}>刪除</button>
            <button onClick={group}>群組</button>
            <button onClick={ungroup}>解除群組</button>
          </div>
          <h3>鎖定</h3>
          <div className="control-group">
            <label><input type="checkbox" checked={!!active.lockMovementX} onChange={e => setProp('lockMovementX', e.target.checked)} /> 鎖 X 移動</label>
            <label><input type="checkbox" checked={!!active.lockMovementY} onChange={e => setProp('lockMovementY', e.target.checked)} /> 鎖 Y 移動</label>
            <label><input type="checkbox" checked={!!active.lockScalingX} onChange={e => setProp('lockScalingX', e.target.checked)} /> 鎖 X 縮放</label>
            <label><input type="checkbox" checked={!!active.lockScalingY} onChange={e => setProp('lockScalingY', e.target.checked)} /> 鎖 Y 縮放</label>
            <label><input type="checkbox" checked={!!active.lockRotation} onChange={e => setProp('lockRotation', e.target.checked)} /> 鎖旋轉</label>
          </div>
        </>}
      </>}

      {tab === 'text' && <>
        <h3>文字屬性</h3>
        {!active || !('text' in active) ? <div className="info-box">選取一個 IText/Textbox 物件。</div> : <>
          <div className="control-group"><label>內容</label><textarea rows={3} value={(active as fabric.IText).text || ''} onChange={e => setProp('text', e.target.value)} /></div>
          <div className="control-group"><label>字型</label>
            <select value={(active as fabric.IText).fontFamily || 'Arial'} onChange={e => setProp('fontFamily', e.target.value)}>
              {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Impact', 'Comic Sans MS', 'Helvetica'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="control-group"><label>字型大小: {(active as fabric.IText).fontSize}</label><input type="range" min="8" max="120" value={(active as fabric.IText).fontSize || 20} onChange={e => setProp('fontSize', +e.target.value)} /></div>
          <div className="control-group"><label>行高: {((active as fabric.IText).lineHeight ?? 1).toFixed(2)}</label><input type="range" min="0.5" max="3" step="0.05" value={(active as fabric.IText).lineHeight || 1} onChange={e => setProp('lineHeight', +e.target.value)} /></div>
          <div className="control-group"><label>字距: {(active as fabric.IText).charSpacing || 0}</label><input type="range" min="-200" max="800" value={(active as fabric.IText).charSpacing || 0} onChange={e => setProp('charSpacing', +e.target.value)} /></div>
          <div className="control-group"><label>對齊</label>
            {(['left', 'center', 'right', 'justify'] as const).map(a => (
              <button key={a} className={(active as fabric.IText).textAlign === a ? 'active' : ''} onClick={() => setProp('textAlign', a)}>{a}</button>
            ))}
          </div>
          <div className="control-group">
            <button className={(active as fabric.IText).fontWeight === 'bold' ? 'active' : ''} onClick={() => setProp('fontWeight', (active as fabric.IText).fontWeight === 'bold' ? 'normal' : 'bold')}>B</button>
            <button className={(active as fabric.IText).fontStyle === 'italic' ? 'active' : ''} onClick={() => setProp('fontStyle', (active as fabric.IText).fontStyle === 'italic' ? 'normal' : 'italic')}>I</button>
            <button className={(active as fabric.IText).underline ? 'active' : ''} onClick={() => setProp('underline', !(active as fabric.IText).underline)}>U</button>
            <button className={(active as fabric.IText).linethrough ? 'active' : ''} onClick={() => setProp('linethrough', !(active as fabric.IText).linethrough)}>S</button>
          </div>
        </>}
      </>}

      {tab === 'canvas' && <>
        <h3>畫布</h3>
        <div className="control-group"><label>背景</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} /></div>
        <div className="control-group">
          <button onClick={() => { c?.clear(); c?.setBackgroundColor(bg, () => c?.requestRenderAll()); rerender(); }}>清空畫布</button>
          <button onClick={exportPng}>匯出 PNG</button>
          <button onClick={exportSvg}>匯出 SVG</button>
        </div>
      </>}

      {tab === 'filter' && <>
        <h3>圖片濾鏡</h3>
        <div className="info-box">先選取一張圖片再按濾鏡。</div>
        <div className="control-group">
          {['Grayscale', 'Invert', 'Sepia', 'Brightness', 'Contrast', 'Blur', 'Pixelate'].map(f => (
            <button key={f} onClick={() => applyFilter(f)}>{f}</button>
          ))}
          <button onClick={clearFilters}>清除濾鏡</button>
        </div>
      </>}

      {tab === 'json' && <>
        <h3>JSON 匯入/匯出</h3>
        <div className="control-group">
          <button onClick={exportJson}>下載 JSON</button>
          <button onClick={() => {
            const text = prompt('貼上 JSON 字串：') || '';
            if (text.trim()) importJson(text);
          }}>貼上 JSON 載入</button>
        </div>
        <div className="info-box">所有物件可序列化成 JSON，支援跨頁面/跨檔案還原。</div>
      </>}

      <div className="info-box"><strong>Kitchensink</strong> — Fabric.js 官方全功能 Demo 的 React 版本，類似 Canva 的自由創作編輯器。</div>
    </>
  );

  return (
    <DemoLayout title="🎨 Kitchensink (Canva-like editor)" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={sidebar}>
      <div className="stage-wrapper" ref={wrapperRef}>
        <canvas ref={canvasRef} width={900} height={600} />
      </div>
    </DemoLayout>
  );
}
