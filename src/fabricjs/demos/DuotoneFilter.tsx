import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const hexToRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function DuotoneFilter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<fabric.Image | null>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dark, setDark] = useState('#1e3a8a');
  const [light, setLight] = useState('#fde68a');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;

    (fabric.Image.filters as any).Duotone = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
      type: 'Duotone',
      dark: [30, 58, 138],
      light: [253, 230, 138],
      initialize(opt: { dark?: [number, number, number]; light?: [number, number, number] } = {}) {
        this.dark = opt.dark || this.dark; this.light = opt.light || this.light;
      },
      applyTo2d(o: { imageData: ImageData }) {
        const d = o.imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
          d[i] = this.dark[0] + (this.light[0] - this.dark[0]) * gray;
          d[i + 1] = this.dark[1] + (this.light[1] - this.dark[1]) * gray;
          d[i + 2] = this.dark[2] + (this.light[2] - this.dark[2]) * gray;
        }
      }
    });

    fabric.Image.fromURL('https://picsum.photos/id/177/640/420', img => {
      img.set({ left: 20, top: 20, selectable: false });
      imgRef.current = img;
      img.filters = [new ((fabric.Image.filters as any).Duotone)({ dark: hexToRgb(dark), light: hexToRgb(light) })];
      img.applyFilters();
      canvas.add(img);
    }, { crossOrigin: 'anonymous' });

    return () => { delete (fabric.Image.filters as any).Duotone; canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const img = imgRef.current; if (!img) return;
    img.filters = [new ((fabric.Image.filters as any).Duotone)({ dark: hexToRgb(dark), light: hexToRgb(light) })];
    img.applyFilters();
    fabRef.current?.requestRenderAll();
  }, [dark, light]);

  useFabricResponsive(wrapperRef, fabRef, 680, 460);

  return (
    <DemoLayout title="🎨 Duotone filter" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>雙色調</h3>
        <div className="control-group"><label>暗部</label><input type="color" value={dark} onChange={e => setDark(e.target.value)} /></div>
        <div className="control-group"><label>亮部</label><input type="color" value={light} onChange={e => setLight(e.target.value)} /></div>
        <div className="info-box">先將像素灰階化，再線性映射到暗/亮兩色之間。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={680} height={460} /></div>
    </DemoLayout>
  );
}
