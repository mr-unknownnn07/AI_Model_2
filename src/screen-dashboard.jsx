/* global React */
/* Dashboard — "My Garden" bento */

const { useState: dS, useEffect: dE } = React;

function ScreenDashboard({ onNav, push }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob; const PR = window.ProgressRing;

  const plants = [
    { name: 'Tomato · Sungold', status: 'healthy', next: 'water in 2d', color: '#E07856', hp: 0.94 },
    { name: 'Rose · Papa Meilland', status: 'watch', next: 'early black spot', color: '#C25477', hp: 0.62 },
    { name: 'Basil · Genovese', status: 'healthy', next: 'trim tips', color: '#6B944C', hp: 0.88 },
    { name: 'Mint', status: 'thriving', next: 'propagate', color: '#92B56E', hp: 0.96 },
    { name: 'Lemon', status: 'watch', next: 'leaf miner?', color: '#F5C64E', hp: 0.71 },
  ];
  const [selected, setSelected] = dS(1);

  return (
    <div className="scroll" data-screen-label="Dashboard">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Good morning, Abhay</span>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)', marginTop: 10 }}>
                <K text="Your garden is " /><em style={{ fontStyle: 'italic', color: 'var(--sage-500)' }}><K text="mostly" delay={0.5} /></em><K text=" well." delay={0.75} />
              </h1>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sage-600)', textAlign: 'right' }}>
              <div>mon · 24 apr</div>
              <div>sunrise 06:12 · sunset 19:04</div>
            </div>
          </div>
        </RV>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, gridAutoRows: 'minmax(120px, auto)' }}>
          {/* Hero plant card */}
          <RV style={{ gridColumn: 'span 6', gridRow: 'span 2' }}>
            <TC className="glass-strong" style={{ padding: 28, height: '100%', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -40 }}>
                <Blob size={360} color="rgba(194,84,119,0.26)" duration={13} />
              </div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span className="chip chip-clay">⚠ needs attention</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--sage-600)' }}>last scan · 2h ago</span>
                </div>
                <div className="display" style={{ fontSize: 52, lineHeight: 1 }}>Papa Meilland</div>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 6 }}>Rose · hybrid tea · east-facing</div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'end' }}>
                <div className="ph" style={{ height: 160, aspectRatio: '1/1' }}><span>rose · leaf</span></div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>likely disease</div>
                  <div className="display" style={{ fontSize: 32, marginBottom: 10 }}>Black Spot <em>· early</em></div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <span className="chip">fungal</span>
                    <span className="chip">humid-weather</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" onClick={() => onNav('treatment')}>Treat now <window.IcoArrowR size={14} /></button>
                    <button className="btn btn-ghost" onClick={() => onNav('scan')}>Rescan</button>
                  </div>
                </div>
              </div>
            </TC>
          </RV>

          {/* Health ring */}
          <RV delay={0.08} style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
            <TC className="glass" style={{ padding: 22, height: '100%', display: 'flex', gap: 16, alignItems: 'center', minHeight: 120 }}>
              <PR value={0.82} size={84} stroke={8}>
                <div className="display" style={{ fontSize: 26 }}>82</div>
              </PR>
              <div>
                <div className="eyebrow">garden score</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 4 }}>Thriving</div>
                <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>↑ 6 this week</div>
              </div>
            </TC>
          </RV>

          {/* Weather */}
          <RV delay={0.12} style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
            <TC className="glass" style={{ padding: 22, height: '100%', minHeight: 120, background: 'linear-gradient(135deg, rgba(184,216,216,0.3), rgba(255,253,247,0.5))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="eyebrow">today</div>
                  <div className="display" style={{ fontSize: 38, marginTop: 4 }}>22° <em>clear</em></div>
                </div>
                <window.IcoSun size={32} style={{ color: 'var(--sun)' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--sage-700)' }}>
                <span><window.IcoDroplet size={12} /> 48%</span>
                <span>wind 7kmh</span>
                <span>uv 5</span>
              </div>
            </TC>
          </RV>

          {/* Plant roster */}
          <RV delay={0.16} style={{ gridColumn: 'span 6', gridRow: 'span 2' }}>
            <div className="glass" style={{ padding: 22, minHeight: 260 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <span className="eyebrow">roster</span>
                  <div className="display" style={{ fontSize: 26, marginTop: 4 }}>5 plants · drag to reorder</div>
                </div>
                <button className="chip chip-sage"><window.IcoPlus size={12} /> add</button>
              </div>
              <DragList items={plants} selected={selected} onSelect={setSelected} push={push} />
            </div>
          </RV>

          {/* Scan CTA */}
          <RV delay={0.2} style={{ gridColumn: 'span 3' }}>
            <TC className="glass" onClick={() => onNav('scan')} style={{ padding: 22, minHeight: 160, background: 'linear-gradient(135deg, rgba(245,198,78,0.2), rgba(245,198,78,0.02))', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <window.IcoScan size={28} style={{ color: 'var(--sage-600)' }} />
              <div>
                <div className="display" style={{ fontSize: 24 }}>New scan</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>Diagnose any leaf →</div>
              </div>
            </TC>
          </RV>

          {/* Weekly stat */}
          <RV delay={0.24} style={{ gridColumn: 'span 3' }}>
            <TC className="glass" style={{ padding: 22, minHeight: 160 }}>
              <div className="eyebrow">this week</div>
              <div className="display" style={{ fontSize: 44, marginTop: 6 }}>7<span style={{ fontSize: 22 }}> scans</span></div>
              <MiniBar />
            </TC>
          </RV>

          {/* Tip of day */}
          <RV delay={0.28} style={{ gridColumn: 'span 6' }}>
            <TC className="glass" style={{ padding: 22, minHeight: 160 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <window.IcoSparkle size={18} />
                </div>
                <div>
                  <span className="chip chip-sun">tip of the day</span>
                  <div className="display" style={{ fontSize: 22, marginTop: 8, lineHeight: 1.2 }}>Water roses at the base, not the leaves — wet foliage invites <em>black spot</em>.</div>
                </div>
              </div>
            </TC>
          </RV>

          {/* Community preview */}
          <RV delay={0.32} style={{ gridColumn: 'span 6' }}>
            <div className="glass" style={{ padding: 22, minHeight: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="eyebrow">from the community</span>
                <button className="chip" onClick={() => onNav('community')}>see all <window.IcoArrowR size={11} /></button>
              </div>
              {[
                { u: 'Meera K.', t: 'Fixed my tomato blight in 3 days w/ neem + baking soda ✨', likes: 42 },
                { u: 'Dr. Patel', t: 'Reminder: dispose of infected leaves, do NOT compost.', likes: 88 },
              ].map((p, i) => (
                <div key={i} style={{ padding: '12px 0', borderTop: i ? '1px dashed var(--glass-border)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ['#C25477','#6B944C'][i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{p.u.slice(0,1)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.u}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>{p.t}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--sage-600)' }}>♡ {p.likes}</div>
                </div>
              ))}
            </div>
          </RV>
        </div>
      </div>
    </div>
  );
}

function DragList({ items: init, selected, onSelect, push }) {
  const [items, setItems] = dS(init);
  const [dragIdx, setDragIdx] = dS(-1);
  const [overIdx, setOverIdx] = dS(-1);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = () => {
    if (dragIdx < 0 || overIdx < 0 || dragIdx === overIdx) { setDragIdx(-1); setOverIdx(-1); return; }
    const arr = [...items];
    const [m] = arr.splice(dragIdx, 1);
    arr.splice(overIdx, 0, m);
    setItems(arr);
    setDragIdx(-1); setOverIdx(-1);
    push && push({ icon: '🌱', title: 'Plant reordered', desc: 'Your garden layout is saved.' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((p, i) => (
        <div
          key={p.name}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDrop={onDrop}
          onClick={() => onSelect(i)}
          style={{
            display: 'grid', gridTemplateColumns: '16px 32px 1fr auto auto', gap: 12, alignItems: 'center',
            padding: '10px 12px', borderRadius: 12,
            background: overIdx === i ? 'rgba(245,198,78,0.18)' : selected === i ? 'rgba(110,180,90,0.14)' : 'transparent',
            border: '1px solid ' + (selected === i ? 'rgba(53,97,31,0.2)' : 'transparent'),
            cursor: 'grab',
            transition: 'background 0.2s, transform 0.3s var(--ease-spring)',
            opacity: dragIdx === i ? 0.5 : 1,
          }}
        >
          <span style={{ color: 'var(--sage-500)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>⋮⋮</span>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: p.color }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--sage-600)' }}>{p.next}</div>
          </div>
          <div style={{ width: 60, height: 4, borderRadius: 99, background: 'rgba(33,71,19,0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${p.hp*100}%`, height: '100%', background: p.hp > 0.75 ? 'var(--sage-500)' : 'var(--sun)' }} />
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--sage-600)' }}>{Math.round(p.hp*100)}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBar() {
  const vals = [1, 2, 1, 0, 2, 1, 0];
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 14, alignItems: 'flex-end', height: 44 }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${20 + v * 12}px`, borderRadius: 4, background: v ? 'var(--sage-400)' : 'rgba(33,71,19,0.12)', transition: 'height 0.6s var(--ease-spring)' }} />
      ))}
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
