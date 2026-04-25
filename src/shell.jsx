/* global React, KineticText, TiltCard, Reveal, MorphBlob, ProgressRing, useMousePos, useSpring, CursorBlob */
/* App shell — nav rail + topbar + command palette */

const { useState: uS, useEffect: uE, useRef: uR } = React;

function NavRail({ current, onNav, TWEAKS }) {
  const items = [
    { id: 'landing', label: 'Home', Ico: window.IcoHome },
    { id: 'dashboard', label: 'My Garden', Ico: window.IcoLeaf },
    { id: 'scan', label: 'Scan', Ico: window.IcoScan },
    { id: 'treatment', label: 'Treatment', Ico: window.IcoPill },
    { id: 'shop', label: 'Pharmacy', Ico: window.IcoShop },
    { id: 'community', label: 'Community', Ico: window.IcoUsers },
  ];
  return (
    <aside className="rail">
      <div className="brand">
        <div className="brand-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 7 7c0 5-4 9-9 9zM5 20c3.5-5 7-7 13-8" />
          </svg>
        </div>
        <span>PlantCure</span>
      </div>

      <nav className="nav">
        {items.map(({ id, label, Ico }) => (
          <button
            key={id}
            className={`nav-item ${current === id ? 'active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Ico size={17} />
            <span>{label}</span>
            {current === id && (
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--sun)' }} />
            )}
          </button>
        ))}
      </nav>

      <div className="nav-sub">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sage-500)', marginBottom: 8 }}>Today</div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, color: 'var(--ink)', lineHeight: 1, marginBottom: 6 }}>22° <em style={{ color: 'var(--sage-500)' }}>clear</em></div>
        <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>3 plants need water<br/>1 awaiting diagnosis</div>
      </div>
    </aside>
  );
}

function TopBar({ onOpenPalette, onNav }) {
  return (
    <div className="topbar">
      <button className="glass search" onClick={onOpenPalette} style={{ borderRadius: 'var(--r-pill)' }}>
        <window.IcoSearch size={15} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search plants, diseases, treatments…</span>
        <span className="kbd">⌘K</span>
      </button>
      <button className="glass" style={{ padding: 12, borderRadius: 'var(--r-pill)' }}>
        <window.IcoBell size={16} />
      </button>
      <button className="btn btn-primary" onClick={() => onNav('scan')}>
        <window.IcoScan size={15} />
        <span>New scan</span>
      </button>
    </div>
  );
}

function CommandPalette({ open, onClose, onNav }) {
  const [q, setQ] = uS('');
  const inputRef = uR(null);
  uE(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const items = [
    { type: 'nav', label: 'Go to Home', id: 'landing', hint: 'Home' },
    { type: 'nav', label: 'Go to My Garden', id: 'dashboard', hint: 'Dashboard' },
    { type: 'nav', label: 'Start a new scan', id: 'scan', hint: 'Scan' },
    { type: 'nav', label: 'Open Treatments', id: 'treatment', hint: 'Treatment' },
    { type: 'nav', label: 'Open Pharmacy', id: 'shop', hint: 'Shop' },
    { type: 'nav', label: 'Open Community', id: 'community', hint: 'Community' },
    { type: 'info', label: 'Powdery Mildew — natural remedies', hint: 'Disease' },
    { type: 'info', label: 'Black Spot — symptoms & cure', hint: 'Disease' },
    { type: 'info', label: 'Neem oil spray recipe', hint: 'Remedy' },
  ];
  const filtered = q ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items;

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,46,28,0.25)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', animation: 'rise 0.3s var(--ease-out)' }} onClick={onClose}>
      <div className="glass-strong" onClick={e => e.stopPropagation()} style={{ width: 'min(560px, 92vw)', borderRadius: 'var(--r-lg)', padding: 10, boxShadow: 'var(--sh-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--glass-border)' }}>
          <window.IcoSearch size={16} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15 }} />
          <span className="kbd">esc</span>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 6 }}>
          {filtered.map((it, i) => (
            <button key={i} onClick={() => { if (it.type === 'nav') { onNav(it.id); onClose(); } }} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', fontSize: 14 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(33,71,19,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ flex: 1 }}>{it.label}</span>
              <span className="chip chip-sage" style={{ fontSize: 10 }}>{it.hint}</span>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ padding: 28, textAlign: 'center', color: 'var(--sage-600)', fontSize: 13 }}>No matches</div>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NavRail, TopBar, CommandPalette });
