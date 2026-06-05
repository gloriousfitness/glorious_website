import { useEffect, useState } from 'react'

const RED = '#E10A1F'

const CATEGORIES = ['Gym', 'Competition'] as const
type CategoryName = (typeof CATEGORIES)[number]

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

function globToSortedUrls(glob: Record<string, string>): string[] {
  return Object.keys(glob).sort().map(k => glob[k])
}

const gymGlob = import.meta.glob('../assets/gallery/gym/*.webp', { eager: true, import: 'default', query: '?url' }) as Record<string, string>
const competitionGlob = import.meta.glob('../assets/gallery/competition/*.webp', { eager: true, import: 'default', query: '?url' }) as Record<string, string>

const CATEGORY_IMAGES: Record<CategoryName, string[]> = {
  Gym: globToSortedUrls(gymGlob),
  Competition: globToSortedUrls(competitionGlob),
}

const CATEGORY_META: Record<CategoryName, { desc: string; year: string }> = {
  Gym: { desc: 'Inside the bank. Iron, sweat, mirrors. Daily.', year: '2018 → 2026' },
  Competition: { desc: 'On the platform, under the lights. Our athletes lift.', year: '2019 → 2026' },
}

/* ─── Lightbox w/ prev/next ─────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  category,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  category: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  const src = images[index]
  const filename = src.split('/').pop() ?? ''
  const stamp = String(index + 1).padStart(3, '0')
  const total = String(images.length).padStart(3, '0')

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8,8,10,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'lbFadeIn 180ms ease forwards',
        cursor: 'zoom-out',
      }}
    >
      <style>{`
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lbScaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>

      {/* Grain */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          backgroundImage: GRAIN_BG,
        }}
      />

      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '14px 24px',
          background: RED,
          color: '#fff',
          fontFamily: 'Freshman, serif',
          fontSize: 10.5,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <span>[ Frame {stamp} / {total} ] · / {category}</span>
        <span style={{ opacity: 0.85, fontFamily: 'Inter, system-ui', fontSize: 10, fontWeight: 500 }}>
          {filename}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.5)',
            color: '#fff',
            fontFamily: 'Freshman, serif',
            fontSize: 11,
            letterSpacing: '0.24em',
            padding: '5px 12px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Close ✕
        </button>
      </div>

      {/* Image */}
      <img
        key={src}
        src={src}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '88vw',
          maxHeight: '78vh',
          objectFit: 'contain',
          border: `1px solid ${RED}`,
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          animation: 'lbScaleIn 260ms cubic-bezier(0.22,1,0.36,1) forwards',
          cursor: 'default',
        }}
      />

      {/* Nav arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Previous"
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: `1px solid rgba(255,255,255,0.25)`,
          color: '#fff',
          width: 56,
          height: 56,
          fontFamily: 'Freshman, serif',
          fontSize: 22,
          cursor: 'pointer',
          zIndex: 2,
        }}
      >←</button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Next"
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: `1px solid rgba(255,255,255,0.25)`,
          color: '#fff',
          width: 56,
          height: 56,
          fontFamily: 'Freshman, serif',
          fontSize: 22,
          cursor: 'pointer',
          zIndex: 2,
        }}
      >→</button>

      {/* Bottom hint */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Inter, system-ui',
          fontSize: 9.5,
          letterSpacing: '0.32em',
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase',
          padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        ← / → to step · ESC to close
      </div>
    </div>
  )
}

/* ─── Contact sheet frame ───────────────────────────────────────────── */
function Frame({
  src,
  index,
  category,
  onClick,
  desktop,
}: {
  src: string
  index: number
  category: string
  onClick: () => void
  desktop: boolean
}) {
  const [hover, setHover] = useState(false)
  const stamp = String(index + 1).padStart(3, '0')

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: '4 / 5',
        padding: 0,
        background: '#0a0a0d',
        border: `1px solid ${hover ? RED : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 200ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={`Open frame ${stamp} — ${category}`}
    >
      {/* Red left edge accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: hover ? 3 : 0,
          background: RED,
          transition: 'width 220ms cubic-bezier(0.22,1,0.36,1)',
          zIndex: 3,
        }}
      />

      <img
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
          transform: hover ? 'scale(1.04)' : 'scale(1)',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner stamp */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          fontFamily: 'Freshman, serif',
          fontSize: desktop ? 10.5 : 9.5,
          letterSpacing: '0.28em',
          color: RED,
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          zIndex: 2,
        }}
      >
        {stamp}
      </div>

    </button>
  )
}

/* ─── Hooks ─────────────────────────────────────────────────────────── */
function useDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isDesktop
}

/* ─── Shared bits ──────────────────────────────────────────────────── */
function Ticker({ left, right }: { left: string; right: string }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 3,
        background: RED,
        color: '#fff',
        fontFamily: 'Freshman, serif',
        fontSize: 10.5,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        padding: '11px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span>{left}</span>
      <span style={{ opacity: 0.85 }}>{right}</span>
    </div>
  )
}

function MobileTicker({ left, right }: { left: string; right: string }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 3,
        background: RED,
        color: '#fff',
        fontFamily: 'Freshman, serif',
        fontSize: 9.5,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        padding: '9px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{left}</span>
      <span style={{ opacity: 0.85 }}>{right}</span>
    </div>
  )
}

/* ─── Sidebar category nav ─────────────────────────────────────────── */
function CategoryNav({
  active,
  onChange,
  desktop,
}: {
  active: number
  onChange: (i: number) => void
  desktop: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {CATEGORIES.map((cat, i) => {
        const isActive = i === active
        const count = CATEGORY_IMAGES[cat].length
        return (
          <button
            key={cat}
            onClick={() => onChange(i)}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: desktop ? '24px 1fr auto' : '20px 1fr auto',
              gap: 14,
              alignItems: 'center',
              padding: desktop ? '16px 0 16px 14px' : '14px 0 14px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Active red bar */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: isActive ? 4 : 0,
                height: isActive ? 'calc(100% - 18px)' : 0,
                background: RED,
                transition: 'width 220ms ease, height 220ms ease',
              }}
            />
            <span
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: desktop ? 11 : 10,
                letterSpacing: '0.28em',
                color: isActive ? RED : 'rgba(255,255,255,0.35)',
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: desktop ? 18 : 16,
                letterSpacing: '0.04em',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}
            >
              {cat}
            </span>
            <span
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 10,
                letterSpacing: '0.28em',
                color: isActive ? RED : 'rgba(255,255,255,0.28)',
                textTransform: 'uppercase',
              }}
            >
              [{String(count).padStart(2, '0')}]
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function GallerySection() {
  const [category, setCategory] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isDesktop = useDesktop()

  const catName = CATEGORIES[category]
  const images = CATEGORY_IMAGES[catName]
  const meta = CATEGORY_META[catName]

  const onChangeCategory = (i: number) => {
    if (i === category) return
    setPhase('out')
    setTimeout(() => {
      setCategory(i)
      setPhase('in')
      setTimeout(() => setPhase('idle'), 260)
    }, 220)
  }

  const contentOpacity = phase === 'out' ? 0 : 1

  const openAt = (i: number) => setLightboxIndex(i)
  const closeLb = () => setLightboxIndex(null)
  const prevLb = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const nextLb = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length))

  if (isDesktop) {
    return (
      <>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            category={catName}
            onClose={closeLb}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
        <section
          id="gallery"
          className="breakout-full"
          style={{
            position: 'relative',
            background: '#0a0a0d',
            color: '#fff',
            overflow: 'clip',
          }}
        >
          {/* Grain */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.32,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 0,
              backgroundImage: GRAIN_BG,
            }}
          />

          <Ticker
            left="Glorious F.C. — Photographic Record"
            right="Est. 2018 · Kandy · Iron · Sweat · Glory"
          />

          {/* Watermark */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '32%',
              right: '-3vw',
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(180px, 22vw, 360px)',
              color: 'rgba(225,10,31,0.045)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
              lineHeight: 0.85,
            }}
          >
            GALLERY
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 1400,
              margin: '0 auto',
              padding: '88px 80px 96px',
              display: 'grid',
              gridTemplateColumns: '44px 420px 1fr',
              gap: 56,
            }}
          >
            {/* Rotated § label */}
            <div
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontFamily: 'Inter, system-ui',
                fontSize: 10.5,
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                alignSelf: 'start',
                paddingTop: 8,
                position: 'sticky',
                top: 32,
              }}
            >
              § 04 — The Record
            </div>

            {/* Sidebar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 32,
                alignSelf: 'start',
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 11,
                  letterSpacing: '0.24em',
                  color: RED,
                  marginBottom: 24,
                }}
              >
                [ 004 / Gallery ]
              </div>
              <h2
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 'clamp(64px, 6vw, 92px)',
                  lineHeight: 0.88,
                  margin: '0 0 0 -2px',
                  letterSpacing: '-0.015em',
                  color: '#fff',
                }}
              >
                Gallery
                <br />
                <span style={{ color: RED }}>Record.</span>
              </h2>

              <p
                style={{
                  fontFamily: 'Inter, system-ui',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  margin: '28px 0 0',
                  maxWidth: 320,
                }}
              >
                Image bank — frames from the bank, the platform, the long road back from zero.{' '}
                <span style={{ color: '#fff' }}>Pick a reel.</span>
              </p>

              {/* Hairline + stat tape */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  borderTop: `1px solid ${RED}`,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  marginTop: 28,
                }}
              >
                <div style={{ flex: 1, padding: '18px 0 16px' }}>
                  <div
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 32,
                      color: '#fff',
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {String(images.length).padStart(3, '0')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      color: 'rgba(255,255,255,0.42)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Frames
                  </div>
                </div>
                <div style={{ flex: 1, padding: '18px 0 16px', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 18 }}>
                  <div
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 32,
                      color: '#fff',
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    03
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      color: 'rgba(255,255,255,0.42)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Reels
                  </div>
                </div>
              </div>

              {/* Category nav */}
              <div style={{ marginTop: 32 }}>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    color: 'rgba(255,255,255,0.42)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                    paddingBottom: 8,
                    borderBottom: `2px solid ${RED}`,
                  }}
                >
                  / Reels
                </div>
                <CategoryNav active={category} onChange={onChangeCategory} desktop />
              </div>

              {/* Bottom corner */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 32,
                  fontFamily: 'Inter, system-ui',
                  fontSize: 9.5,
                  letterSpacing: '0.32em',
                  color: 'rgba(255,255,255,0.22)',
                  textTransform: 'uppercase',
                }}
              >
                Glorious Fitness Center · Kandy
              </div>
            </div>

            {/* Right panel */}
            <div style={{ minWidth: 0, opacity: contentOpacity, transition: 'opacity 220ms ease' }}>
              {/* Reel header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  paddingBottom: 18,
                  borderBottom: `2px solid ${RED}`,
                  marginBottom: 28,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 10,
                      letterSpacing: '0.32em',
                      color: 'rgba(255,255,255,0.42)',
                      textTransform: 'uppercase',
                      marginBottom: 12,
                    }}
                  >
                    Reel 0{category + 1} / {CATEGORIES.length} · {meta.year}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 40,
                      letterSpacing: '0.01em',
                      margin: 0,
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {catName}.
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.6)',
                      margin: '14px 0 0',
                      maxWidth: 520,
                    }}
                  >
                    {meta.desc}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 14,
                }}
              >
                {images.map((src, i) => (
                  <Frame
                    key={src + i}
                    src={src}
                    index={i}
                    category={catName}
                    onClick={() => openAt(i)}
                    desktop
                  />
                ))}
              </div>
            </div>
          </div>

        </section>
      </>
    )
  }

  /* ── Mobile ── */
  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          category={catName}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      )}
      <section
        id="gallery"
        style={{
          position: 'relative',
          background: '#0a0a0d',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.32,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            zIndex: 0,
            backgroundImage: GRAIN_BG,
          }}
        />

        <MobileTicker left="Glorious F.C." right="Photographic Record" />

        {/* Watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 140,
            right: '-16vw',
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(220px, 72vw, 380px)',
            color: 'rgba(225,10,31,0.055)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
            lineHeight: 0.85,
          }}
        >
          GALLERY
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '52px 20px 56px' }}>
          {/* Identity mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <div style={{ width: 28, height: 1, background: RED }} />
            <div
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 10,
                letterSpacing: '0.28em',
                color: RED,
                textTransform: 'uppercase',
              }}
            >
              [ 004 / Gallery ]
            </div>
          </div>

          <h2
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(60px, 20vw, 92px)',
              lineHeight: 0.86,
              margin: '0 0 0 -2px',
              letterSpacing: '-0.02em',
              color: '#fff',
            }}
          >
            Gallery
            <br />
            <span style={{ color: RED }}>Record.</span>
          </h2>

          <p
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 14.5,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              margin: '24px 0 0',
            }}
          >
            Image bank — bank, platform, long road back.{' '}
            <span style={{ color: '#fff' }}>Pick a reel.</span>
          </p>

          {/* Reel nav */}
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 9.5,
                letterSpacing: '0.32em',
                color: 'rgba(255,255,255,0.42)',
                textTransform: 'uppercase',
                marginBottom: 4,
                paddingBottom: 8,
                borderBottom: `2px solid ${RED}`,
              }}
            >
              / Reels
            </div>
            <CategoryNav active={category} onChange={onChangeCategory} desktop={false} />
          </div>

          {/* Reel meta */}
          <div
            style={{
              marginTop: 28,
              opacity: contentOpacity,
              transition: 'opacity 220ms ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingBottom: 14,
                borderBottom: `1px solid ${RED}`,
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 9,
                    letterSpacing: '0.32em',
                    color: 'rgba(255,255,255,0.45)',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Reel 0{category + 1} · {meta.year}
                </div>
                <div
                  style={{
                    fontFamily: 'Freshman, serif',
                    fontSize: 26,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {catName}.
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.55)',
                margin: '0 0 22px',
              }}
            >
              {meta.desc}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
              }}
            >
              {images.map((src, i) => (
                <Frame
                  key={src + i}
                  src={src}
                  index={i}
                  category={catName}
                  onClick={() => openAt(i)}
                  desktop={false}
                />
              ))}
            </div>
          </div>
        </div>

      </section>
    </>
  )
}
