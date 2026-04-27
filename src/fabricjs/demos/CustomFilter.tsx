import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function CustomFilter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<fabric.Image | null>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [intensity, setIntensity] = useState(0.5);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;

    (fabric.Image.filters as any).Redify = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
      type: 'Redify',
      intensity: 0.5,
      initialize(options: { intensity?: number } = {}) { this.intensity = options.intensity ?? 0.5; },
      applyTo2d(options: { imageData: ImageData }) {
        const data = options.imageData.data;
        const k = 1 - this.intensity;
        for (let i = 0; i < data.length; i += 4) {
          data[i + 1] = data[i + 1] * k;
          data[i + 2] = data[i + 2] * k;
        }
      }
    });

    fabric.Image.fromURL('https://picsum.photos/id/1025/600/420', img => {
      img.scaleToWidth(600);
      img.set({ left: 40, top: 40, selectable: false });
      img.filters = [new ((fabric.Image.filters as any).Redify)({ intensity: 0.5 })];
      img.applyFilters();
      imgRef.current = img;
      canvas.add(img);
    }, { crossOrigin: 'anonymous' });

    return () => { delete (fabric.Image.filters as any).Redify; canvas.dispose(); };
  }, []);

  useEffect(() => {
    const img = imgRef.current; if (!img) return;
    img.filters = [new ((fabric.Image.filters as any).Redify)({ intensity })];
    img.applyFilters();
    fabRef.current?.requestRenderAll();
  }, [intensity]);

  useFabricResponsive(wrapperRef, fabRef, 680, 500);

  return (
    <DemoLayout title="🎨 Custom filter (Redify)" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>強度</h3>
        <div className="control-group">
          <label>Intensity: {intensity.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={intensity} onChange={e => setIntensity(+e.target.value)} />
        </div>
        <div className="info-box">以 <strong>fabric.util.createClass</strong> 擴充 <strong>BaseFilter</strong> 實作自訂濾鏡。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={680} height={500} /></div>
    </DemoLayout>
  );
}
