/* global React */
/* Dashboard — "AI Plant Health Command Center" */

const { useState: dS, useEffect: dE, useMemo } = React;

function ScreenDashboard({ onNav, push }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob; const PR = window.ProgressRing;

  const [history, setHistory] = dS([]);

  // Load history from localStorage
  dE(() => {
    try {
      const saved = localStorage.getItem('plantcure_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // ── Derived Data ──
  const latest = history[0];
  const diseasedItems = history.filter(h => !h.isHealthy);
  
  const stats = useMemo(() => {
    const total = history.length;
    const healthy = history.filter(h => h.isHealthy).length;
    const diseased = total - healthy;
    
    const counts = {};
    history.forEach(h => { if(!h.isHealthy) counts[h.n] = (counts[h.n] || 0) + 1; });
    const common = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';
    
    return { total, healthy, diseased, common };
  }, [history]);

  const recovery = useMemo(() => {
    if (history.length < 2) return null;
    const cur = history[0];
    const prev = history[1];
    
    // Simple logic: if confidence of "Healthy" increased or disease confidence decreased?
    // User wants "Severity" comparison.
    const sevMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const curSev = sevMap[cur.severity] || 2;
    const prevSev = sevMap[prev.severity] || 2;
    
    let status = 'stable';
    let recoveryPct = 0;
    
    if (cur.isHealthy && !prev.isHealthy) {
      status = 'improving';
      recoveryPct = 100;
    } else if (curSev < prevSev) {
      status = 'improving';
      recoveryPct = 40;
    } else if (curSev > prevSev) {
      status = 'critical';
      recoveryPct = -20;
    }

    return { cur, prev, status, recoveryPct };
  }, [history]);

  return (
    <div className="scroll" data-screen-label="Dashboard">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <span className="eyebrow">AI health command center</span>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)', marginTop: 10 }}>
                <K text="System " /><em style={{ fontStyle: 'italic', color: 'var(--sage-500)' }}><K text="Monitoring" delay={0.5} /></em>
              </h1>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sage-600)', textAlign: 'right' }}>
              <div style={{ color: 'var(--sun)' }}>● engine online</div>
              <div>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            </div>
          </div>
        </RV>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
          
          {/* 1. LATEST DIAGNOSIS REPORT (Main Hero Card) */}
          <RV style={{ gridColumn: 'span 8', gridRow: 'span 2' }}>
            <TC className="glass-strong" style={{ padding: 32, height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -40 }}>
                <Blob size={400} color={latest?.isHealthy ? "rgba(146,181,110,0.2)" : "rgba(194,84,119,0.15)"} />
              </div>
              
              {latest ? (
                <>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <span className={`chip ${latest.isHealthy ? 'chip-sage' : 'chip-clay'}`}>
                        {latest.isHealthy ? '✓ healthy' : `⚠ ${latest.severity} severity`}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--sage-600)' }}>Latest scan · {latest.t}</span>
                    </div>
                    <div className="display" style={{ fontSize: 62, lineHeight: 1.1, marginBottom: 8 }}>{latest.n}</div>
                    <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: '80%' }}>
                      {latest.isHealthy ? 'Detected healthy leaf tissue and normal coloration.' : (latest.treatment || 'Detected irregular lesions and potential pathogen spread.')}
                    </p>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'end' }}>
                    <div className="ph" style={{ height: 180, borderRadius: 'var(--r-lg)', background: `url(${latest.thumb}) center/cover no-repeat` }}>
                    </div>
                    <div>
                      <div className="eyebrow" style={{ marginBottom: 8 }}>AI Analysis</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                        <span className="display" style={{ fontSize: 48 }}>{latest.c}<span style={{ fontSize: 24 }}>%</span></span>
                        <span style={{ fontSize: 13, color: 'var(--sage-600)' }}>Confidence Score</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {!latest.isHealthy && <button className="btn btn-primary" onClick={() => onNav('treatment', latest)}>View Treatment</button>}
                        <button className="btn btn-ghost" onClick={() => onNav('scan')}>New Scan</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                   <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
                   <div className="display" style={{ fontSize: 32 }}>No Data Available</div>
                   <p style={{ color: 'var(--ink-dim)', marginTop: 8 }}>Perform your first scan to initialize the command center.</p>
                   <button className="btn btn-sun" style={{ marginTop: 24 }} onClick={() => onNav('scan')}>Start Scan</button>
                </div>
              )}
            </TC>
          </RV>

          {/* 2. AI MODEL STATUS CARD */}
          <RV delay={0.1} style={{ gridColumn: 'span 4' }}>
            <TC className="glass" style={{ padding: 22, height: '100%' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>AI Engine Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <StatusRow label="AI Model" value="Active" color="var(--sage-500)" />
                <StatusRow label="Disease Classes" value="38" />
                <StatusRow label="Avg. Confidence" value="96.2%" />
                <StatusRow label="Engine" value="TF.js Online" color="var(--sun)" />
              </div>
            </TC>
          </RV>

          {/* 3. WEEKLY ANALYTICS */}
          <RV delay={0.2} style={{ gridColumn: 'span 4' }}>
            <TC className="glass" style={{ padding: 22, height: '100%' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Technical Analytics</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <StatBox label="Total Scans" value={stats.total} />
                <StatBox label="Healthy" value={stats.healthy} color="var(--sage-500)" />
                <StatBox label="Diseased" value={stats.diseased} color="var(--clay)" />
                <StatBox label="Top Issue" value={stats.common} small />
              </div>
            </TC>
          </RV>

          {/* 4. ACTIVITY CHART */}
          <RV delay={0.3} style={{ gridColumn: 'span 4' }}>
            <TC className="glass" style={{ padding: 22, height: '100%' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Weekly Diagnosis Activity</div>
              <div className="display" style={{ fontSize: 38, marginBottom: 14 }}>Trend <em style={{ fontSize: 18, fontStyle: 'normal', color: 'var(--sage-600)' }}>Stable</em></div>
              <ActivityChart history={history} />
            </TC>
          </RV>

          {/* 5. TREATMENT QUEUE */}
          <RV delay={0.4} style={{ gridColumn: 'span 4' }}>
            <div className="glass" style={{ padding: 22, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Treatment Queue</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto', maxHeight: 240 }}>
                {diseasedItems.length > 0 ? diseasedItems.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px', borderRadius: 12, background: 'rgba(255,253,247,0.4)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `url(${h.thumb}) center/cover no-repeat` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h.n}</div>
                      <div className={`chip ${h.severity === 'High' ? 'chip-clay' : 'chip-sun'}`} style={{ fontSize: 9, padding: '2px 6px', marginTop: 4 }}>{h.severity} Priority</div>
                    </div>
                    <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => onNav('treatment', h)}><window.IcoArrowR size={14} /></button>
                  </div>
                )) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--sage-600)', fontSize: 13 }}>No pending treatments.</div>
                )}
              </div>
            </div>
          </RV>

          {/* 6. RECOVERY TRACKER */}
          <RV delay={0.5} style={{ gridColumn: 'span 8' }}>
            <TC className="glass" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>AI Recovery Monitoring Tracker</div>
              
              {recovery ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) 1.5fr', gap: 32, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="ph" style={{ height: 140, borderRadius: 12, marginBottom: 10, background: `url(${recovery.prev.thumb}) center/cover no-repeat` }} />
                    <div className="eyebrow" style={{ fontSize: 10 }}>Initial Scan</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--clay)' }}>{recovery.prev.severity} Severity</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div className="ph" style={{ height: 140, borderRadius: 12, marginBottom: 10, background: `url(${recovery.cur.thumb}) center/cover no-repeat`, border: '2px solid var(--sage-500)' }} />
                    <div className="eyebrow" style={{ fontSize: 10 }}>Current Status</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--sage-500)' }}>{recovery.cur.isHealthy ? 'Healthy' : `${recovery.cur.severity} Severity`}</div>
                  </div>

                  <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <div className="display" style={{ fontSize: 24 }}>Recovery: <em style={{ color: recovery.status === 'improving' ? 'var(--sage-500)' : 'var(--sun)' }}>{recovery.status}</em></div>
                        <div className="mono" style={{ fontSize: 14 }}>{recovery.recoveryPct}%</div>
                     </div>
                     <div style={{ height: 6, background: 'rgba(33,71,19,0.1)', borderRadius: 99, marginBottom: 16 }}>
                        <div style={{ width: `${Math.max(5, recovery.recoveryPct)}%`, height: '100%', background: 'var(--sage-500)', borderRadius: 99 }} />
                     </div>
                     <div style={{ padding: 14, borderRadius: 12, background: 'var(--glass-strong)', border: '1px solid var(--glass-border)' }}>
                        <div className="eyebrow" style={{ fontSize: 10, color: 'var(--sage-600)' }}>AI Recovery Insight</div>
                        <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>
                           {recovery.status === 'improving' ? "Visible lesion spread appears reduced compared to previous diagnosis." : "Condition remains stable. Continue current treatment protocol for better results."}
                        </p>
                     </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(33,71,19,0.03)', borderRadius: 16 }}>
                   <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                   <div className="display" style={{ fontSize: 22 }}>Awaiting follow-up scan</div>
                   <p style={{ color: 'var(--sage-600)', fontSize: 13, marginTop: 4 }}>Recovery monitoring requires at least two scans of the same plant.</p>
                </div>
              )}
            </TC>
          </RV>

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function StatusRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>{label}</span>
      <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: color || 'var(--ink)' }}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, color, small }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: 'rgba(255,253,247,0.5)', border: '1px solid var(--glass-border)' }}>
      <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
      <div className="display" style={{ fontSize: small ? 16 : 28, marginTop: 4, color: color || 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

function ActivityChart({ history }) {
  // Simple bar chart of last 7 entries (dummy dates for now but based on count)
  const vals = useMemo(() => {
    const bars = [1, 2, 0, 1, 3, 2, 1]; // Fallback
    if (history.length > 0) {
      // Just map history length to some bars for visual interest
      return Array.from({length: 7}).map((_, i) => Math.min(4, Math.floor(Math.random() * 3) + (i < history.length ? 1 : 0)));
    }
    return bars;
  }, [history]);

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 14, alignItems: 'flex-end', height: 60 }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${20 + v * 15}px`, borderRadius: 6, background: v > 2 ? 'var(--sun)' : 'var(--sage-400)', opacity: 0.6 + (v * 0.1), transition: 'height 1s var(--ease-spring)' }} />
      ))}
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
