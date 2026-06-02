import { useEffect, useRef } from 'react'

const RED = '#E10A1F'

type Props = { onCta?: () => void; booted?: boolean }

export default function Hero({ onCta, booted }: Props) {
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
        // Break out of mobile-shell -> full viewport width
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
          poster="/hero-poster.jpg"
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
              'linear-gradient(180deg, rgba(13,13,16,0.55) 0%, rgba(13,13,16,0.05) 30%, rgba(13,13,16,0.45) 65%, rgba(13,13,16,0.85) 100%)',
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
          padding: '0 clamp(24px, 5vw, 80px) clamp(28px, 3vw, 60px)',
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontFamily: 'Graduate, serif',
            fontSize: 'clamp(68px, 9vw, 156px)',
            lineHeight: 0.88,
            margin: '0 0 clamp(32px, 3vw, 52px)',
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          <span>Wear the</span>
          <br />
          <span style={{ color: RED }}>moment.</span>
        </h1>
        <button
          onClick={onCta}
          className="w-full sm:w-auto sm:max-w-[clamp(280px,30vw,480px)] group relative overflow-hidden"
          style={{
            height: 'clamp(56px, 5vw, 84px)',
            borderRadius: 2,
            border: `1px solid ${RED}`,
            background: RED,
            color: '#fff',
            fontFamily: 'Graduate, serif',
            fontWeight: 400,
            fontSize: 'clamp(15px, 1.1vw, 20px)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.35s ease, color 0.35s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = RED
            e.currentTarget.style.borderColor = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = RED
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = RED
          }}
        >
          <span>Wear It</span>
          <span aria-hidden style={{ fontSize: '0.9em', transform: 'translateY(-1px)' }}>→</span>
        </button>
      </div>

      <div
        aria-hidden
        className="hidden sm:flex"
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'Inter, system-ui',
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          pointerEvents: 'none',
        }}
      >
        <span>Scroll</span>
        <span
          style={{
            width: 1,
            height: 38,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0))',
            animation: 'heroScrollPulse 1.8s ease-in-out infinite',
            transformOrigin: 'top',
          }}
        />
        <style>{`
          @keyframes heroScrollPulse {
            0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
            50% { transform: scaleY(1); opacity: 1; }
          }
        `}</style>
      </div>
    </section>
  )
}
