import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WatchSequence } from '@/components/WatchSequence';
import { MovementExplorer } from '@/components/MovementExplorer';
import { ViewingForm } from '@/components/ViewingForm';

const WatchAtmosphere = lazy(() => import('@/components/WatchAtmosphere'));

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: 'Bugatti Chiron Tourbillon Rose Gold | Jacob & Co.' },
    { name: 'description', content: 'Explore the Jacob & Co. Bugatti Chiron Tourbillon Rose Gold. A W16 engine automaton, 578 components and an edition of only 72 pieces.' },
    { property: 'og:title', content: 'Jacob & Co. × Bugatti — Chiron Tourbillon' },
    { property: 'og:description', content: 'Swiss mechanical artistry meets hypercar engineering. Discover the Rose Gold edition and request a private viewing.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
});

const specifications = [
  { title: 'I. Reference', rows: [['Item number', 'BU200.40.AA.AA.C'], ['Collection', 'Bugatti Chiron Tourbillon']] },
  { title: 'II. Movement', rows: [['Caliber', 'JCAM37 · Hand-wound'], ['Construction', '578 components · 51 jewels'], ['Frequency / power reserve', '21,600 vph (3 Hz) · 60 hours']] },
  { title: 'III. Case architecture', rows: [['Dimensions', '55 × 44 mm · Height 22 mm'], ['Material', '18K rose gold · Anti-reflective sapphire'], ['Crowns / water resistance', 'Black ceramic · 30 m (3 atm)']] },
  { title: 'IV. Dial & hands', rows: [['Dial', 'Rose gold-plated · Electric blue indices'], ['Hands', 'Skeletonized rose gold-plated hands'], ['Details', 'Blue luminescent tips · Bugatti EB logo']] },
  { title: 'V. Strap & clasp', rows: [['Strap', 'Openworked black rubber'], ['Clasp', '18K rose gold deployant clasp']] },
  { title: 'VI. Complications & edition', rows: [['Tourbillon', 'One-minute flying tourbillon · 30° incline'], ['Automaton', 'W16 engine block · 16 moving pistons'], ['Limited edition', '72 pieces worldwide']] },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main>
    <header className="site-header">
      <a href="#experience" className="brand-pair" aria-label="Jacob & Co. and Bugatti"><div className="wordmark">JACOB &amp; CO.<small>INSPIRED BY THE IMPOSSIBLE</small></div><span className="brand-divider" /><span className="bugatti-mark">BUGATTI</span></a>
      <nav className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <a href="#experience" onClick={() => setMenuOpen(false)}>The timepiece</a><a href="#movement" onClick={() => setMenuOpen(false)}>The movement</a><a href="#specifications" onClick={() => setMenuOpen(false)}>Specifications</a>
        <Button variant="luxuryOutline" asChild><a href="#concierge" onClick={() => setMenuOpen(false)}>Private viewing <ArrowUpRight /></a></Button>
      </nav>
      <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
    </header>
    <section id="experience" className="hero-track"><div className="hero-stage">
      <ClientOnly fallback={null}><Suspense fallback={null}><WatchAtmosphere /></Suspense></ClientOnly>
      <div className="hero-title"><div className="eyebrow">Jacob &amp; Co. × Bugatti</div><h1>CHIRON TOURBILLON<span>ROSE GOLD</span></h1></div>
      <WatchSequence />
      <div className="hero-story"><div className="edition-label"><i />Limited edition · 72 pieces</div><h2>SHAPED LIKE<br />A HYPERCAR.<br /><span>DESIGNED<br />FOR ELATION.</span></h2><div className="story-line" /><p>The soul of a Bugatti. The precision of Swiss watchmaking. An extraordinary union of high-performance engineering and haute horlogerie.</p><Button variant="luxury" asChild><a href="#movement">Discover the masterpiece <ArrowUpRight /></a></Button><div className="reference">REF. BU200.40.AA.AA.C</div></div>
    </div></section>
    <div className="stats-band">{[{ number: '578', unit: '', label: 'Individual components' }, { number: '16', unit: '', label: 'Moving engine pistons' }, { number: '60', unit: 'H', label: 'Power reserve' }, { number: '72', unit: '', label: 'Pieces worldwide' }].map(stat => <div className="stat" key={stat.label}><div className="stat-number">{stat.number}<small>{stat.unit}</small></div><div className="stat-label">{stat.label}</div></div>)}</div>
    <MovementExplorer />
    <section id="specifications" className="section"><div className="section-heading"><div><div className="eyebrow">Precision in every detail</div><h2>The anatomy of an icon.</h2></div><p>Exceptional from the first component<br />to the final finishing touch.</p></div><div className="spec-grid">{specifications.map(spec => <article className="spec-block" key={spec.title}><h3>{spec.title}</h3><dl>{spec.rows.map(([label, value]) => <div className="spec-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>)}</div></section>
    <ViewingForm />
    <footer className="footer"><a href="#experience" className="footer-brand">JACOB &amp; CO.</a><span>THE ART OF THE IMPOSSIBLE.</span><span>© 2026 · Independent concept experience</span><a href="#experience">Back to top ↑</a></footer>
  </main>;
}
