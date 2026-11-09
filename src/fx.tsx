import React, { useEffect } from 'react';

/** Fondo aurora: orbes de malla en movimiento lento + cuadrícula técnica + grano. */
export function AuroraBackground({ theme }: { theme: string }) {
  return (
    <div className="aurora" aria-hidden="true" data-theme={theme}>
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
      <span className="grid-lines" />
      <span className="grain" />
    </div>
  );
}

/** Onda de voz decorativa (SVG animado, 3 capas con desfase). */
export function VoiceWave({ className = '' }: { className?: string }) {
  const paths = [
    'M0,60 C120,10 240,110 360,60 S600,10 720,60 S960,110 1080,60 S1320,10 1440,60',
    'M0,60 C120,100 240,20 360,60 S600,100 720,60 S960,20 1080,60 S1320,100 1440,60',
    'M0,60 C160,30 200,90 360,60 S560,30 720,60 S920,90 1080,60 S1280,30 1440,60'
  ];
  const colors = ['var(--accent-primary)', 'var(--accent-2)', 'var(--accent-3)'];
  return (
    <svg className={className} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="waveFade" x1="0" x2="1">
          <stop offset="0" stopOpacity="0" stopColor="#fff" />
          <stop offset="0.3" stopOpacity="1" stopColor="#fff" />
          <stop offset="0.7" stopOpacity="1" stopColor="#fff" />
          <stop offset="1" stopOpacity="0" stopColor="#fff" />
        </linearGradient>
        <mask id="waveMask">
          <rect width="1440" height="120" fill="url(#waveFade)" />
        </mask>
      </defs>
      <g mask="url(#waveMask)" fill="none" strokeLinecap="round">
        {paths.map((d, i) => (
          <path key={i} d={d} stroke={colors[i]} strokeWidth={i === 0 ? 2.2 : 1.4} className={`wave wave-${i}`} />
        ))}
      </g>
    </svg>
  );
}

/** Foco de luz que sigue al puntero/dedo sobre las tarjetas de vidrio. */
export function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia?.('(hover: none)').matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[style*="--surface-primary"], [style*="--surface-elevated"]') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}
