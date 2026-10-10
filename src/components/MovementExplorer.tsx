import { lazy, Suspense, useState } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { ArrowUpRight, Gauge, Cog, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import watchAsset from '@/assets/movement/watch.webp.asset.json';

const MovementScene = lazy(() => import('@/components/MovementScene'));

const details = [
  { tab: 'W16 Engine', title: 'A hypercar. At heart.', copy: 'A miniature W16 engine, brought to life in sapphire. Sixteen pistons move inside the transparent engine block, capturing the extraordinary spirit of the Bugatti Chiron.', metric: '16 pistons · One extraordinary automaton', frame: 36, Icon: Cog },
  { tab: 'Tourbillon', title: 'Gravity, reimagined.', copy: 'A one-minute flying tourbillon, inclined at 30°. Suspended within the movement, it offers a captivating view of the beating heart of this exceptional timepiece.', metric: '30° incline · 21,600 vibrations per hour', frame: 43, Icon: RotateCw },
  { tab: 'Power Reserve', title: 'Engineered for endurance.', copy: 'Sixty hours of mechanical autonomy. Inspired by a hypercar’s fuel gauge, the power reserve indicator brings the language of the road to the art of Swiss watchmaking.', metric: '60 hours · Hand-wound caliber JCAM37', frame: 64, Icon: Gauge },
];

export function MovementExplorer() {
  const [active, setActive] = useState(0);
  const detail = details[active];
  if (!detail) return null;
  return <section id="movement" className="section movement-section">
    <div className="section-heading"><div><div className="eyebrow">Mechanical artistry</div><h2>Beyond the extraordinary.</h2></div><p>Two worlds. One uncompromising vision.<br />Discover the engineering beneath the sapphire.</p></div>
    <div className="explorer-layout movement-layout">
      <div className="movement-stage">
        <img className="movement-poster" src={watchAsset.url} alt="Front view of the rose gold Bugatti Chiron Tourbillon movement" />
        <ClientOnly fallback={null}><Suspense fallback={null}><MovementScene active={active} onSelect={setActive} /></Suspense></ClientOnly>
        <div className="movement-caption"><span>JCAM37</span><span>578 components · 51 jewels</span></div>
      </div>
      <div className="movement-information"><div className="explorer-tabs" role="tablist" aria-label="Movement components">{details.map((d, i) => <Button key={d.tab} variant="ghost" role="tab" id={`tab-${i}`} aria-controls="movement-panel" aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (active + (e.key === 'ArrowRight' ? 1 : 2)) % 3; setActive(next); document.getElementById(`tab-${next}`)?.focus(); } }}>{d.tab}</Button>)}</div>
        <div className="movement-detail-heading"><span>0{active + 1} / 03</span><div className="movement-arrows"><Button variant="ghost" size="icon" title="Previous detail" aria-label="Previous movement detail" onClick={() => setActive((active + 2) % 3)}><ChevronLeft /></Button><Button variant="ghost" size="icon" title="Next detail" aria-label="Next movement detail" onClick={() => setActive((active + 1) % 3)}><ChevronRight /></Button></div></div>
        <div className="explorer-copy" id="movement-panel" role="tabpanel" aria-labelledby={`tab-${active}`}><div key={detail.tab} className="movement-detail"><h3>{detail.title}</h3><p>{detail.copy}</p><div className="technical-detail">{active === 2 ? <span className="fuel-gauge" aria-label="Full 60-hour power reserve">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</span> : <detail.Icon size={18} />}<span>{detail.metric}</span></div></div></div>
        <Button variant="link" asChild><a href="#specifications">Explore the specifications <ArrowUpRight /></a></Button>
      </div>
    </div>
  </section>;
}