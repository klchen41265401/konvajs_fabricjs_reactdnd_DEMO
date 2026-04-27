import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const DEMO_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export default function VideoElement() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const video = document.createElement('video');
    video.src = DEMO_VIDEO;
    video.crossOrigin = 'anonymous';
    video.loop = true; video.muted = true; video.playsInline = true;
    video.width = 640; video.height = 360;
    videoRef.current = video;

    video.addEventListener('loadedmetadata', () => {
      const fv = new fabric.Image(video, { left: 20, top: 20, objectCaching: false });
      fv.scaleToWidth(640);
      (fv as any).getElement = () => video;
      canvas.add(fv);
      fabric.util.requestAnimFrame(function render() {
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
      });
    });
    return () => { video.pause(); canvas.dispose(); };
  }, []);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (playing) v.play(); else v.pause();
  }, [playing]);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    const img = canvas.getObjects()[0] as fabric.Image | undefined;
    if (!img) return;
    img.filters = grayscale ? [new fabric.Image.filters.Grayscale()] : [];
    img.applyFilters();
  }, [grayscale]);

  useFabricResponsive(wrapperRef, fabRef, 720, 440);

  return (
    <DemoLayout title="🎨 Video element" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>播放控制</h3>
        <div className="control-group">
          <button type="button" onClick={() => setPlaying(p => !p)}>{playing ? '⏸ Pause' : '▶ Play'}</button>
          <button type="button" onClick={() => { const v = videoRef.current!; v.currentTime = 0; }}>↻ Reset</button>
        </div>
        <h3>濾鏡</h3>
        <div className="control-group">
          <label><input type="checkbox" checked={grayscale} onChange={e => setGrayscale(e.target.checked)} /> Grayscale</label>
        </div>
        <div className="info-box">將 &lt;video&gt; 包成 <strong>fabric.Image</strong>，逐幀 re-render 並可套用 filters、縮放、旋轉。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={440} /></div>
    </DemoLayout>
  );
}
