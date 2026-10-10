import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group, Mesh, SRGBColorSpace, MathUtils } from 'three';
import watchAsset from '@/assets/movement/watch-full.webp.asset.json';
import engineAsset from '@/assets/movement/engine-full.webp.asset.json';
import tourbillonAsset from '@/assets/movement/tourbillon-full.webp.asset.json';
import reserveAsset from '@/assets/movement/reserve-full.webp.asset.json';

const features = [
  { name: 'W16 Engine', x: .016, y: -.422, width: 1.188, height: 1.094, url: engineAsset.url, pinX: -.8, pinY: -.6 },
  { name: 'Tourbillon', x: -.078, y: 1.156, width: .875, height: .75, url: tourbillonAsset.url, pinX: .6, pinY: 1.4 },
  { name: 'Power Reserve', x: .728, y: .241, width: .588, height: .831, url: reserveAsset.url, pinX: 1.05, pinY: .3 },
];

function DepthWatch({ active, onSelect, reduced }: { active: number; onSelect: (value: number) => void; reduced: boolean }) {
  const textures = useTexture([watchAsset.url, ...features.map(feature => feature.url)]);
  const group = useRef<Group>(null);
  const layers = useRef<Array<Mesh | null>>([]);
  const elapsed = useRef(0);
  useEffect(() => { textures.forEach(texture => { texture.colorSpace = SRGBColorSpace; }); }, [textures]);
  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, .05);
    elapsed.current += delta;
    const node = group.current;
    if (!node) return;
    const smooth = reduced ? 1 : 1 - Math.exp(-6 * delta);
    node.rotation.y = MathUtils.lerp(node.rotation.y, reduced ? 0 : state.pointer.x * .2 + Math.sin(elapsed.current * .35) * .055, smooth);
    node.rotation.x = MathUtils.lerp(node.rotation.x, reduced ? 0 : -state.pointer.y * .09, smooth);
    layers.current.forEach((layer, index) => {
      if (!layer) return;
      layer.position.z = MathUtils.lerp(layer.position.z, index === active ? .7 : .012, smooth);
      const scale = MathUtils.lerp(layer.scale.x, index === active ? 1.18 : 1, smooth);
      layer.scale.setScalar(scale);
    });
    state.gl.domElement.dataset['feature'] = features[active]?.name;
    state.gl.domElement.dataset['rotation'] = node.rotation.y.toFixed(4);
  });
  return <group ref={group}>
    <mesh>
      <planeGeometry args={[3.094, 4]} />
      <meshBasicMaterial map={textures[0] ?? null} transparent toneMapped={false} />
    </mesh>
    {features.map((feature, index) => <group key={feature.name}>
      <mesh ref={node => { layers.current[index] = node; }} position={[feature.x, feature.y, .012]} onClick={event => { event.stopPropagation(); onSelect(index); }}>
        <planeGeometry args={[feature.width, feature.height]} />
        <meshBasicMaterial map={textures[index + 1] ?? null} transparent toneMapped={false} />
      </mesh>
    </group>)}
  </group>;
}

export default function MovementScene({ active, onSelect }: { active: number; onSelect: (value: number) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { rootMargin: '100px' });
    observer.observe(node);
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  return <div ref={container} className="movement-canvas" aria-label="Photographic 3D watch movement">
    <Canvas dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 8], fov: 35 }} gl={{ alpha: true, antialias: true }}>
      <Suspense fallback={null}><DepthWatch active={active} onSelect={onSelect} reduced={reduced} /></Suspense>
    </Canvas>
  </div>;
}
