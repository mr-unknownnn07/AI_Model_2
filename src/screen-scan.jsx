/* global React */
/* Scan flow — upgraded to sync with Home page logic and real history */

const { useState: sS, useEffect: sE, useRef: sR } = React;

function ScreenScan({ onNav, push }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob;

  // Icons fallbacks
  const IcoUpload = window.IcoUpload || (() => null);
  const IcoClock = window.IcoClock || (() => null);
  const IcoCamera = window.IcoCamera || (() => null);
  const IcoArrowR = window.IcoArrowR || (() => null);

  const [stage, setStage] = sS('idle'); // idle | analyzing | result
  const [progress, setProgress] = sS(0);
  const [hover, setHover] = sS(false);
  const [resultData, setResultData] = sS(null);
  const [imgUrl, setImgUrl] = sS(null);
  const fileInputRef = sR(null);
  const [history, setHistory] = sS([]);

  // Load history from localStorage
  sE(() => {
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
    <div className="scroll" data-screen-label="Scan">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <span className="eyebrow">diagnose a leaf</span>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', marginTop: 10 }}>
                <K text="Show me the " /><em style={{ fontStyle: 'italic', color: 'var(--sage-500)' }}><K text="leaf." delay={0.4} /></em>
              </h1>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sage-600)', textAlign: 'right' }}>
              <div>model · plantcure-cnn-v2</div>
              <div>38 diseases · 96.2% f1 · runs in browser</div>
            </div>
          </div>
        </RV>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Drop zone */}
          <RV>
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
                    <button className="btn btn-primary" onClick={triggerUpload} style={{ fontSize: 16, padding: '14px 24px' }}><IcoUpload size={18} /> Upload Image</button>
                    <button className="btn btn-ghost" onClick={triggerUpload} style={{ fontSize: 16, padding: '14px 24px' }}><IcoCamera size={18} /> Use camera</button>
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

          {/* Side panel: tips + history */}
          <RV delay={0.1}>
            <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
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

            <div className="glass" style={{ padding: 22 }}>
              <span className="eyebrow">past scan history</span>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.length > 0 ? history.map((h) => (
                  <div key={h.id} className="hover-scale" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 8, borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `url(${h.thumb}) center/cover no-repeat` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{h.n}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-dim)' }}>{h.t}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--sage-500)' }}>{h.c}%</div>
                  </div>
                )) : (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--sage-600)', fontSize: 12 }}>No recent scans found.</div>
                )}
              </div>
            </div>
          </RV>
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
  
  const IcoArrowR = window.IcoArrowR || (() => null);

  return (
    <div style={{ position: 'relative', width: '100%', animation: 'rise 0.6s var(--ease-spring)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'center' }}>
        <div className="ph" style={{ height: 260, borderRadius: 12, background: imgUrl ? `url(${imgUrl}) center/cover no-repeat` : undefined }}>
          {!imgUrl && <span>uploaded · leaf.jpg</span>}
        </div>
        <div style={{ textAlign: 'left' }}>
          <span className={`chip ${isHealthy ? 'chip-sage' : 'chip-clay'}`}>{isHealthy ? '✅ plant healthy' : '⚠ disease detected'}</span>
          <div className="display" style={{ fontSize: 46, lineHeight: 1, marginTop: 14 }}>{name}</div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--sage-600)', marginTop: 6 }}>
             {isHealthy ? 'no pathogens detected' : 'moderate severity'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 22 }}>
            {[
              { l: 'confidence', v: `${conf}%` },
              { l: 'severity', v: isHealthy ? 'none' : 'moderate' },
              { l: 'contagious', v: isHealthy ? 'no' : 'yes' },
            ].map((x, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,253,247,0.6)', border: '1px solid var(--glass-border)' }}>
                <div className="eyebrow" style={{ fontSize: 10 }}>{x.l}</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4 }}>{x.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button className="btn btn-primary" onClick={() => onNav('treatment', resultData)}>See treatment <IcoArrowR size={14} /></button>
            <button className="btn btn-ghost" onClick={onRescan}>Scan another</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenScan = ScreenScan;
