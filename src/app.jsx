/* global React, ReactDOM */
/* App root + router + tweaks orchestrator */

const { useState: aS, useEffect: aE, useCallback: aC } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "animIntensity": 85,
  "theme": "fresh",
  "typography": "serif",
  "density": "cozy",
  "cursorBlob": true
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = aS('landing');
  const [navData, setNavData] = aS(null);
  const [cart, setCart] = aS([]);
  const [paletteOpen, setPaletteOpen] = aS(false);
  const [tweaks, setTweaks] = aS(TWEAK_DEFAULTS);
  const { toasts, push } = window.useToast();

  const setTweak = aC((k, v) => {
    setTweaks(t => {
      const nt = { ...t, [k]: v };
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      return nt;
    });
  }, []);

  // TweaksPanel component manages its own open/close + host protocol.

  // Keyboard shortcuts
  aE(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(o => !o); }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Apply theme via CSS vars
  aE(() => {
    const root = document.documentElement;
    if (tweaks.theme === 'dusk') {
      root.style.setProperty('--cream', '#14120A');
      root.style.setProperty('--cream-2', '#1C1A10');
      root.style.setProperty('--sun', '#E8B56A');
      root.style.setProperty('--sage-500', '#B8D08A');
    } else if (tweaks.theme === 'sunrise') {
      root.style.setProperty('--cream', '#1A0F0A');
      root.style.setProperty('--cream-2', '#241410');
      root.style.setProperty('--sun', '#F0A868');
      root.style.setProperty('--sage-500', '#9BCB6F');
    } else {
      root.style.setProperty('--cream', '#0B1410');
      root.style.setProperty('--cream-2', '#0F1C16');
      root.style.setProperty('--sun', '#F7D06A');
      root.style.setProperty('--sage-500', '#9BCB6F');
    }

    if (tweaks.typography === 'sans') {
      root.style.setProperty('--f-display', "'Geist', system-ui, sans-serif");
    } else {
      root.style.setProperty('--f-display', "'Instrument Serif', Georgia, serif");
    }
  }, [tweaks.theme, tweaks.typography]);

  const handleNav = aC((s, d) => {
    setScreen(s);
    if (d !== undefined) setNavData(d);
  }, []);

  // Scroll-to-top on navigate
  aE(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [screen]);

  const intensity = tweaks.animIntensity / 100;

  const Screens = {
    landing: window.ScreenLanding,
    dashboard: window.ScreenDashboard,
    scan: window.ScreenScan,
    treatment: window.ScreenTreatment,
    shop: window.ScreenShop,
    community: window.ScreenCommunity,
  };
  const Cur = Screens[screen];

  return (
    <div className="app" style={{ gap: tweaks.density === 'dense' ? 0 : undefined }}>
      {tweaks.cursorBlob && intensity > 0.1 && <window.CursorBlob intensity={intensity} />}

      <window.NavRail current={screen} onNav={handleNav} TWEAKS={tweaks} />

      <main className="view" key={screen} style={{ animation: 'rise 0.6s var(--ease-out)' }}>
        <window.TopBar onOpenPalette={() => setPaletteOpen(true)} onNav={handleNav} />
        {Cur && <Cur onNav={handleNav} push={push} intensity={intensity} navData={navData} cart={cart} setCart={setCart} />}
      </main>

      <window.CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNav={handleNav} />
      <window.ToastHost toasts={toasts} />

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Motion">
            <window.TweakSlider label="Animation" value={tweaks.animIntensity} onChange={v => setTweak('animIntensity', v)} min={0} max={100} step={5} unit="%" />
            <window.TweakToggle label="Cursor blob" value={tweaks.cursorBlob} onChange={v => setTweak('cursorBlob', v)} />
          </window.TweakSection>
          <window.TweakSection label="Theme">
            <window.TweakRadio label="Palette" value={tweaks.theme} onChange={v => setTweak('theme', v)} options={[
              { value: 'fresh', label: 'Fresh' },
              { value: 'dusk', label: 'Dusk' },
              { value: 'sunrise', label: 'Sunrise' },
            ]} />
          </window.TweakSection>
          <window.TweakSection label="Type">
            <window.TweakRadio label="Display" value={tweaks.typography} onChange={v => setTweak('typography', v)} options={[
              { value: 'serif', label: 'Serif' },
              { value: 'sans', label: 'Sans' },
            ]} />
          </window.TweakSection>
          <window.TweakSection label="Layout">
            <window.TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak('density', v)} options={[
              { value: 'cozy', label: 'Cozy' },
              { value: 'dense', label: 'Dense' },
            ]} />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
