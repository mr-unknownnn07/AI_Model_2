/* global React */
/* Community — feed + experts + stats */

const { useState: cmS } = React;

function ScreenCommunity({ onNav, push }) {
  const K = window.KineticText; const TC = window.TiltCard; const RV = window.Reveal;
  const Blob = window.MorphBlob;

  const [liked, setLiked] = cmS({});
  const [filter, setFilter] = cmS('all');
  const [postOpen, setPostOpen] = cmS(false);
  const [postText, setPostText] = cmS('');
  const [postImg, setPostImg] = cmS(null);
  const toggleLike = (id) => setLiked(l => ({ ...l, [id]: !l[id] }));

  const [posts, setPosts] = cmS([
    { id: 1, u: 'Meera Kapoor', role: 'home gardener · pune', avatar: '#C25477', time: '2h', tag: 'success', title: 'Fixed my tomato blight in 3 days!', body: 'Neem oil + baking soda spray twice a day. Leaves almost fully recovered. So grateful for this app 🙏', img: true, likes: 142, comments: 28 },
    { id: 2, u: 'Dr. Arun Patel', role: 'verified expert · plant pathology', avatar: '#214713', time: '5h', tag: 'tip', expert: true, title: 'PSA: do NOT compost infected leaves.', body: 'Fungal spores survive composting at low temps. Bag them, burn them, or put them in general waste. Break the cycle.', likes: 334, comments: 41 },
    { id: 3, u: 'Rohit Nayak', role: 'farmer · gujarat', avatar: '#F5C64E', time: '1d', tag: 'question', title: 'What\'s this white fuzz on my cucumbers?', body: 'AI says powdery mildew at 86% confidence. Anyone dealt with this on cucumbers specifically? Copper or milk spray?', img: true, likes: 67, comments: 54 },
    { id: 4, u: 'Khushi Barvaliya', role: 'urban farmer · mumbai', avatar: '#6B944C', time: '2d', tag: 'success', title: 'Balcony garden month 4 update 🌱', body: 'Started with 3 pots, now at 17. PlantCure caught 2 diseases early — saved my entire tomato harvest.', img: true, likes: 289, comments: 62 },
  ]);
  
  const submitPost = () => {
    if (!postText.trim() && !postImg) return;
    setPosts(p => [{
      id: Date.now(), u: 'You', role: 'urban grower', avatar: '#F5C64E', time: 'Just now', tag: 'question', title: 'Community Discussion', body: postText, img: postImg, likes: 0, comments: 0
    }, ...p]);
    setPostText('');
    setPostImg(null);
    setPostOpen(false);
    push && push({ icon: '✅', title: 'Posted successfully' });
  };

  const shown = filter === 'all' ? posts : posts.filter(p => p.tag === filter);

  const experts = [
    { n: 'Dr. Patel', s: 'Plant pathology', c: '#214713' },
    { n: 'Prof. Sharma', s: 'Organic farming', c: '#6B944C' },
    { n: 'M. Devi', s: 'Rose specialist', c: '#C25477' },
    { n: 'R. Singh', s: 'Pest mgmt.', c: '#E07856' },
  ];

  return (
    <div className="scroll" data-screen-label="Community">
      <div className="wrap" style={{ padding: '24px 40px 80px' }}>
        <RV>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <span className="eyebrow">the field</span>
              <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 120px)', marginTop: 10 }}>
                <K text="50,000 growers. " /><em style={{ fontStyle: 'italic', color: 'var(--sage-500)' }}><K text="One thread." delay={0.45} /></em>
              </h1>
            </div>
            <button className="btn btn-primary" onClick={() => setPostOpen(true)}><window.IcoPlus size={14} /> New post</button>
          </div>
        </RV>

        {/* Stats row */}
        <RV delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { v: '50K+', l: 'active growers' },
              { v: '500+', l: 'verified experts' },
              { v: '1K+', l: 'posts per day' },
              { v: '15', l: 'languages' },
            ].map((s, i) => (
              <TC key={i} className="glass" style={{ padding: 20 }}>
                <div className="display" style={{ fontSize: 44 }}>{s.v}</div>
                <div className="eyebrow" style={{ marginTop: -2 }}>{s.l}</div>
              </TC>
            ))}
          </div>
        </RV>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* Feed */}
          <div>
            <RV delay={0.15}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { id: 'all', l: 'All posts' },
                  { id: 'success', l: '🌱 Success stories' },
                  { id: 'tip', l: '💡 Expert tips' },
                  { id: 'question', l: '❓ Questions' },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className={filter === f.id ? 'glass-strong' : 'glass'} style={{ padding: '8px 14px', borderRadius: 'var(--r-pill)', fontSize: 13, fontWeight: filter === f.id ? 600 : 400 }}>
                    {f.l}
                  </button>
                ))}
              </div>
            </RV>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {shown.map((p, i) => (
                <RV key={p.id} delay={i * 0.08}>
                  <TC className="glass" style={{ padding: 22 }} max={4}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: p.avatar, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>{p.u.slice(0,1)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{p.u}</span>
                          {p.expert && <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--sun)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>✓</span>}
                          <span className="mono" style={{ fontSize: 10, color: 'var(--sage-600)', marginLeft: 'auto' }}>{p.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--sage-600)' }}>{p.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <span className={p.tag === 'success' ? 'chip chip-sage' : p.tag === 'tip' ? 'chip chip-sun' : 'chip chip-clay'}>
                        {p.tag === 'success' ? '🌱 Success' : p.tag === 'tip' ? '💡 Tip' : '❓ Question'}
                      </span>
                    </div>
                    <div className="display" style={{ fontSize: 24, marginBottom: 8, lineHeight: 1.2 }}>{p.title}</div>
                    <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>{p.body}</p>
                    {p.img && typeof p.img === 'string' ? (
                      <div className="ph" style={{ height: 180, marginTop: 14, background: `url(${p.img}) center/cover no-repeat` }} />
                    ) : p.img === true ? (
                      <div className="ph" style={{ height: 180, marginTop: 14 }}><span>garden · photo</span></div>
                    ) : null}
                    <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--glass-border)' }}>
                      <button onClick={() => toggleLike(p.id)} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: liked[p.id] ? 'var(--berry)' : 'var(--sage-700)', transition: 'color 0.2s, transform 0.3s var(--ease-spring)', transform: liked[p.id] ? 'scale(1.05)' : 'scale(1)' }}>
                        <window.IcoHeart size={14} fill={liked[p.id] ? 'currentColor' : 'none'} />
                        {p.likes + (liked[p.id] ? 1 : 0)}
                      </button>
                      <button style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: 'var(--sage-700)' }}>
                        <window.IcoMsg size={14} /> {p.comments}
                      </button>
                      <button style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: 'var(--sage-700)', marginLeft: 'auto' }}>
                        <window.IcoBookmark size={14} /> save
                      </button>
                    </div>
                  </TC>
                </RV>
              ))}
            </div>
          </div>

          {/* Side: experts + active topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <RV delay={0.2}>
              <TC className="glass" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -40 }}><Blob size={200} color="rgba(245,198,78,0.22)" duration={16} /></div>
                <span className="eyebrow" style={{ position: 'relative' }}>verified experts</span>
                <div className="display" style={{ fontSize: 26, marginTop: 6, marginBottom: 14, position: 'relative' }}>Ask a pro</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
                  {experts.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: e.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{e.n.slice(0,1)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.n}</div>
                        <div style={{ fontSize: 11, color: 'var(--sage-600)' }}>{e.s}</div>
                      </div>
                      <button className="chip chip-sage" style={{ fontSize: 11 }}>ask</button>
                    </div>
                  ))}
                </div>
              </TC>
            </RV>

            <RV delay={0.25}>
              <div className="glass" style={{ padding: 22 }}>
                <span className="eyebrow">trending topics</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {['#powderymildew','#blackspot','#neemoil','#tomatoes','#monsoonprep','#organic','#roses','#seedstarting'].map((t, i) => (
                    <span key={i} className="chip" style={{ fontSize: 12, fontFamily: 'var(--f-mono)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </RV>

            <RV delay={0.3}>
              <div className="glass-strong" style={{ padding: 22, background: 'linear-gradient(135deg, rgba(146,181,110,0.2), rgba(255,253,247,0.6))' }}>
                <span className="chip chip-sage">weekly challenge</span>
                <div className="display" style={{ fontSize: 24, marginTop: 10, lineHeight: 1.2 }}>Share your <em>ugliest leaf</em>. AI vs. human doctor.</div>
                <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6 }}>Winner gets a free pharmacy bundle.</p>
                <button className="btn btn-sun" style={{ marginTop: 14, padding: '10px 16px', fontSize: 13 }}>Join</button>
              </div>
            </RV>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {postOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s' }}>
          <TC className="glass-strong" style={{ width: 440, padding: 32, borderRadius: 'var(--r-xl)', position: 'relative', animation: 'rise 0.4s var(--ease-spring)' }}>
            <button onClick={() => setPostOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer' }}>✕</button>
            <div className="eyebrow" style={{ marginBottom: 4 }}>new post</div>
            <div className="display" style={{ fontSize: 32, marginBottom: 24 }}>Share with the community</div>
            <textarea 
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="What's on your mind? Ask a question or share an update..."
              style={{ width: '100%', height: 120, padding: 16, borderRadius: 12, border: '1px solid var(--glass-border-strong)', background: 'var(--glass)', color: 'var(--ink)', resize: 'none', marginBottom: 16, fontSize: 14 }}
            />
            {postImg && (
              <div style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: 16, background: `url(${postImg}) center/cover no-repeat`, border: '1px solid var(--glass-border-strong)', position: 'relative' }}>
                <button onClick={() => setPostImg(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <label className="btn glass" style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
                <window.IcoPlus size={14} /> Add Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setPostImg(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
              </label>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 16 }} onClick={submitPost}>Publish Post</button>
          </TC>
        </div>
      )}
    </div>
  );
}

window.ScreenCommunity = ScreenCommunity;
