'use client';

import { useId } from 'react';

export function NibGlyph() {
  return <svg viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <circle cx="1" cy="8.5" r=".95" fill="#e9e5f0" /><circle cx="12" cy="8.5" r=".95" fill="#e9e5f0" /><rect x="1.7" y="2.6" width="9.6" height="8.4" rx="3.6" fill="#f8f6ff" />
    <ellipse cx="3.3" cy="7.7" rx=".72" ry=".32" fill="#ed9db0" opacity=".35" /><ellipse cx="9.7" cy="7.7" rx=".72" ry=".32" fill="#ed9db0" opacity=".35" />
    <g fill="#272130"><rect x="3.8" y="5.2" width="1.4" height="1.9" rx=".7" /><rect x="7.8" y="5.2" width="1.4" height="1.9" rx=".7" /></g><path d="M5.7 7.8q.8.9 1.6 0" stroke="#272130" strokeWidth=".42" strokeLinecap="round" />
  </svg>;
}

export function Nib({ mood = 'idle', size = 38 }) {
  const gradient = useId();
  const happy = mood === 'done' || mood === 'dance';
  const sleepy = mood === 'sleeping';
  const worried = mood === 'worried';
  return <span className={'nib-face nib-' + mood} style={{ width: size, height: size }}>
    <svg viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <defs><linearGradient id={gradient} x1="3" y1="2" x2="9" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#ddd9e9" /></linearGradient></defs>
      <circle className="nib-hand-left" cx="1" cy="8.5" r=".95" fill={`url(#${gradient})`} />
      <circle className="nib-hand-right" cx="12" cy="8.5" r=".95" fill={`url(#${gradient})`} />
      <rect x="1.7" y="2.6" width="9.6" height="8.4" rx="3.6" fill={`url(#${gradient})`} stroke="#fff" strokeWidth=".12" />
      <ellipse cx="3.3" cy="7.7" rx=".72" ry=".32" fill="#ed9db0" opacity=".4" /><ellipse cx="9.7" cy="7.7" rx=".72" ry=".32" fill="#ed9db0" opacity=".4" />
      {happy ? <path d="M3.75 6.5q.75-1.2 1.5 0m2.5 0q.75-1.2 1.5 0" stroke="#272130" strokeWidth=".45" strokeLinecap="round" /> : sleepy ? <path d="M3.8 6.4h1.4m2.6 0h1.4" stroke="#272130" strokeWidth=".45" strokeLinecap="round" /> : <g fill="#272130"><rect x="3.8" y="5.2" width="1.4" height="1.9" rx=".7" /><rect x="7.8" y="5.2" width="1.4" height="1.9" rx=".7" /></g>}
      {worried ? <path d="M5.65 8.45q.85-1.15 1.7 0" stroke="#272130" strokeWidth=".42" strokeLinecap="round" /> : mood === 'waiting' ? <ellipse cx="6.5" cy="8" rx=".45" ry=".55" fill="#272130" /> : <path d="M5.7 7.8q.8.9 1.6 0" stroke="#272130" strokeWidth=".42" strokeLinecap="round" />}
    </svg>
  </span>;
}
