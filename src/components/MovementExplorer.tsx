import { lazy, Suspense, useState } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { ArrowUpRight, Gauge, Cog, RotateCw, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import watchAsset from '@/assets/movement/watch-full.webp.asset.json';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const MovementScene = lazy(() => import('@/components/MovementScene'));

const details = [
  {
    id: 'engine',
    tab: 'W16 Engine',
    shortName: 'W16 Automaton',
    subtitle: 'Automaton Complication',
    title: 'A hypercar. At heart.',
    copy: 'A miniature W16 engine, carved from a solid block of transparent sapphire crystal. Activated on demand via the dedicated crown push-piece, sixteen miniature steel pistons fire in sequence along a single-piece crankshaft, capturing the visceral spirit of the Bugatti Chiron in high horology.',
    metric: '16 pistons · Solid sapphire block automaton',
    stats: [
      { label: 'Pistons', value: '16 Steel' },
      { label: 'Crankshaft', value: 'Single Block' },
      { label: 'Animation', value: '20s Cycle' },
    ],
    pin: { top: '68%', left: '49%' },
    badge: '01',
    depth: '+0.70mm',
    Icon: Cog,
  },
  {
    id: 'tourbillon',
    tab: 'Tourbillon',
    shortName: '30° Tourbillon',
    subtitle: 'Flying Architecture',
    title: 'Gravity, reimagined.',
    copy: 'A one-minute flying tourbillon inclined at a dramatic 30° angle. Suspended under the sapphire crystal without an upper bridge, it counteracts the effects of earth’s gravity in three dimensions, revealing the rhythmic cadence of the hand-wound caliber JCAM37.',
    metric: '30° incline · 21,600 vibrations per hour',
    stats: [
      { label: 'Incline', value: '30° Angle' },
      { label: 'Cadence', value: '21,600 vph' },
      { label: 'Cage', value: 'Titanium' },
    ],
    pin: { top: '22%', left: '46%' },
    badge: '02',
    depth: '+0.70mm',
    Icon: RotateCw,
  },
  {
    id: 'reserve',
    tab: 'Power Reserve',
    shortName: 'Fuel Gauge',
    subtitle: 'Energy Telemetry',
    title: 'Engineered for endurance.',
    copy: 'Sixty hours of continuous mechanical autonomy. Styled directly after the Chiron’s automotive fuel level gauge with a universal gas pump symbol, this complication seamlessly translates the language of the hypercar to Swiss haute horlogerie.',
    metric: '60 hours · Hand-wound caliber JCAM37',
    stats: [
      { label: 'Autonomy', value: '60 Hours' },
      { label: 'Barrels', value: 'Twin Barrels' },
      { label: 'Caliber', value: 'JCAM37' },
    ],
    pin: { top: '44%', left: '72%' },
    badge: '03',
    depth: '+0.70mm',
    Icon: Gauge,
  },
];

export function MovementExplorer() {
  const [active, setActive] = useState(0);
  const detail = details[active];
  if (!detail) return null;

  return (
    <section id="movement" className="section movement-section">
      <div className="section-heading movement-header">
        <div>
          <div className="eyebrow flex items-center gap-2">
            <span className="live-dot" />
            <span>Mechanical Artistry · Caliber JCAM37</span>
          </div>
          <h2>Beyond the extraordinary.</h2>
        </div>
        <p>
          Two worlds. One uncompromising vision.
          <br className="hidden sm:inline" />
          Explore the photographic 3D depth architecture beneath the sapphire.
        </p>
      </div>

      <div className="explorer-layout movement-layout">
        {/* 3D Movement Stage */}
        <div className="movement-stage-card">
          <div className="movement-stage-glass">
            {/* Top HUD bar */}
            <div className="stage-hud-top">
              <div className="stage-hud-badge">
                <Layers size={13} className="text-primary" />
                <span>3D LAYER DEPTH</span>
              </div>
              <div className="stage-hud-elevation">
                <span>ELEVATION: {detail.depth}</span>
              </div>
            </div>

            {/* 3D Canvas / 2D Poster Stage */}
            <div className="movement-stage">
              <img
                className="movement-poster"
                src={watchAsset.url}
                alt="Front view of the rose gold Bugatti Chiron Tourbillon movement"
              />
              <ClientOnly fallback={null}>
                <ErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <MovementScene active={active} onSelect={setActive} />
                  </Suspense>
                </ErrorBoundary>
              </ClientOnly>

              {/* Interactive Hotspots Overlay */}
              <div className="movement-hotspots" aria-hidden="false">
                {details.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`movement-hotspot ${i === active ? 'is-active' : ''}`}
                    style={{ top: d.pin.top, left: d.pin.left }}
                    onClick={() => setActive(i)}
                    aria-label={`Highlight ${d.tab}`}
                    title={`Highlight ${d.tab}`}
                  >
                    <span className="hotspot-pulse" />
                    <span className="hotspot-core">{d.badge}</span>
                    <span className="hotspot-pill">{d.shortName}</span>
                  </button>
                ))}
              </div>

              {/* Drag instruction chip */}
              <div className="stage-drag-chip">
                <RotateCw size={12} className="text-primary animate-spin-slow" />
                <span>Drag to tilt 3D layers</span>
              </div>
            </div>

            {/* Stage Bottom Caption HUD */}
            <div className="stage-hud-bottom">
              <span className="font-semibold text-primary">JCAM37 · LAYER 0{active + 1} ELEVATED</span>
              <span className="text-muted-foreground">578 COMPONENTS · 51 JEWELS</span>
            </div>
          </div>
        </div>

        {/* Movement Information & Cockpit Controls */}
        <div className="movement-information">
          {/* Segmented Complication Switcher */}
          <div className="cockpit-tabs" role="tablist" aria-label="Movement complications">
            {details.map((d, i) => {
              const TabIcon = d.Icon;
              const isSelected = i === active;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  id={`tab-${i}`}
                  aria-controls="movement-panel"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className={`cockpit-tab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const next = (active + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
                      setActive(next);
                      document.getElementById(`tab-${next}`)?.focus();
                    }
                  }}
                >
                  <span className="cockpit-tab-num">{d.badge}</span>
                  <TabIcon size={16} className="cockpit-tab-icon" />
                  <span className="cockpit-tab-title">{d.tab}</span>
                  {isSelected && <span className="cockpit-active-glow" />}
                </button>
              );
            })}
          </div>

          {/* Complication Detail Glass Card */}
          <div className="complication-card" id="movement-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
            <div className="complication-card-top">
              <div className="complication-eyebrow">
                <Sparkles size={13} className="text-primary" />
                <span>{detail.subtitle}</span>
              </div>
              <div className="complication-nav">
                <span className="complication-counter">0{active + 1} / 03</span>
                <div className="movement-arrows">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="arrow-btn"
                    title="Previous complication"
                    aria-label="Previous complication"
                    onClick={() => setActive((active + 2) % 3)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="arrow-btn"
                    title="Next complication"
                    aria-label="Next complication"
                    onClick={() => setActive((active + 1) % 3)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div key={detail.id} className="movement-detail">
              <h3 className="complication-title">{detail.title}</h3>
              <p className="complication-copy">{detail.copy}</p>

              {/* Telemetry Micro-Cards */}
              <div className="telemetry-grid">
                {detail.stats.map((stat) => (
                  <div key={stat.label} className="telemetry-item">
                    <span className="telemetry-label">{stat.label}</span>
                    <span className="telemetry-val">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Fuel Gauge / Feature Metric */}
              <div className="technical-detail-banner">
                {active === 2 ? (
                  <div className="fuel-gauge-wrap">
                    <div className="fuel-gauge" aria-label="Full 60-hour power reserve">
                      {Array.from({ length: 12 }, (_, i) => (
                        <i key={i} className="fuel-led" />
                      ))}
                    </div>
                    <span className="fuel-label">60H FULL AUTONOMY</span>
                  </div>
                ) : (
                  <div className="metric-pill">
                    <detail.Icon size={16} className="text-primary flex-shrink-0" />
                    <span>{detail.metric}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="complication-actions">
              <Button variant="luxuryOutline" className="spec-link-btn" asChild>
                <a href="#specifications">
                  <span>Explore full specifications</span>
                  <ArrowUpRight size={15} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}