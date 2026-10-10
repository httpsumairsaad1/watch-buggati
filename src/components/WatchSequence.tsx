import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lastWatchFrame, watchFrames } from '@/lib/watch-frames';

export function WatchSequence() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const animation = useRef({ frame: 0 });
  const drawRef = useRef<(frame: number) => void>(() => {});
  const playback = useRef<gsap.core.Tween | null>(null);
  const control = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const node = canvas.current;
    const context = node?.getContext('2d', { alpha: false });
    if (!node || !context) return;
    let disposed = false;
    let raf = 0;
    let latestFrame = 0;
    let scrollTween: gsap.core.Tween | undefined;
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    const drawsFallback = () => {
      context.fillStyle = bg || '#0a0a0a';
      context.fillRect(0, 0, node.width, node.height);
      context.fillStyle = '#d4af37';
      context.font = 'bold 20px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('BUGATTI CHIRON TOURBILLON', node.width / 2, node.height / 2 - 15);
      context.font = '12px sans-serif';
      context.fillStyle = '#a1a1aa';
      context.fillText(`Frame ${Math.round(animation.current.frame)} / ${lastWatchFrame}`, node.width / 2, node.height / 2 + 15);
      if (control.current) control.current.value = String(Math.round(animation.current.frame));
      node.dataset['frame'] = String(Math.round(animation.current.frame));
    };

    const draw = (frame: number) => {
      latestFrame = frame;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const image = images.current[Math.min(lastWatchFrame, Math.max(0, Math.round(latestFrame)))];
        if (!image?.complete || !image.naturalWidth) {
          drawsFallback();
          return;
        }
        context.fillStyle = bg;
        context.fillRect(0, 0, node.width, node.height);
        const scale = Math.min(node.width / image.width, node.height / image.height) * 1.15;
        const w = image.width * scale, h = image.height * scale;
        context.drawImage(image, (node.width - w) / 2, (node.height - h) / 2, w, h);
        if (control.current) control.current.value = String(Math.round(latestFrame));
        node.dataset['frame'] = String(Math.round(latestFrame));
      });
    };
    drawRef.current = draw;
    const resize = () => {
      const rect = node.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      node.width = Math.round(rect.width * dpr);
      node.height = Math.round(rect.height * dpr);
      draw(animation.current.frame);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    resize();
    const loads = watchFrames.map((src, i) => new Promise<void>((resolve) => {
      const image = new Image();
      images.current[i] = image;
      image.onload = () => { if (i === 0 && !disposed) draw(0); resolve(); };
      image.onerror = () => { resolve(); }; // resolve instead of reject so partial/missing assets don't break the app
      image.src = src;
    }));
    Promise.all(loads).then(() => {
      if (disposed) return;
      setReady(true);
      draw(0);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scrollTween = gsap.to(animation.current, {
          frame: lastWatchFrame,
          ease: 'none',
          onUpdate: () => draw(animation.current.frame),
          scrollTrigger: {
            trigger: '#experience',
            start: 'top top',
            end: () => {
              const track = document.getElementById('experience');
              const stage = track?.querySelector<HTMLElement>('.hero-stage');
              return `+=${Math.max(1, (track?.offsetHeight ?? 0) - (stage?.offsetHeight ?? 0))}`;
            },
            scrub: .25,
            invalidateOnRefresh: true,
            onUpdate: () => { playback.current?.kill(); setPlaying(false); },
          },
        });
      }
      ScrollTrigger.refresh();
    }).catch(() => { if (!disposed) { setReady(true); setFailed(true); draw(0); } });
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(raf); scrollTween?.scrollTrigger?.kill(); scrollTween?.kill(); playback.current?.kill(); };
  }, []);

  const toggle = () => {
    if (playing) { playback.current?.kill(); setPlaying(false); return; }
    animation.current.frame = 0;
    setPlaying(true);
    playback.current = gsap.to(animation.current, { frame: lastWatchFrame, duration: 7, ease: 'none', onUpdate: () => drawRef.current(animation.current.frame), onComplete: () => setPlaying(false) });
  };
  return <>
    <div className="sequence-wrap">
      <img className="sequence-poster" src={watchFrames[0]} alt="Jacob & Co. Bugatti Chiron Tourbillon in rose gold" />
      <canvas ref={canvas} aria-label="Scroll-driven exploded view of the Bugatti Chiron Tourbillon" />
    </div>
    <div className="hero-bottom">
      <a href="#movement" className="scroll-cue"><span>Scroll to discover</span><span>↓</span></a>
      <div className="sequence-controls">
        <span>{failed ? 'Still view' : ready ? `01 — ${watchFrames.length}` : 'Preparing'}</span>
        <input ref={control} type="range" min="0" max={lastWatchFrame} defaultValue="0" disabled={!ready} aria-label="Watch rotation" onChange={e => { playback.current?.kill(); setPlaying(false); animation.current.frame = Number(e.target.value); drawRef.current(animation.current.frame); }} />
        <Button variant="ghost" size="icon" className="sequence-play" aria-label={playing ? 'Pause animation' : 'Play animation'} title={playing ? 'Pause animation' : 'Play animation'} disabled={!ready} onClick={toggle}>{playing ? <Pause /> : <Play />}</Button>
      </div>
    </div>
  </>;
}