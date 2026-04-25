/* global React */
/* Core motion + interaction primitives for PlantCure AI redesign */

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

// ── useSpring: springy value tracker ──
function useSpring(target, { stiffness = 0.12, damping = 0.78 } = {}) {
  const [val, setVal] = useState(target);
  const v = useRef(target);
  const velocity = useRef(0);
  const raf = useRef(0);
  useEffect(() => {
    const tick = () => {
      const dx = target - v.current;
      velocity.current = velocity.current * damping + dx * stiffness;
      v.current += velocity.current;
      if (Math.abs(velocity.current) < 0.01 && Math.abs(dx) < 0.01) {
        v.current = target;
        setVal(target);
        return;
      }
      setVal(v.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, stiffness, damping]);
  return val;
}

// ── useMousePos: returns a ref + state for cursor tracking ──
function useMousePos() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);
  return pos;
}

// ── CursorBlob: ambient spring-follow blob ──
function CursorBlob({ intensity = 1, color }) {
  const { x, y } = useMousePos();
  const sx = useSpring(x, { stiffness: 0.08, damping: 0.82 });
  const sy = useSpring(y, { stiffness: 0.08, damping: 0.82 });
  if (intensity === 0) return null;
  const bg = color || 'radial-gradient(circle at 50% 50%, rgba(146, 181, 110, 0.55), rgba(146, 181, 110, 0) 60%)';
  return (
    <div
      className="cursor-blob"
      style={{
        left: sx,
        top: sy,
        opacity: 0.6 * intensity,
        background: bg,
        width: 400 + 240 * intensity,
        height: 400 + 240 * intensity,
      }}
    />
  );
}

// ── KineticText: split string into chars that rise in ──
function KineticText({ text, delay = 0, stagger = 0.025, as: Tag = 'span', className = '', italicWords = [] }) {
  const words = text.split(' ');
  let i = 0;
  return (
    <Tag className={className}>
      {words.map((w, wi) => {
        const isItalic = italicWords.includes(w.toLowerCase().replace(/[.,!?]/g, ''));
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', fontStyle: isItalic ? 'italic' : 'inherit', color: isItalic ? 'var(--sage-500)' : 'inherit' }}>
            {[...w].map((c, ci) => {
              const d = delay + (i++ * stagger);
              return (
                <span
                  key={ci}
                  className="reveal-char"
                  style={{ animationDelay: `${d}s` }}
                >
                  {c}
                </span>
              );
            })}
            {wi < words.length - 1 && <span className="reveal-char" style={{ animationDelay: `${delay + (i++ * stagger)}s` }}>&nbsp;</span>}
          </span>
        );
      })}
    </Tag>
  );
}

// ── TiltCard: 3D tilt towards cursor ──
function TiltCard({ children, max = 10, className = '', style = {}, glare = true, onClick }) {
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0, px: 50, py: 50, active: false });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - y) * max, ry: (x - 0.5) * max, px: x * 100, py: y * 100, active: true });
  };
  const onLeave = () => setT(s => ({ ...s, rx: 0, ry: 0, active: false }));

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(0)`,
        transition: t.active ? 'transform 0.08s linear' : 'transform 0.6s var(--ease-spring)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {glare && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          background: `radial-gradient(circle at ${t.px}% ${t.py}%, rgba(255,255,255,0.35), transparent 50%)`,
          opacity: t.active ? 1 : 0,
          transition: 'opacity 0.4s',
          mixBlendMode: 'soft-light',
        }} />
      )}
    </div>
  );
}

// ── Scroll reveal: element fades/slides in on scroll ──
function Reveal({ children, delay = 0, y = 28, className = '', style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: '-5% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : `translateY(${y}px)`,
        filter: seen ? 'blur(0)' : 'blur(6px)',
        transition: `opacity 0.8s var(--ease-out) ${delay}s, transform 0.9s var(--ease-out) ${delay}s, filter 0.8s var(--ease-out) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── useScrollY: returns current window scrollY ──
function useScrollY(el = null) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const tgt = el || window;
    const read = () => setY(tgt === window ? window.scrollY : tgt.scrollTop);
    tgt.addEventListener('scroll', read, { passive: true });
    read();
    return () => tgt.removeEventListener('scroll', read);
  }, [el]);
  return y;
}

// ── Ambient morphing blob (SVG with animated path) ──
function MorphBlob({ size = 400, color = 'rgba(110,180,90,0.35)', style = {}, duration = 14 }) {
  const paths = [
    'M46.5,-58.2C58.8,-48.5,66.5,-33.1,68.8,-17.7C71,-2.3,67.8,13,60.5,26.5C53.1,40,41.6,51.7,28,58.4C14.3,65,-1.5,66.6,-16.1,62.5C-30.7,58.4,-44.1,48.6,-53.7,35.8C-63.3,23,-69.2,7.2,-67.6,-7.7C-66,-22.7,-56.8,-36.8,-44.8,-46.6C-32.8,-56.5,-17.9,-62.1,-1,-61C15.9,-59.9,34.3,-67.9,46.5,-58.2Z',
    'M42.8,-52.9C55.6,-42.7,66.8,-29.9,70.2,-15.1C73.6,-0.3,69.3,16.4,60.6,29.6C51.9,42.7,38.8,52.2,24.2,57.5C9.6,62.8,-6.6,63.9,-21.8,59.4C-37,54.9,-51.3,44.8,-60.3,31C-69.4,17.1,-73.2,-0.5,-68.7,-15.4C-64.2,-30.2,-51.4,-42.3,-37.5,-52.3C-23.6,-62.2,-8.5,-70.1,3.9,-74.8C16.4,-79.4,30,-63.1,42.8,-52.9Z',
    'M50.8,-56.5C63.3,-46,69,-27.2,69.4,-9.5C69.8,8.3,64.8,25,54.6,36.7C44.5,48.5,29.1,55.2,13.1,58.1C-2.9,60.9,-19.6,59.8,-32.8,52.6C-46.1,45.4,-55.9,32,-61.4,16.7C-66.9,1.3,-68,-15.9,-61.4,-29.2C-54.9,-42.5,-40.7,-51.8,-26.3,-60.7C-11.9,-69.5,2.8,-78,17.7,-75.8C32.5,-73.6,38.3,-67,50.8,-56.5Z',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % paths.length), duration * 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <svg width={size} height={size} viewBox="-80 -80 160 160" style={{ ...style }}>
      <path
        d={paths[idx]}
        fill={color}
        style={{ transition: `d ${duration}s var(--ease-out)` }}
      />
    </svg>
  );
}

// ── Simple progress ring ──
function ProgressRing({ value = 0, size = 64, stroke = 6, color = 'var(--sage-500)', bg = 'rgba(33,71,19,0.1)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s var(--ease-out)' }}
        />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  );
}

// ── Toast system ──
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, ...toast }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), toast.duration || 3200);
  }, []);
  return { toasts, push };
}

function ToastHost({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340 }}>
      {toasts.map(t => (
        <div key={t.id} className="glass-strong" style={{
          padding: '12px 16px',
          borderRadius: 'var(--r-md)',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--sh-lg)',
          animation: 'rise 0.4s var(--ease-spring)',
        }}>
          <span style={{ fontSize: 20 }}>{t.icon || '🌿'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
            {t.desc && <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>{t.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  useSpring, useMousePos, CursorBlob, KineticText, TiltCard, Reveal, useScrollY, MorphBlob, ProgressRing, useToast, ToastHost
});
