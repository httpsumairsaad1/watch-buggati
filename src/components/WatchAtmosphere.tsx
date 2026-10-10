import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, ShaderMaterial, SRGBColorSpace } from 'three';

function Lighting() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 }, gold: { value: new Color() } }), []);
  useEffect(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    uniforms.gold.value.setRGB((pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255, SRGBColorSpace);
  }, [uniforms]);
  useFrame((_, delta) => {
    uniforms.time.value += Math.min(delta, .05);
  });
  return <mesh><planeGeometry args={[18, 12]} /><shaderMaterial ref={material} transparent depthWrite={false} uniforms={uniforms}
    vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
    fragmentShader={`varying vec2 vUv; uniform float time; uniform vec3 gold; void main(){float x=vUv.x+vUv.y*.25; float beam=pow(max(0.,cos(x*10.+sin(time*.13)*.25)),40.); float fade=sin(vUv.y*3.14159)*.07; gl_FragColor=vec4(gold,beam*fade);}`} />
  </mesh>;
}

export default function WatchAtmosphere() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  return <div className="three-atmosphere" aria-hidden="true"><Canvas frameloop={reduced ? 'demand' : 'always'} dpr={1} camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true, antialias: false }}><Lighting /></Canvas></div>;
}