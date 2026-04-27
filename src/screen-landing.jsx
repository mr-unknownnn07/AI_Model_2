/* global React */
/* Landing screen — Landon-Norris-style kinetic hero + bento features + workflow */

const { useState: lS, useEffect: lE, useRef: lR } = React;

function ScreenLanding({ onNav, intensity, push }) {
  const K = window.KineticText;
  const TC = window.TiltCard;
  const RV = window.Reveal;
  const Blob = window.MorphBlob;

  // Icons
  const IcoUpload = window.IcoUpload || (() => null);
  const IcoClock = window.IcoClock || (() => null);
  const IcoSparkle = window.IcoSparkle || (() => null);
  const IcoArrowUR = window.IcoArrowUR || (() => null);
  const IcoArrowR = window.IcoArrowR || (() => null);

  const [stage, setStage] = lS('idle'); // idle | analyzing | result
  const [progress, setProgress] = lS(0);
  const [hover, setHover] = lS(false);
  const [resultData, setResultData] = lS(null);
  const [imgUrl, setImgUrl] = lS(null);
  const fileInputRef = lR(null);
  const [history, setHistory] = lS([]);

  lE(() => {
    try {
      const saved = localStorage.getItem('plantcure_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const generateThumbnail = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const saveToHistory = async (data, file) => {
    const thumbnail = await generateThumbnail(file);
    
    let severity = 'Medium';
    if (data.isHealthy) severity = 'Low';
    else if (data.name.includes('Blight') || data.name.includes('Wilt') || data.name.includes('Rot')) severity = 'High';

    const newItem = {
      id: Date.now(),
      n: data.name,
      c: data.confidence,
      t: new Date().toLocaleString(),
      thumb: thumbnail,
      isHealthy: data.isHealthy,
      severity,
      treatment: data.isHealthy ? 'No treatment needed.' : 'Prune infected leaves and apply appropriate fungicide/organic remedy.',
      badge: data.isHealthy ? 'Healthy' : (data.name.includes('Fungal') ? 'Fungal' : (data.name.includes('Bacterial') ? 'Bacterial' : 'Viral'))
    };
    const updated = [newItem, ...history].slice(0, 5);
    setHistory(updated);
    try {
      localStorage.setItem('plantcure_history', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const localUrl = URL.createObjectURL(file);
    setImgUrl(localUrl);
    setStage('analyzing');
    setProgress(0.1);
    
    const intv = setInterval(() => setProgress(p => Math.min(0.9, p + 0.1)), 400);

    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch('/predict', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      clearInterval(intv);
      setProgress(1);
      
      setTimeout(() => {
        const resData = {
          name: data.prediction,
          confidence: data.confidence,
          isHealthy: data.prediction.toLowerCase() === 'healthy',
          imgUrl: localUrl
        };
        setResultData(resData);
        saveToHistory(resData, file);
        setStage('result');
        push && push({ icon: '✨', title: 'Diagnosis ready', desc: `${data.prediction} · ${data.confidence}% confidence` });
      }, 500);

    } catch (err) {
      clearInterval(intv);
      alert("Error analyzing image: " + err.message);
      setStage('idle');
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

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
              v2.1 · History Dashboard Active
            </span>
            <span className="eyebrow">2026 · botanical intelligence</span>
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(52px, 9vw, 120px)', letterSpacing: '-0.04em', marginBottom: 28, textAlign: 'center' }}>
            <K text="Every leaf" />
            <K text=" tells a " delay={0.3} />
            <K text="story." delay={0.6} italicWords={['story.']} />
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'start', marginTop: 40 }}>
            <RV delay={1.0}>
              {/* Drop zone */}
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="glass-strong"
                style={{
                  padding: 36, borderRadius: 'var(--r-xl)',
                  minHeight: 520,
                  border: `2px dashed ${hover ? 'var(--sage-500)' : 'var(--glass-border-strong)'}`,
                  background: hover ? 'rgba(146,181,110,0.08)' : 'var(--glass-strong)',
                  transition: 'all 0.3s var(--ease-out)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <Blob size={400} color="rgba(146,181,110,0.2)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'drift 14s ease-in-out infinite' }} />
                </div>

                {stage === 'idle' && (
                  <>
                    <LeafDrop hover={hover} />
                    <div className="display" style={{ fontSize: 42, marginTop: 22, position: 'relative' }}>Analyze Plant Health</div>
                    <div style={{ color: 'var(--ink-2)', marginTop: 8, position: 'relative' }}>Drop a leaf image here or click to upload. JPG / PNG, up to 10 MB.</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 24, position: 'relative' }}>
                      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                      <button className="btn btn-primary" onClick={triggerUpload} style={{ fontSize: 18, padding: '16px 32px' }}><IcoUpload size={20} /> Upload Image</button>
                    </div>
                    <div className="mono" style={{ marginTop: 20, fontSize: 11, color: 'var(--sage-600)', position: 'relative' }}>100% local · nothing uploaded</div>
                  </>
                )}

                {stage === 'analyzing' && (
                  <>
                    <ScanningLeaf progress={progress} />
                    <div className="display" style={{ fontSize: 42, marginTop: 22, position: 'relative' }}>
                      {progress < 0.25 ? 'Scanning leaf texture...' : progress < 0.5 ? 'Comparing disease patterns...' : progress < 0.75 ? 'Running AI diagnosis...' : 'Generating treatment guidance...'}
                    </div>
                    <div style={{ width: 280, marginTop: 18, position: 'relative' }}>
                      <div style={{ height: 4, background: 'rgba(33,71,19,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${progress*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--sage-500), var(--sun))', transition: 'width 0.1s linear' }} />
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--sage-600)', marginTop: 6, textAlign: 'center' }}>{Math.round(progress*100)}% · tensorflow.js on-device</div>
                    </div>
                  </>
                )}

                {stage === 'result' && <ResultView onNav={onNav} onRescan={() => setStage('idle')} resultData={resultData} imgUrl={imgUrl} />}
              </div>
            </RV>

            <RV delay={1.2}>
              <div className="glass" style={{ padding: 22, height: '100%' }}>
                <span className="eyebrow">for best results</span>
                <div className="display" style={{ fontSize: 24, marginTop: 6, marginBottom: 16 }}>Photograph the <em>symptom</em>, not the plant.</div>
                {[
                  { i: '☀️', t: 'Daylight', d: 'Diffuse shade works best. Avoid harsh shadows.' },
                  { i: '📐', t: 'Fill the frame', d: 'The affected area should cover 60% of the photo.' },
                  { i: '🍃', t: 'Flat leaf', d: 'Place on a neutral surface if you can.' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i ? '1px dashed var(--glass-border)' : 'none' }}>
                    <div style={{ fontSize: 22 }}>{t.i}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>{t.d}</div>
                    </div>
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

      {/* ── Past Scan History Section ── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <RV>
            <span className="eyebrow">Your records</span>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 5.5vw, 78px)', marginTop: 14, marginBottom: 12 }}>
              Past Scan History
            </h2>
            <p style={{ fontSize: 18, color: 'var(--ink-2)', marginBottom: 48 }}>
              Review recently analyzed plant health reports generated by the AI engine.
            </p>
          </RV>

          {history.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {history.map((h) => (
                <RV key={h.id}>
                  <TC className="glass hover-scale" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="ph" style={{ height: 180, background: `url(${h.thumb}) center/cover no-repeat`, border: 'none', borderRadius: 'var(--r-lg) var(--r-lg) 0 0' }}>
                    </div>
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span className={`chip ${h.isHealthy ? 'chip-sage' : 'chip-clay'}`} style={{ fontSize: 10 }}>{h.badge}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-dim)', fontSize: 11 }}>
                          <IcoClock size={12} />
                          {h.t}
                        </div>
                      </div>
                      <h3 className="display" style={{ fontSize: 24, marginBottom: 14 }}>{h.n}</h3>
                      
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>Confidence</span>
                          <span className="mono" style={{ fontSize: 10, color: 'var(--sage-500)' }}>{h.c}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(33,71,19,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ width: `${h.c}%`, height: '100%', background: 'linear-gradient(90deg, var(--sage-500), var(--sun))' }} />
                        </div>
                      </div>
                    </div>
                  </TC>
                </RV>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(33,71,19,0.02)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍃</div>
              <div className="display" style={{ fontSize: 24, color: 'var(--ink-2)' }}>No previous scans available.</div>
              <p style={{ marginTop: 8, color: 'var(--ink-dim)' }}>Upload a leaf photo above to see your history here.</p>
            </div>
          )}
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
                  <IcoSparkle size={16} />
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
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
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

function LeafDrop({ hover }) {
  return (
    <svg width={140} height={140} viewBox="0 0 100 100" style={{ position: 'relative', animation: hover ? 'floatY 2s ease-in-out infinite' : 'floatY 4s ease-in-out infinite', transition: 'transform 0.5s' }}>
      <defs>
        <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#92B56E" />
          <stop offset="1" stopColor="#214713" />
        </linearGradient>
      </defs>
      <path d="M50 10 C 20 20, 15 60, 50 90 C 85 60, 80 20, 50 10 Z" fill="url(#leafG)" opacity="0.85" />
      <path d="M50 10 L 50 90" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M50 30 Q 35 35, 30 50 M50 50 Q 35 55, 32 70 M50 30 Q 65 35, 70 50 M50 50 Q 65 55, 68 70" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function ScanningLeaf({ progress }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width={160} height={160} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="leafG2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#92B56E" />
            <stop offset="1" stopColor="#214713" />
          </linearGradient>
          <clipPath id="leafClip"><path d="M50 10 C 20 20, 15 60, 50 90 C 85 60, 80 20, 50 10 Z" /></clipPath>
        </defs>
        <path d="M50 10 C 20 20, 15 60, 50 90 C 85 60, 80 20, 50 10 Z" fill="url(#leafG2)" opacity="0.9" />
        <g clipPath="url(#leafClip)">
          <rect x="0" y={progress * 100 - 2} width="100" height="4" fill="#F5C64E" opacity="0.9" />
          <rect x="0" y="0" width="100" height={progress * 100} fill="rgba(245,198,78,0.18)" />
        </g>
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={30 + (i*8)} cy={30 + (i%3)*12} r="2" fill="#F5C64E" opacity={progress > (i/6) ? 1 : 0.15} style={{ transition: 'opacity 0.3s' }} />
        ))}
      </svg>
    </div>
  );
}

function ResultView({ onNav, onRescan, resultData, imgUrl }) {
  const isHealthy = resultData?.isHealthy;
  const name = resultData?.name || 'Leaf Rust';
  const conf = resultData?.confidence || '94';
  
  let severity = 'Medium';
  let badgeColor = 'var(--sun)';
  if (isHealthy) {
    severity = 'Low';
    badgeColor = 'var(--sage-500)';
  } else if (name.includes('Blight') || name.includes('Wilt') || name.includes('Rot')) {
    severity = 'High';
    badgeColor = 'var(--clay)';
  }
  
  let observationText = isHealthy ? 'Detected healthy leaf tissue and normal coloration.' : 'Detected irregular lesions, discoloration patterns, and potential pathogen spread.';
  if (name.includes('Fungal') || name.includes('Mildew') || name.includes('Rust') || name.includes('Spot')) {
    observationText = 'Detected circular lesions and irregular fungal spot patterns on leaf surface.';
  } else if (name.includes('Bacterial')) {
    observationText = 'Detected water-soaked spots, possible oozing, and bacterial lesions.';
  } else if (name.includes('Viral') || name.includes('Mosaic')) {
    observationText = 'Detected mottling, mosaic patterns, and distorted leaf veins indicative of viral infection.';
  }

  return (
    <div style={{ position: 'relative', width: '100%', animation: 'rise 0.6s var(--ease-spring)', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className={`chip ${isHealthy ? 'chip-sage' : 'chip-clay'}`}>{isHealthy ? '✅ Plant Healthy' : '⚠ Disease Detected'}</span>
        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onRescan}>Scan another</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'start' }}>
        <div className="ph" style={{ height: 200, borderRadius: 'var(--r-md)', background: imgUrl ? `url(${imgUrl}) center/cover no-repeat` : undefined }}>
          {!imgUrl && <span>uploaded · leaf.jpg</span>}
        </div>
        <div>
          <div className="display" style={{ fontSize: 36, lineHeight: 1.1 }}>{name}</div>
          
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: 'rgba(255,253,247,0.6)', border: '1px solid var(--glass-border)' }}>
             <div className="eyebrow" style={{ fontSize: 10, color: 'var(--sage-600)' }}>AI Observation</div>
             <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.4 }}>{observationText}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 16 }}>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>Confidence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'rgba(33,71,19,0.1)' }}>
                  <div style={{ width: `${conf}%`, height: '100%', background: 'linear-gradient(90deg, var(--sage-500), var(--sun))', borderRadius: 99 }} />
                </div>
                <div className="mono" style={{ fontSize: 14 }}>{conf}%</div>
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>Severity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: badgeColor }}></span>
                <div className="display" style={{ fontSize: 18 }}>{severity}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 12, fontSize: 10, color: 'var(--sage-600)' }}>Disease Reference Profiles</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { n: 'Healthy', c: '#6B944C' },
            { n: 'Fungal', c: '#E07856' },
            { n: 'Bacterial', c: '#B8D8D8' },
            { n: 'Viral', c: '#F5C64E' }
          ].map(r => (
            <div key={r.n} style={{ padding: 10, borderRadius: 8, background: 'var(--glass)', textAlign: 'center', border: (name.includes(r.n) || (isHealthy && r.n === 'Healthy')) ? `2px solid ${r.c}` : '1px solid transparent' }}>
              <div style={{ width: 32, height: 32, margin: '0 auto 6px', borderRadius: 6, background: r.c, opacity: 0.8 }} />
              <div style={{ fontSize: 11, fontWeight: 500 }}>{r.n}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, padding: '16px 0', fontSize: 16 }} onClick={() => onNav('treatment', resultData)}>View Treatment Plan <IcoArrowR size={16} /></button>
    </div>
  );
}

window.ScreenLanding = ScreenLanding;
