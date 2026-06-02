import { useEffect, useRef } from 'react'

const RED = '#E10A1F'

type Props = { onCta?: () => void; booted?: boolean }

export default function Hero({ onCta, booted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (booted && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
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
              'linear-gradient(180deg, rgba(13,13,16,0.5) 0%, rgba(13,13,16,0.05) 35%, rgba(13,13,16,0.25) 75%, rgba(13,13,16,0.55) 100%)',
          }}
        />
      </div>

      {/* Header logo — mobile only; desktop uses fixed DesktopNav */}
      <div
        className="relative flex items-center justify-between md:hidden"
        style={{
          padding: 'clamp(12px, 1.5vw, 24px) clamp(24px, 5vw, 80px) clamp(18px, 2vw, 32px)',
          zIndex: 2,
        }}
      >
        <div className="flex flex-row items-center" style={{ gap: 'clamp(7px, 0.6vw, 14px)' }}>
          <img
            src="/glorious-logo.png"
            alt="Glorious logo"
            style={{
              height: 'clamp(40px, 4vw, 72px)',
              width: 'clamp(40px, 4vw, 72px)',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <div className="flex flex-col" style={{ gap: 1 }}>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 'clamp(24px, 2.4vw, 44px)',
                color: RED,
                letterSpacing: '0.08em',
                lineHeight: 1,
                WebkitTextStroke: `clamp(0.5px, 0.08vw, 1px) ${RED}`,
              }}
            >
              GLORIOUS
            </div>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 'clamp(9px, 0.9vw, 16px)',
                color: '#fff',
                letterSpacing: '0.18em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              FITNESS CENTER
            </div>
          </div>
        </div>
        <div style={{ width: 44, height: 44 }} />
      </div>

      <div style={{ flex: 1 }} />

      <div
        className="relative flex flex-col"
        style={{
          zIndex: 2,
          padding: '0 clamp(24px, 5vw, 80px) clamp(64px, 6vw, 120px)',
          maxWidth: 1280,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontFamily: 'Graduate, serif',
            fontSize: 'clamp(48px, 8vw, 140px)',
            lineHeight: 0.95,
            margin: '0 0 clamp(20px, 2vw, 40px)',
            letterSpacing: '0.01em',
            color: '#fff',
          }}
        >
          <span style={{ textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}>Wear the</span>
          <br />
          <span style={{ color: RED, textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}>moment.</span>
        </h1>
        <button
          onClick={onCta}
          style={{
            height: 'clamp(52px, 5vw, 80px)',
            maxWidth: 'clamp(280px, 30vw, 480px)',
            borderRadius: 999,
            border: 'none',
            background: '#fff',
            color: '#000',
            fontFamily: 'Inter, system-ui',
            fontWeight: 600,
            fontSize: 'clamp(14px, 1.1vw, 20px)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Start Today
        </button>
      </div>
    </section>
  )
}
