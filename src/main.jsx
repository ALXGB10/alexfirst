import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const scenes = [
  {
    eyebrow: 'Nebula I',
    title: 'Violet Cradle',
    text: 'A drifting nursery of newborn stars folds around a glassy event horizon.',
    accent: '#b26cff',
  },
  {
    eyebrow: 'Moonwell II',
    title: 'Silver Tides',
    text: 'Liquid constellations answer every motion, sending ripples through orbital dust.',
    accent: '#73e8ff',
  },
  {
    eyebrow: 'Aurora III',
    title: 'Emerald Wake',
    text: 'Magnetic ribbons sweep over a sleeping planet and braid into a luminous crown.',
    accent: '#76ffb5',
  },
  {
    eyebrow: 'Solar IV',
    title: 'Amber Singularity',
    text: 'A warm star collapses into music, pulsing with every breath of the gallery.',
    accent: '#ffb86b',
  },
];

function usePointer() {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (event) => {
      setPointer({ x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight });
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}

function Starfield({ pointer }) {
  const canvasRef = useRef(null);
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => ({
        id: index,
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.85 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frame;
    let width;
    let height;
    let time = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      time += 0.008;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      stars.forEach((star) => {
        const driftX = (pointer.x - 0.5) * 42 * star.z;
        const driftY = (pointer.y - 0.5) * 36 * star.z;
        const x = (star.x * width + driftX + Math.sin(time + star.twinkle) * 10 * star.z) % width;
        const y = (star.y * height + driftY + Math.cos(time * 0.8 + star.twinkle) * 7 * star.z) % height;
        const radius = star.z * 1.9 + Math.sin(time * 4 + star.twinkle) * 0.45;
        const alpha = 0.35 + star.z * 0.55;

        context.beginPath();
        context.arc(x < 0 ? x + width : x, y < 0 ? y + height : y, Math.max(0.2, radius), 0, Math.PI * 2);
        context.fillStyle = `rgba(207, 229, 255, ${alpha})`;
        context.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [pointer, stars]);

  return <canvas className="starfield" ref={canvasRef} aria-hidden="true" />;
}

function Portal({ pointer, activeScene }) {
  const rotateX = (pointer.y - 0.5) * -14;
  const rotateY = (pointer.x - 0.5) * 18;

  return (
    <div className="portal-wrap" style={{ '--portal-accent': activeScene.accent }}>
      <div className="portal" style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="orbit orbit-three" />
        <div className="portal-core">
          <div className="portal-glass" />
          <div className="portal-spark spark-one" />
          <div className="portal-spark spark-two" />
          <div className="portal-spark spark-three" />
        </div>
      </div>
    </div>
  );
}

function SceneCard({ scene, index, active, onSelect }) {
  return (
    <button
      className={`scene-card ${active ? 'active' : ''}`}
      onClick={() => onSelect(index)}
      style={{ '--scene-accent': scene.accent }}
      type="button"
    >
      <span>{scene.eyebrow}</span>
      <strong>{scene.title}</strong>
      <p>{scene.text}</p>
    </button>
  );
}

function App() {
  const pointer = usePointer();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeScene = scenes[active];

  return (
    <main className="app-shell">
      <Starfield pointer={pointer} />
      <div className="aurora" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker">Interactive cosmic gallery</p>
          <h1 id="hero-title">Enter the Astral Bloom</h1>
          <p className="lede">
            Sweep your pointer to bend the stars, tap a dream panel to retune the portal, and scroll through a
            cinematic field of drifting light.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="primary-action">Explore scenes</a>
            <span className="status-pill">Pointer reactive · Scroll alive</span>
          </div>
        </div>

        <Portal pointer={pointer} activeScene={activeScene} />
      </section>

      <section className="gallery" id="gallery" aria-label="Dreamscape scenes">
        <div className="section-heading">
          <p className="kicker">Living dreamscape</p>
          <h2>{activeScene.title}</h2>
          <p>{activeScene.text}</p>
        </div>

        <div className="scene-grid">
          {scenes.map((scene, index) => (
            <SceneCard key={scene.title} scene={scene} index={index} active={index === active} onSelect={setActive} />
          ))}
        </div>
      </section>

      <section className="signal-band" aria-label="Cosmic signal readings">
        <div>
          <span>Radiance</span>
          <strong>{Math.round(62 + pointer.x * 38)}%</strong>
        </div>
        <div>
          <span>Drift</span>
          <strong>{Math.round(18 + pointer.y * 74)}°</strong>
        </div>
        <div>
          <span>Active frequency</span>
          <strong style={{ color: activeScene.accent }}>{activeScene.eyebrow}</strong>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
