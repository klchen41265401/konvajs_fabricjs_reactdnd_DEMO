import { useEffect, useRef, useState } from 'react';
import { Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function DisplayVideo() {
  const imageRef = useRef<Konva.Image | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    video.crossOrigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    videoRef.current = video;
    video.addEventListener('loadedmetadata', () => setReady(true));
    video.play().catch(() => { /* ignore */ });
    return () => { video.pause(); video.src = ''; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const layer = imageRef.current?.getLayer();
    if (!layer) return;
    const anim = new Konva.Animation(() => { /* redraw */ }, layer);
    anim.start();
    return () => { anim.stop(); };
  }, [ready]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => { /* ignore */ });
    else v.pause();
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = volume === 0;
  }, [volume]);

  return (
    <DemoLayout title="🎬 Display Video on Canvas" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <button type="button" onClick={() => setPlaying(p => !p)}>{playing ? '⏸️ 暫停' : '▶️ 播放'}</button>
        </div>
        <div className="control-group"><label>音量: {Math.round(volume * 100)}%</label><input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(+e.target.value)} /></div>
        <div className="info-box">透過 Konva.Image 包裹 HTMLVideoElement，搭配 Konva.Animation 持續觸發 layer 重繪，即可在畫布中播放影片。</div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={405}>
          <Layer>
            {ready && videoRef.current && (
              <KonvaImage
                ref={imageRef}
                image={videoRef.current}
                x={0}
                y={0}
                width={720}
                height={405}
              />
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
