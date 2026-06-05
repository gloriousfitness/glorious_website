import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const PHOSPHOR = '#1bd96a'
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace"

type Props = { onCta?: () => void; booted?: boolean }

/* ─── In-view hook (pause work when offscreen) ──────────────────── */
function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

/* ─── Shared timecode (24fps SMPTE) ─────────────────────────────── */
function Timecode({ frames = true }: { frames?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    let lastFrame = -1
    const tick = (now: number) => {
      const e = (now - start) / 1000
      const f = Math.floor((e * 24) % 24)
      if (f !== lastFrame) {
        lastFrame = f
        const h = Math.floor(e / 3600) % 24
        const m = Math.floor(e / 60) % 60
        const s = Math.floor(e) % 60
        const p = (n: number) => String(n).padStart(2, '0')
        if (ref.current) {
          ref.current.textContent = frames
            ? `${p(h)}:${p(m)}:${p(s)}:${p(f)}`
            : `${p(h)}:${p(m)}:${p(s)}`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [frames, inView])
  return <span ref={ref}>{frames ? '00:00:00:00' : '00:00:00'}</span>
}

function CornerTick({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 10
  const off = -1
  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 0,
  }
  const map: Record<string, React.CSSProperties> = {
    tl: { top: off, left: off, borderTopWidth: 2, borderLeftWidth: 2 },
    tr: { top: off, right: off, borderTopWidth: 2, borderRightWidth: 2 },
    bl: { bottom: off, left: off, borderBottomWidth: 2, borderLeftWidth: 2 },
    br: { bottom: off, right: off, borderBottomWidth: 2, borderRightWidth: 2 },
  }
  return <span aria-hidden style={{ ...base, ...map[pos] }} />
}

/* ─── Mobile (preserved exactly) ──────────────────────────────────── */
function useScrollAwayFade() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const p = Math.min(1, Math.max(0, (y - window.innerHeight * 0.25) / (window.innerHeight * 0.4)))
  const style: React.CSSProperties = {
    opacity: 1 - p,
    transform: `translateY(${p * -10}px)`,
    transition: 'opacity 220ms ease, transform 220ms ease',
    pointerEvents: p > 0.9 ? 'none' : 'auto',
  }
  return style
}

function MobileHero({ onCta, booted }: Props) {
  const awayFade = useScrollAwayFade()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!booted || !videoRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    videoRef.current.play().catch(() => {})
  }, [booted])

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{
        background: '#0d0d10',
        color: '#fff',
        minHeight: '100svh',
        paddingTop: 32,
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          poster="/hero-poster.webp"
          aria-hidden="true"
          src="/hero.mp4"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            background: 'radial-gradient(120% 80% at 50% 20%, #2a1418 0%, #0d0d10 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(13,13,16,0.55) 0%, rgba(13,13,16,0.05) 30%, rgba(13,13,16,0.45) 65%, rgba(13,13,16,0.9) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            opacity: 0.45,
            mixBlendMode: 'screen',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: '160px 160px',
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      <div
        className="relative flex flex-col"
        style={{
          zIndex: 2,
          padding: '0 clamp(20px, 4vw, 64px) clamp(40px, 4vw, 72px)',
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          alignItems: 'flex-start',
          ...awayFade,
        }}
      >
        <div
          style={{
            position: 'relative',
            background: RED,
            color: '#fff',
            padding: 'clamp(14px, 1.6vw, 26px) clamp(22px, 2.6vw, 44px) clamp(18px, 1.8vw, 30px)',
            marginBottom: 'clamp(16px, 1.4vw, 22px)',
            maxWidth: '100%',
          }}
        >
          <CornerTick pos="tl" />
          <CornerTick pos="tr" />
          <CornerTick pos="bl" />
          <CornerTick pos="br" />
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 6,
              right: 10,
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            REC ·
          </span>
          <h1
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(56px, 8.2vw, 140px)',
              lineHeight: 0.86,
              margin: 0,
              letterSpacing: '-0.01em',
              color: '#fff',
              fontVariant: 'small-caps',
              textTransform: 'lowercase',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'block' }}>Wear the</span>
            <span style={{ display: 'block' }}>Moment.</span>
          </h1>
        </div>

        <div className="flex flex-row items-center" style={{ gap: 14, flexWrap: 'wrap' }}>
          <a
            href="#contact"
            onClick={onCta}
            style={{
              height: 'clamp(40px, 3.2vw, 52px)',
              padding: '0 clamp(18px, 1.6vw, 26px)',
              borderRadius: 2,
              border: `1px solid ${RED}`,
              background: RED,
              color: '#fff',
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span aria-hidden style={{ fontSize: '0.85em' }}>▶</span>
            <span>Wear It</span>
          </a>

          <a
            href="#gallery"
            style={{
              height: 'clamp(40px, 3.2vw, 52px)',
              padding: '0 clamp(16px, 1.4vw, 22px)',
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.45)',
              background: 'transparent',
              color: '#fff',
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ opacity: 0.6 }}>[</span>
            <span>Tour the Floor</span>
            <span style={{ opacity: 0.6 }}>]</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Desktop (broadcast control room) ────────────────────────────── */
function DesktopHero({ onCta, booted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, '100px')
  const [mounted, setMounted] = useState(false)
  const [awayY, setAwayY] = useState(0)

  useEffect(() => {
    const onScroll = () => setAwayY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const awayProgress = Math.min(1, Math.max(0, (awayY - window.innerHeight * 0.25) / (window.innerHeight * 0.4)))
  const awayFade: React.CSSProperties = {
    opacity: 1 - awayProgress,
    transform: `translateY(${awayProgress * -12}px)`,
    transition: 'opacity 220ms ease, transform 220ms ease',
    pointerEvents: awayProgress > 0.9 ? 'none' : 'auto',
  }

  useEffect(() => {
    if (!booted || !videoRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    videoRef.current.play().catch(() => {})
  }, [booted])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const slabIn: React.CSSProperties = {
    transform: mounted ? 'translateX(0)' : 'translateX(-110%)',
    transition: 'transform 1100ms cubic-bezier(0.22,1,0.36,1)',
  }
  const slabInDelay: React.CSSProperties = {
    transform: mounted ? 'translateX(0)' : 'translateX(-110%)',
    transition: 'transform 1100ms 140ms cubic-bezier(0.22,1,0.36,1)',
  }
  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transition: `opacity 900ms ${delay}ms ease`,
  })

  return (
    <section
      ref={sectionRef}
      className={inView ? undefined : 'gfc-hero-paused'}
      style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        height: '100svh',
        minHeight: 680,
        overflow: 'hidden',
        background: '#0a0a0d',
        color: '#fff',
      }}
    >
      <style>{`
        @keyframes gfcBlink { 0%,100% { opacity:1 } 50% { opacity:0.15 } }
        @keyframes gfcScan  { 0% { background-position: 0 0 } 100% { background-position: 0 160px } }
        @keyframes gfcProgress { 0% { transform: scaleX(0) } 100% { transform: scaleX(1) } }
        @keyframes gfcSweep { 0%,100% { opacity: 0 } 50% { opacity: 0.18 } }
        @keyframes gfcAberration {
          0%, 92%, 100% { text-shadow: none; transform: translate(0,0); }
          93% { text-shadow: -2px 0 0 ${RED}, 2px 0 0 #00e6ff; transform: translate(1px,0); }
          94% { text-shadow:  2px 0 0 ${RED}, -2px 0 0 #00e6ff; transform: translate(-1px,0); }
          95% { text-shadow: -1px 0 0 ${RED}, 1px 0 0 #00e6ff; transform: translate(0,0); }
        }
        .gfc-hero-paused, .gfc-hero-paused * { animation-play-state: paused !important; }
        .gfc-cta-primary:hover { background:#fff !important; color:${RED} !important; }
        .gfc-cta-primary:hover .gfc-cta-tri { border-left-color:${RED} !important; }
        .gfc-cta-ghost:hover   { background:${RED} !important; color:#fff !important; border-color:${RED} !important; }
      `}</style>

      {/* ── Video ── */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero-poster.webp"
        aria-hidden="true"
        src="/hero.mp4"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'contrast(1.05) saturate(0.85) brightness(0.78)',
        }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(10,10,13,0.55) 0%, rgba(10,10,13,0) 22%, rgba(10,10,13,0) 55%, rgba(10,10,13,0.85) 100%)',
        }}
      />

      {/* CRT corner vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.18,
          mixBlendMode: 'overlay',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
          animation: 'gfcScan 8s linear infinite',
        }}
      />

      {/* Red sweep */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: `linear-gradient(115deg, transparent 35%, ${RED} 50%, transparent 65%)`,
          mixBlendMode: 'soft-light',
          animation: 'gfcSweep 7s ease-in-out infinite',
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.32,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ── Top bar: LIVE bug + segment id ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 6,
          padding: '20px clamp(24px, 3vw, 44px)',
          paddingTop: 'clamp(72px, 7vh, 100px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.8)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          ...fadeIn(200),
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: RED,
              boxShadow: `0 0 10px ${RED}`,
              animation: 'gfcBlink 1.05s steps(2,end) infinite',
              display: 'inline-block',
            }}
          />
          <span style={{ color: '#fff', fontWeight: 500 }}>● LIVE · GFC.24</span>
          <span style={{ width: 36, height: 1, background: 'rgba(255,255,255,0.25)', marginLeft: 6 }} />
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>FEED 001 / FLOOR_A</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>CH.001</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>SIG ▮▮▮▮▯</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: PHOSPHOR }}>● ON-AIR</span>
        </div>
      </div>

      {/* ── Right vertical channel bug ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 'clamp(18px, 2vw, 32px)',
          top: '50%',
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.42)',
          textTransform: 'uppercase',
          zIndex: 6,
          pointerEvents: 'none',
          ...fadeIn(400),
        }}
      >
        GFC · 24/7 · KANDY · 7.29°N
      </div>

      {/* ── Left vertical tick column ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 'clamp(18px, 2vw, 32px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.32)',
          pointerEvents: 'none',
          ...fadeIn(550),
        }}
      >
        {['SEG_A', 'CAM_03', 'GAIN_82', 'TRIM_-1.2', 'LUT_RED'].map((t, i) => (
          <span key={t} style={{ color: i === 0 ? RED : undefined }}>
            {String(i + 1).padStart(2, '0')} · {t}
          </span>
        ))}
      </div>

      {/* ── Lower-third stacked slabs ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 'clamp(140px, 16vh, 220px)',
          zIndex: 7,
          pointerEvents: 'none',
        }}
      >
        {/* Primary red slab w/ headline */}
        <div
          style={{
            position: 'relative',
            ...slabIn,
            ...awayFade,
            background: RED,
            padding:
              'clamp(22px, 2.4vw, 36px) clamp(48px, 5vw, 96px) clamp(22px, 2.4vw, 36px) clamp(56px, 6vw, 96px)',
            display: 'inline-block',
            zIndex: 1,
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 16,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            H/01
          </div>
          <div
            style={{
              position: 'absolute',
              right: 14,
              bottom: 14,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            REC ●
          </div>

          <h1
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(74px, 8.4vw, 148px)',
              lineHeight: 0.92,
              letterSpacing: '-0.025em',
              margin: 0,
              color: '#fff',
              animation: 'gfcAberration 6.2s steps(1,end) infinite',
              willChange: 'transform',
            }}
          >
            <span style={{ display: 'block' }}>Wear&nbsp;the</span>
            <span style={{ display: 'block', color: '#0a0a0d', marginTop: '0.04em' }}>Moment.</span>
          </h1>
        </div>
      </div>

      {/* ── Twin CTA cluster ── */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(56px, 6vw, 96px)',
          bottom: 'clamp(64px, 8vh, 110px)',
          zIndex: 8,
          display: 'flex',
          alignItems: 'stretch',
          gap: 14,
          ...fadeIn(700),
          ...awayFade,
        }}
      >
        <a
          href="#contact"
          onClick={onCta}
          className="gfc-cta-primary"
          style={{
            height: 'clamp(52px, 4.6vw, 64px)',
            padding: '0 clamp(28px, 2.6vw, 40px)',
            background: RED,
            border: `1px solid ${RED}`,
            color: '#fff',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
        >
          <span
            className="gfc-cta-tri"
            aria-hidden
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '9px solid #fff',
              transition: 'border-left-color 0.25s ease',
            }}
          />
          Wear It
        </a>
        <a
          href="#gallery"
          className="gfc-cta-ghost"
          style={{
            height: 'clamp(52px, 4.6vw, 64px)',
            padding: '0 clamp(22px, 2vw, 32px)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.55)',
            color: '#fff',
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease',
          }}
        >
          [ Tour the Floor ]
        </a>
      </div>

      {/* ── Bottom-right timecode block ── */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(24px, 3vw, 44px)',
          bottom: 'clamp(64px, 8vh, 110px)',
          zIndex: 8,
          textAlign: 'right',
          fontFamily: MONO,
          color: '#fff',
          ...fadeIn(800),
          ...awayFade,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.36em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          SMPTE · 24fps
        </div>
        <div
          style={{
            fontSize: 'clamp(28px, 2.4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            lineHeight: 1,
            color: '#fff',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <Timecode />
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            letterSpacing: '0.36em',
            color: RED,
            textTransform: 'uppercase',
          }}
        >
          ◉ REC · FLOOR_A · K-01
        </div>
      </div>

      {/* ── Bottom progress bar ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          zIndex: 9,
        }}
      >
        <div
          style={{
            height: '100%',
            background: RED,
            transformOrigin: 'left center',
            animation: 'gfcProgress 30s linear infinite',
          }}
        />
      </div>

      {/* ── 4 corner frame brackets ── */}
      {[
        { top: 90, left: 18, b: 'lt' },
        { top: 90, right: 18, b: 'rt' },
        { bottom: 18, left: 18, b: 'lb' },
        { bottom: 18, right: 18, b: 'rb' },
      ].map((p, i) => {
        const isLeft = p.b[0] === 'l'
        const isTop = p.b[1] === 't'
        return (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              width: 18,
              height: 18,
              zIndex: 6,
              pointerEvents: 'none',
              top: p.top,
              left: p.left,
              right: p.right,
              bottom: p.bottom,
              borderTop: isTop ? `1px solid ${RED}` : undefined,
              borderBottom: !isTop ? `1px solid ${RED}` : undefined,
              borderLeft: isLeft ? `1px solid ${RED}` : undefined,
              borderRight: !isLeft ? `1px solid ${RED}` : undefined,
              ...fadeIn(300 + i * 60),
            }}
          />
        )
      })}
    </section>
  )
}

/* ─── Responsive switcher ─────────────────────────────────────────── */
export default function Hero(props: Props) {
  return (
    <>
      <div className="block md:hidden">
        <MobileHero {...props} />
      </div>
      <div className="hidden md:block">
        <DesktopHero {...props} />
      </div>
    </>
  )
}
