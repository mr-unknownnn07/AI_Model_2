/* global React */
/* Treatment detail — natural vs professional tabs */

const { useState: tS } = React;

function ScreenTreatment({ onNav, push, navData, cart, setCart }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob;
  const [tab, setTab] = tS('natural');
  const [checked, setChecked] = tS({});
  const toggle = (k) => setChecked(c => ({ ...c, [k]: !c[k] }));

  const DISEASE_DB = {
    'Viral Disease': {
      desc: 'Yellowing, mosaic patterns, or stunted growth. Viruses cannot be cured, only managed.',
      why: 'Viruses are typically transmitted by insect vectors like aphids or whiteflies, or through contaminated tools and seeds.',
      symptoms: [
        { t: 'Mosaic Patterns', d: 'Mottled yellow or green leaves.', c: true },
        { t: 'Stunted Growth', d: 'Plant fails to reach full size.', c: true },
        { t: 'Leaf Curling', d: 'Edges folding inward or upward.', c: true },
        { t: 'Ring Spots', d: 'Not yet — early stage.', c: false }
      ],
      natural: [
        { k: 'v1', t: 'Remove infected plants', d: 'Dig up and destroy infected plants to prevent spread.', time: '10 min', supplies: ['gloves', 'trash bag'] },
        { k: 'v2', t: 'Control insects', d: 'Aphids and whiteflies spread viruses. Use insecticidal soap.', time: '15 min', supplies: ['insecticidal soap'] }
      ],
      pro: [
        { k: 'vp1', t: 'Pesticide for vectors', d: 'Apply systemic insecticide to kill disease-carrying pests.', tag: 'Chem' }
      ],
      prevention: [
        'Control weed populations around the garden as they can host viruses.',
        'Use reflective mulches to deter insect vectors.',
        'Always disinfect pruning shears between cuts using 70% rubbing alcohol.'
      ]
    },
    'Bacterial Disease': {
      desc: 'Water-soaked spots, wilting, or oozing lesions. Bacteria spread through water and tools.',
      why: 'Bacterial pathogens enter plants through natural openings or wounds. They thrive in warm, humid conditions and are often spread by splashing rain or overhead irrigation.',
      symptoms: [
        { t: 'Water-soaked Spots', d: 'Dark, greasy-looking areas.', c: true },
        { t: 'Wilting Leaves', d: 'Loss of rigidity, drooping.', c: true },
        { t: 'Bacterial Ooze', d: 'Sticky liquid on stems/leaves.', c: true },
        { t: 'Stem Rot', d: 'Not yet — early stage.', c: false }
      ],
      natural: [
        { k: 'b1', t: 'Prune affected areas', d: 'Remove diseased branches. Disinfect tools between cuts.', time: '15 min', supplies: ['pruners', 'rubbing alcohol'] },
        { k: 'b2', t: 'Avoid overhead watering', d: 'Water at the base to keep foliage dry.', time: '5 min', supplies: [] }
      ],
      pro: [
        { k: 'bp1', t: 'Copper Bactericide', d: 'Apply copper sulfate spray to protect healthy foliage.', tag: 'Chem' },
        { k: 'bp2', t: 'Antibiotic spray', d: 'Streptomycin or Oxytetracycline for severe cases.', tag: 'Chem' }
      ],
      prevention: [
        'Ensure proper spacing between plants to improve air circulation.',
        'Water at the base of the plant early in the morning.',
        'Remove and destroy all plant debris at the end of the season.'
      ]
    },
    'Fungal Disease': {
      desc: 'Powdery mildew, rust, or dark spots. Thrives in warm, humid weather with poor airflow.',
      why: 'Fungal spores are carried by the wind, water splashes, or on insects. They infect plants when the foliage remains wet for extended periods or in high humidity environments.',
      symptoms: [
        { t: 'Powdery / Orange Spots', d: 'Discoloration on leaves.', c: true },
        { t: 'Yellow Halo', d: 'Surrounding affected area.', c: true },
        { t: 'Leaf Curl', d: 'Edges lifting upward.', c: true },
        { t: 'Premature Drop', d: 'Not yet — early stage.', c: false }
      ],
      natural: [
        { k: 'f1', t: 'Prune infected leaves', d: 'Remove all leaves with fungal spots. Do not compost.', time: '5 min', supplies: ['scissors','paper bag'] },
        { k: 'f2', t: 'Baking soda spray', d: '1 tsp baking soda + 1 tsp neem oil + 1 L water. Spray every 7 days.', time: '10 min', supplies: ['baking soda','neem oil','sprayer'] },
        { k: 'f3', t: 'Improve airflow', d: 'Space plants out and prune dense foliage.', time: '15 min', supplies: [] }
      ],
      pro: [
        { k: 'fp1', t: 'Copper-based fungicide', d: 'Mancozeb 75% WP. Apply 2g/L every 10 days.', tag: 'Chem' },
        { k: 'fp2', t: 'Systemic fungicide', d: 'Propiconazole 25% EC. Apply on a cool dry morning.', tag: 'Chem' }
      ],
      prevention: [
        'Apply a layer of mulch to prevent soil-borne spores from splashing onto lower leaves.',
        'Avoid working in the garden when plants are wet.',
        'Choose disease-resistant plant varieties when available.'
      ]
    }
  };

  const isHealthy = navData?.isHealthy;
  const diseaseName = navData?.name || 'Fungal Disease';
  const confidence = navData?.confidence || '94';
  const dbEntry = DISEASE_DB[diseaseName] || DISEASE_DB['Fungal Disease'];

  const natural = isHealthy ? [] : dbEntry.natural;
  const pro = isHealthy ? [] : dbEntry.pro;

  const list = tab === 'natural' ? natural : pro;
  const done = list.length > 0 ? list.filter(i => checked[i.k]).length : 0;

  return (
    <div className="scroll" data-screen-label="Treatment">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <button className="chip" onClick={() => onNav('scan')} style={{ marginBottom: 14 }}>← back to scan</button>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className={`chip ${isHealthy ? 'chip-sage' : 'chip-clay'}`}>
                {isHealthy ? '✅ plant healthy' : '⚠ disease detected'}
              </span>
              <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 120px)', marginTop: 14 }}>
                <K text={diseaseName + '.'} italicWords={[diseaseName + '.']} />
              </h1>
              <p style={{ fontSize: 18, color: 'var(--ink-2)', maxWidth: 540, marginTop: 10 }}>
                {isHealthy ? 'Your plant looks perfectly healthy. Keep up the good work!' : dbEntry.desc}
                {!isHealthy && <em style={{ fontFamily: 'var(--f-display)', color: 'var(--sage-500)', display: 'block', marginTop: 8 }}>Follow the treatment plan below.</em>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="glass" style={{ padding: 16, minWidth: 120, textAlign: 'center' }}>
                <div className="eyebrow">confidence</div>
                <div className="display" style={{ fontSize: 34, marginTop: 2 }}>{confidence}<span style={{ fontSize: 20 }}>%</span></div>
                <div style={{ fontSize: 11, color: 'var(--sage-600)' }}>AI prediction</div>
              </div>
            </div>
          </div>
        </RV>

        {/* Hero band: photo + disease anatomy */}
        <RV delay={0.1}>
          <div className="glass-strong" style={{ padding: 28, borderRadius: 'var(--r-xl)', marginBottom: 32, position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32 }}>
            <div style={{ position: 'absolute', top: -100, right: -80 }}>
              <Blob size={380} color="rgba(245,198,78,0.22)" duration={14} />
            </div>
            <div className="ph" style={{ height: 320, position: 'relative', zIndex: 1, background: navData?.imgUrl ? `url(${navData.imgUrl}) center/cover no-repeat` : undefined }}>
              {!navData?.imgUrl && <span>affected · leaf</span>}
              {[{x:30,y:40,r:18},{x:60,y:55,r:14},{x:45,y:70,r:12},{x:70,y:30,r:10}].map((s,i) => (
                <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.r*2, height: s.r*2, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid var(--clay)', boxShadow: '0 0 12px rgba(224,120,86,0.5)', animation: `pulse 2s ${i*0.3}s infinite` }} />
              ))}
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--sage-600)' }}>1. Symptoms Identified</span>
                {!isHealthy ? (
                  <div style={{ marginTop: 10 }}>
                    {dbEntry.symptoms.map((s, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, padding: '8px 0', borderTop: i ? '1px dashed var(--glass-border)' : 'none' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.c ? 'var(--clay)' : 'rgba(33,71,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {s.c && <window.IcoCheck size={10} style={{ color: '#fff' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{s.t}</div>
                          <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>{s.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '10px 0' }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>No symptoms</div>
                    <div style={{ fontSize: 12, color: 'var(--sage-600)' }}>Plant appears completely healthy.</div>
                  </div>
                )}
              </div>

              {!isHealthy && (
                <div>
                  <span className="eyebrow" style={{ color: 'var(--sage-600)' }}>2. Why This Happens</span>
                  <div style={{ marginTop: 10, padding: 14, background: 'rgba(255,253,247,0.5)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>{dbEntry.why}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RV>

        {/* Tabs */}
        <RV delay={0.2}>
          <div style={{ marginBottom: 20 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16, color: 'var(--sage-600)' }}>3. Recommended Treatment</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[
                { id: 'natural', label: 'Natural', desc: '150+ remedies' },
                { id: 'professional', label: 'Professional', desc: '50+ plans' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={tab === t.id ? 'glass-strong' : 'glass'}
                  style={{
                    padding: '14px 22px',
                    borderRadius: 'var(--r-pill)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transform: tab === t.id ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.3s var(--ease-spring), background 0.3s',
                  }}
                >
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{t.label}</span>
                  <span className="chip" style={{ fontSize: 10, padding: '2px 8px' }}>{t.desc}</span>
                </button>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="mono" style={{ fontSize: 12, color: 'var(--sage-600)' }}>{done}/{list.length} done</div>
                <div style={{ width: 120, height: 6, borderRadius: 99, background: 'rgba(33,71,19,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${(list.length > 0 ? (done/list.length) : 0)*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--sage-500), var(--sun))', transition: 'width 0.5s var(--ease-spring)' }} />
                </div>
              </div>
            </div>
          </div>
        </RV>

        {/* Step cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {list.map((it, i) => (
            <RV key={it.k} delay={i * 0.08}>
              <TC className="glass" style={{ padding: 22, minHeight: 180, display: 'flex', flexDirection: 'column', gap: 10, opacity: checked[it.k] ? 0.7 : 1, transition: 'opacity 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--sage-500)' }}>step · {String(i+1).padStart(2,'0')}</div>
                  <button onClick={() => { toggle(it.k); push && push({ icon: checked[it.k] ? '↩' : '✓', title: checked[it.k] ? 'Unchecked' : 'Step complete', desc: it.t }); }} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid ' + (checked[it.k] ? 'var(--sage-500)' : 'var(--glass-border-strong)'), background: checked[it.k] ? 'var(--sage-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s var(--ease-spring)' }}>
                    {checked[it.k] && <window.IcoCheck size={14} style={{ color: '#fff' }} />}
                  </button>
                </div>
                <div className="display" style={{ fontSize: 26, textDecoration: checked[it.k] ? 'line-through' : 'none' }}>{it.t}</div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>{it.d}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                  {it.time && <span className="chip"><window.IcoSparkle size={11} /> {it.time}</span>}
                  {it.tag && <span className="chip chip-sun">{it.tag}</span>}
                  {(it.supplies || []).map(s => <span key={s} className="chip chip-sage">{s}</span>)}
                </div>
              </TC>
            </RV>
          ))}
        </div>
        
        {/* Prevention Tips */}
        {!isHealthy && dbEntry.prevention && (
          <RV delay={0.3}>
            <div style={{ marginTop: 40, padding: 24, borderRadius: 'var(--r-lg)', background: 'linear-gradient(135deg, rgba(146,181,110,0.1), rgba(33,71,19,0.02))', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sage-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <window.IcoSparkle size={20} />
                </div>
                <div>
                  <span className="eyebrow" style={{ color: 'var(--sage-600)', display: 'block', marginBottom: 2 }}>4. Prevention Tips</span>
                  <h3 className="display" style={{ fontSize: 24, margin: 0 }}>Keep it from coming back.</h3>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {dbEntry.prevention.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{tip}</li>
                ))}
              </ul>
            </div>
          </RV>
        )}

        {/* Recommended Pharmacy Products */}
        {!isHealthy && (
          <RV delay={0.4}>
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="eyebrow">recommended from pharmacy</span>
                <button className="btn btn-ghost" onClick={() => onNav('shop')} style={{ fontSize: 13 }}>Browse all <window.IcoArrowR size={12} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {(() => {
                  let recs = [];
                  if (diseaseName.includes('Fungal')) recs = [{ id: 2, n: 'Mancozeb 75% WP', p: 1530, sub: 'Broad-spectrum fungicide', color: '#E07856' }, { id: 1, n: 'Neem Oil Cold-Pressed', p: 1070, sub: 'Organic spray', color: '#6B944C' }];
                  else if (diseaseName.includes('Bacterial')) recs = [{ id: 3, n: 'Bordeaux Mixture Kit', p: 1820, sub: 'Copper sulfate + lime', color: '#B8D8D8' }, { id: 6, n: 'Pruning Shears', p: 2320, sub: 'Disinfect between cuts', color: '#92B56E' }];
                  else if (diseaseName.includes('Viral')) recs = [{ id: 1, n: 'Neem Oil Cold-Pressed', p: 1070, sub: 'Controls vector insects', color: '#6B944C' }, { id: 5, n: 'Liquid Compost Tea', p: 1160, sub: 'Boosts plant immunity', color: '#F5C64E' }];
                  
                  return recs.map(p => (
                    <div key={p.id} className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="ph" style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)`, borderColor: `${p.color}55`, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--f-display)', fontSize: 18, lineHeight: 1.1 }}>{p.n}</div>
                        <div style={{ fontSize: 11, color: 'var(--sage-600)', marginTop: 4 }}>{p.sub}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="display" style={{ fontSize: 18, marginBottom: 8 }}>₹{p.p}</div>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setCart && setCart(c => [...c, p]); push && push({ icon: '🛒', title: 'Added to cart', desc: p.n }); }}>Add to cart</button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </RV>
        )}
      </div>
    </div>
  );
}

window.ScreenTreatment = ScreenTreatment;
