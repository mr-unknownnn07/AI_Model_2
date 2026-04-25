/* global React */
/* Shop / Pharmacy — product bento with tilt */

const { useState: shS } = React;

function ScreenShop({ onNav, push, cart, setCart }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob;

  const cats = ['All', 'Fungicides', 'Natural', 'Seeds', 'Fertilizer', 'Tools'];
  const [cat, setCat] = shS('All');
  const [checkoutOpen, setCheckoutOpen] = shS(false);
  const [payMethod, setPayMethod] = shS('upi');

  const products = [
    { id: 1, n: 'Neem Oil Cold-Pressed', cat: 'Natural', p: 1070, color: '#6B944C', rating: 4.8, feat: true, sub: '500ml · organic · cold-pressed' },
    { id: 2, n: 'Mancozeb 75% WP', cat: 'Fungicides', p: 1530, color: '#E07856', rating: 4.6, sub: 'Broad-spectrum fungicide · 250g' },
    { id: 3, n: 'Bordeaux Mixture Kit', cat: 'Fungicides', p: 1820, color: '#B8D8D8', rating: 4.7, sub: 'Copper sulfate + lime · kit' },
    { id: 4, n: 'Heirloom Tomato Seeds', cat: 'Seeds', p: 540, color: '#C25477', rating: 4.9, sub: 'Sungold · 25 seeds · non-GMO' },
    { id: 5, n: 'Liquid Compost Tea', cat: 'Fertilizer', p: 1160, color: '#F5C64E', rating: 4.5, sub: '1 L · weekly feeder' },
    { id: 6, n: 'Pruning Shears', cat: 'Tools', p: 2320, color: '#92B56E', rating: 4.8, sub: 'Japanese steel · bypass · lifetime' },
    { id: 7, n: 'Silicone Leaf Spray', cat: 'Natural', p: 820, color: '#BBD2A2', rating: 4.3, sub: '300ml · plant armour' },
    { id: 8, n: 'Soil pH Meter', cat: 'Tools', p: 1240, color: '#214713', rating: 4.6, sub: '3-in-1 · moisture · pH · light' },
  ];

  const filtered = cat === 'All' ? products : products.filter(p => p.cat === cat);
  const total = cart.reduce((s, p) => s + p.p, 0);
  const add = (p) => { setCart(c => [...c, p]); push && push({ icon: '🛒', title: 'Added to cart', desc: p.n }); };

  return (
    <div className="scroll" data-screen-label="Shop">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <span className="eyebrow">pharmacy &amp; garden shop</span>
              <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 120px)', marginTop: 10 }}>
                <K text="Your garden's " /><em style={{ fontStyle: 'italic', color: 'var(--sage-500)' }}><K text="medicine cabinet." delay={0.4} /></em>
              </h1>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--sage-600)', textAlign: 'right' }}>
              <div>1,000+ products · 2-day delivery</div>
              <div>partnered with 20 agricultural brands</div>
            </div>
          </div>
        </RV>

        {/* Filters */}
        <RV delay={0.1}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cat === c ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                {c}
              </button>
            ))}
            <button className="chip" style={{ marginLeft: 'auto' }}><window.IcoFilter size={12} /> sort · popular</button>
          </div>
        </RV>

        {/* Featured banner */}
        <RV delay={0.15}>
          <TC className="glass-strong" style={{ padding: 32, borderRadius: 'var(--r-xl)', marginBottom: 24, position: 'relative', overflow: 'hidden', minHeight: 240, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <Blob size={420} color="rgba(110,180,90,0.25)" style={{ position: 'absolute', top: -100, right: -60 }} />
            </div>
            <div style={{ position: 'relative' }}>
              <span className="chip chip-sage">prescribed for you</span>
              <div className="display" style={{ fontSize: 48, marginTop: 14, lineHeight: 1 }}>Rust Recovery Bundle</div>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 10, maxWidth: 420 }}>Everything your Rose needs: neem oil, copper fungicide, pruning shears, and a 7-day care guide.</p>
              <div style={{ display: 'flex', gap: 14, marginTop: 20, alignItems: 'baseline' }}>
                <div className="display" style={{ fontSize: 44 }}>₹3310</div>
                <div style={{ fontSize: 13, color: 'var(--sage-600)', textDecoration: 'line-through' }}>₹4840</div>
                <span className="chip chip-sun">-32%</span>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => add({ n: 'Rust Recovery Bundle', p: 3310 })}>Add bundle <window.IcoArrowR size={14} /></button>
            </div>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              {['#6B944C','#E07856','#92B56E','#F5C64E'].map((c, i) => (
                <div key={i} className="ph" style={{ height: 90, background: `linear-gradient(135deg, ${c}22, ${c}08)`, borderColor: `${c}55` }}><span style={{ color: c }}>{['neem','copper','shears','guide'][i]}</span></div>
              ))}
            </div>
          </TC>
        </RV>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {filtered.map((p, i) => (
            <RV key={p.id} delay={(i % 4) * 0.05}>
              <TC className="glass" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 300 }}>
                <div className="ph" style={{ height: 140, background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)`, borderColor: `${p.color}55` }}><span style={{ color: p.color }}>{p.cat.toLowerCase()}</span></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span className="chip" style={{ fontSize: 10, padding: '2px 8px' }}>{p.cat}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--sage-600)', marginLeft: 'auto' }}>★ {p.rating}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, lineHeight: 1.15 }}>{p.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--sage-600)', marginTop: 4 }}>{p.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div className="display" style={{ fontSize: 22 }}>₹{p.p}</div>
                  <button onClick={() => add(p)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s var(--ease-spring)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}>
                    <window.IcoPlus size={16} />
                  </button>
                </div>
              </TC>
            </RV>
          ))}
        </div>

        {/* Floating cart */}
        {cart.length > 0 && !checkoutOpen && (
          <div className="glass-strong" style={{ position: 'fixed', bottom: 28, right: 28, padding: '14px 18px', borderRadius: 'var(--r-pill)', boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'center', gap: 14, zIndex: 30, animation: 'rise 0.5s var(--ease-spring)' }}>
            <window.IcoShop size={18} />
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--sage-600)' }}>cart · {cart.length} items</div>
              <div className="display" style={{ fontSize: 20 }}>₹{total}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: '10px 16px' }} onClick={() => setCheckoutOpen(true)}>Checkout</button>
          </div>
        )}

        {/* Detailed Checkout Modal */}
        {checkoutOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s' }}>
            <TC className="glass-strong" style={{ width: 440, padding: 32, borderRadius: 'var(--r-xl)', position: 'relative', animation: 'rise 0.4s var(--ease-spring)' }}>
              <button onClick={() => setCheckoutOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer' }}>✕</button>
              <div className="eyebrow" style={{ marginBottom: 4 }}>secure checkout</div>
              <div className="display" style={{ fontSize: 32, marginBottom: 24 }}>Order Summary</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: '1px dashed var(--glass-border-strong)' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span>{item.n}</span>
                    <span className="mono">₹{item.p}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--ink-2)', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{total}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxes (5%)</span><span>₹{Math.round(total * 0.05)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery</span><span>{total > 1500 ? 'Free' : '₹50'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--glass-border-strong)', fontSize: 20, color: 'var(--ink)', fontWeight: 'bold' }}>
                  <span className="display">Total</span>
                  <span>₹{Math.round(total * 1.05) + (total > 1500 ? 0 : 50)}</span>
                </div>
              </div>

              <div className="eyebrow" style={{ marginBottom: 12 }}>payment method</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
                {[
                  { id: 'upi', label: 'UPI' },
                  { id: 'card', label: 'Card' },
                  { id: 'cod', label: 'COD' }
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} className={payMethod === m.id ? 'btn btn-primary' : 'glass'} style={{ padding: '10px 0', fontSize: 12 }}>
                    {m.label}
                  </button>
                ))}
              </div>

              <button className="btn btn-sun" style={{ width: '100%', padding: 16, fontSize: 16 }} onClick={() => {
                setCart([]);
                setCheckoutOpen(false);
                push && push({ icon: '🎉', title: 'Order Confirmed', desc: 'Your items are on the way!' });
              }}>
                Place Order (₹{Math.round(total * 1.05) + (total > 1500 ? 0 : 50)})
              </button>
            </TC>
          </div>
        )}
      </div>
    </div>
  );
}

window.ScreenShop = ScreenShop;
