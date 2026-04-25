/* global React */
/* Landing screen — Landon-Norris-style kinetic hero + bento features + workflow */

const { useState: lS, useEffect: lE, useRef: lR } = React;

function ScreenLanding({ onNav, intensity }) {
  const K = window.KineticText;
  const TC = window.TiltCard;
  const RV = window.Reveal;
  const Blob = window.MorphBlob;

  return (
    <div className="scroll" data-screen-label="Landing">
      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '92vh', padding: '40px 40px 80px', overflow: 'hidden' }}>
        {/* Ambient morph blobs */}
        <div className="ambient-blobs">
          <Blob size={640} color="rgba(146,181,110,0.35)" style={{ position: 'absolute', top: -120, right: -120, animation: 'drift 16s ease-in-out infinite' }} />
          <Blob size={460} color="rgba(245,198,78,0.30)" duration={10} style={{ position: 'absolute', bottom: -80, left: -40, animation: 'drift 22s ease-in-out infinite reverse' }} />
          <Blob size={320} color="rgba(184,216,216,0.45)" duration={18} style={{ position: 'absolute', top: '30%', left: '40%', animation: 'drift 28s ease-in-out infinite' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 44 }}>
            <span className="chip chip-sage">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage-500)', animation: 'pulse 2s infinite', boxShadow: '0 0 10px var(--sage-500)' }} />
              v2.0 · now with 38 diseases &amp; offline AI
            </span>
            <span className="eyebrow">2026 · botanical intelligence</span>
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(72px, 11vw, 180px)', letterSpacing: '-0.04em', marginBottom: 28 }}>
            <K text="Every leaf" />
            <br/>
            <K text="tells a " delay={0.3} />
            <K text="story." delay={0.6} italicWords={['story.']} />
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'end', marginTop: 60 }}>
            <RV delay={1.0}>
              <p style={{ fontSize: 20, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 560 }}>
                Point your camera at any plant. In under <em style={{ fontFamily: 'var(--f-display)', color: 'var(--sage-500)', fontSize: 24 }}>two seconds</em>, PlantCure reads its symptoms, names the disease, and hands you a cure — natural or professional.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => onNav('scan')}>
                  <window.IcoScan size={16} />
                  Scan a leaf
                  <window.IcoArrowR size={14} />
                </button>
                <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>
                  See the dashboard
                </button>
              </div>
            </RV>

            <RV delay={1.2}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { v: '96%', l: 'accuracy' },
                  { v: '< 2s', l: 'per scan' },
                  { v: '38+', l: 'diseases' },
                ].map((s, i) => (
                  <div key={i} className="glass" style={{ padding: 18, textAlign: 'left' }}>
                    <div className="display" style={{ fontSize: 40, marginBottom: 4 }}>{s.v}</div>
                    <div className="eyebrow" style={{ fontSize: 10 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </RV>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <section style={{ padding: '12px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden', background: 'rgba(255,253,247,0.4)' }}>
        <div style={{ display: 'flex', gap: 44, whiteSpace: 'nowrap', animation: 'scroll-strip 40s linear infinite', fontFamily: 'var(--f-display)', fontSize: 28 }}>
          {Array.from({ length: 2 }).map((_, rep) => (
            <React.Fragment key={rep}>
              {['powdery mildew', 'black spot', 'rust disease', 'leaf blight', 'fusarium wilt', 'bacterial spot', 'anthracnose', 'root rot', 'downy mildew', 'mosaic virus'].map((w, i) => (
                <React.Fragment key={i}>
                  <span>{w}</span>
                  <span style={{ color: 'var(--sun)' }}>✦</span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
        <style>{`@keyframes scroll-strip { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* ── Bento feature grid ── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <RV>
            <span className="eyebrow">What's inside</span>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 5.5vw, 78px)', marginTop: 14, marginBottom: 48, maxWidth: 820 }}>
              A garden's worth of intelligence, <em style={{ color: 'var(--sage-500)' }}>bundled softly</em>.
            </h2>
          </RV>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18, gridAutoRows: 'minmax(180px, auto)' }}>
            {/* Big scan card */}
            <RV style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
              <TC className="glass" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 380, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40 }}>
                  <Blob size={300} color="rgba(110,180,90,0.35)" duration={12} />
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span className="chip chip-sage">AI detector</span>
                  <h3 className="display" style={{ fontSize: 42, marginTop: 18, maxWidth: 320 }}>Scan → diagnose → cure, in one breath.</h3>
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <ScanPreview />
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--sage-600)' }}>model · tfjs · 96.2% f1</span>
                    <span style={{ marginLeft: 'auto' }}><window.IcoArrowUR size={16} /></span>
                  </div>
                </div>
              </TC>
            </RV>

            {/* Privacy */}
            <RV delay={0.1} style={{ gridColumn: 'span 3' }}>
              <TC className="glass" style={{ padding: 28, height: '100%', minHeight: 180, background: 'linear-gradient(135deg, rgba(245,198,78,0.18), rgba(245,198,78,0.04))', borderColor: 'rgba(245,198,78,0.3)' }}>
                <span className="chip chip-sun">100% local</span>
                <h3 className="display" style={{ fontSize: 30, marginTop: 14 }}>Your leaves never leave the browser.</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Inference runs client-side on TensorFlow.js. No uploads. No cloud. No waiting.</p>
              </TC>
            </RV>

            {/* Community */}
            <RV delay={0.15} style={{ gridColumn: 'span 2' }}>
              <TC className="glass" style={{ padding: 24, height: '100%', minHeight: 180 }}>
                <div style={{ display: 'flex', gap: -8 }}>
                  {['#C25477', '#F5C64E', '#6B944C', '#B8D8D8'].map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, marginLeft: i ? -10 : 0, border: '2px solid var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>{['KB','GM','RN','AP'][i]}</div>
                  ))}
                </div>
                <h3 className="display" style={{ fontSize: 26, marginTop: 14 }}>50,000 farmers, one thread.</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>Swap tips with experts in 15+ languages.</p>
              </TC>
            </RV>

            {/* Treatment db */}
            <RV delay={0.2} style={{ gridColumn: 'span 2' }}>
              <TC className="glass" style={{ padding: 24, height: '100%', minHeight: 180 }}>
                <div className="display" style={{ fontSize: 56, color: 'var(--sage-500)' }}>150<span style={{ fontSize: 32 }}>+</span></div>
                <div className="eyebrow" style={{ marginTop: -4 }}>natural remedies</div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 10 }}>Neem, baking soda, garlic — kitchen-cabinet fixes with step-by-step recipes.</p>
              </TC>
            </RV>

            {/* Shop */}
            <RV delay={0.25} style={{ gridColumn: 'span 2' }}>
              <TC className="glass" style={{ padding: 24, height: '100%', minHeight: 180, background: 'linear-gradient(135deg, rgba(110,180,90,0.14), rgba(255,253,247,0.5))' }}>
                <span className="chip chip-sage">Pharmacy</span>
                <h3 className="display" style={{ fontSize: 26, marginTop: 14 }}>Buy the exact cure.</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>1,000+ products, 2-day delivery.</p>
              </TC>
            </RV>
          </div>
        </div>
      </section>

      {/* ── Workflow / process ── */}
      <section style={{ padding: '80px 40px 120px', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <RV>
            <span className="eyebrow">The loop</span>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 5vw, 70px)', marginTop: 14, marginBottom: 48, maxWidth: 760 }}>
              Four moves. <em style={{ color: 'var(--sage-500)' }}>One healthy plant.</em>
            </h2>
          </RV>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { n: '01', t: 'Snap', d: 'Take a clear photo of the affected leaf — daylight works best.' },
              { n: '02', t: 'Analyze', d: 'A CNN runs on-device and scans for 38+ visual symptoms.' },
              { n: '03', t: 'Diagnose', d: 'You get the disease, severity, and a confidence score.' },
              { n: '04', t: 'Cure', d: 'Pick natural or professional. Follow steps. Check back in 48h.' },
            ].map((s, i) => (
              <RV key={i} delay={i * 0.1}>
                <div className="glass" style={{ padding: 24, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--sage-500)', letterSpacing: '0.15em' }}>{s.n}</div>
                  <div>
                    <div className="display" style={{ fontSize: 38, marginBottom: 10 }}>{s.t}</div>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>{s.d}</p>
                  </div>
                </div>
              </RV>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 40px 120px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <RV>
            <div className="glass-strong" style={{ padding: '80px 48px', borderRadius: 'var(--r-xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <Blob size={500} color="rgba(245,198,78,0.25)" style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
              </div>
              <h2 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', marginBottom: 20, position: 'relative' }}>
                Plant, <em>scan</em>, repeat.
              </h2>
              <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 520, margin: '0 auto 32px', position: 'relative' }}>
                Free to start. Your leaves, your device, your garden.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative' }}>
                <button className="btn btn-sun" onClick={() => onNav('scan')}>
                  <window.IcoSparkle size={16} />
                  Try it now
                </button>
                <button className="btn btn-ghost" onClick={() => onNav('community')}>Meet the community</button>
              </div>
            </div>
          </RV>
        </div>
      </section>
    </div>
  );
}

function ScanPreview() {
  const [p, setP] = lS(0);
  lE(() => {
    let raf;
    const start = performance.now();
    const loop = (t) => {
      const dt = ((t - start) / 2600) % 1;
      setP(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="ph" style={{ height: 120, position: 'relative' }}>
        <span>leaf · jpg</span>
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${p * 100}%`, height: 2, background: 'linear-gradient(90deg, transparent, var(--sage-500), transparent)', boxShadow: '0 0 10px var(--sage-400)' }} />
      </div>
      <div className="glass-strong" style={{ padding: 14, borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div className="eyebrow" style={{ fontSize: 9 }}>detected</div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1 }}>Leaf Rust</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(33,71,19,0.12)', overflow: 'hidden' }}>
            <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, var(--sage-500), var(--sun))' }} />
          </div>
          <span className="mono" style={{ fontSize: 10 }}>94%</span>
        </div>
      </div>
    </div>
  );
}

window.ScreenLanding = ScreenLanding;
