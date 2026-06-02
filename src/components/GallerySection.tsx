import { useEffect, useMemo, useRef, useState } from 'react'

const RED = '#E10A1F'

const CATEGORIES = ['Gym', 'Competition', 'Transformation'] as const
type CategoryName = (typeof CATEGORIES)[number]

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

const GYM_IMAGES = [
  '5A6A7503.jpg','5A6A7504.jpg','BN3A9415.jpg','BN3A9416.jpg','BN3A9417.jpg',
  'BN3A9418.jpg','FB_IMG_1534003443385.jpg','FB_IMG_1534003446324.jpg',
  'FB_IMG_1534003449514.jpg','FB_IMG_1534003452144.jpg','FB_IMG_1534003454807.jpg',
  'FB_IMG_1534003457787.jpg','FB_IMG_1534003460281.jpg','FB_IMG_1534003463110.jpg',
  'FB_IMG_1534003465873.jpg','FB_IMG_1534003468303.jpg','FB_IMG_1534003472030.jpg',
  'FB_IMG_1534003475293.jpg','FB_IMG_1534003486962.jpg','FB_IMG_1534003489537.jpg',
  'FB_IMG_1534003492649.jpg','FB_IMG_1534003505233.jpg','FB_IMG_1534003522075.jpg',
  'FB_IMG_1534003538315.jpg','FB_IMG_1534003541259.jpg','FB_IMG_1534003545158.jpg',
].map(f => `/gallery/gym/${f}`)

const CATEGORY_IMAGES: Record<CategoryName, string[]> = {
  Gym: GYM_IMAGES,
  Competition: GYM_IMAGES,
  Transformation: GYM_IMAGES,
}

const TAG_POOLS: Record<CategoryName, string[]> = {
  Gym: ['Iron', 'Rack', 'Plates', 'Cardio', 'Grind', 'Recovery', 'Lifters'],
  Competition: ['Stage', 'Platform', 'Podium', 'Open', 'Meet', 'PR', 'Trophy'],
  Transformation: ['Before', 'Mid', 'After', 'Cut', 'Bulk', 'Reps', 'Result'],
}

const PALETTES: Record<CategoryName, Array<[string, string]>> = {
  Gym: [
    ['#2a2d33', '#13151a'],
    ['#3a3f47', '#1c1e24'],
    ['#1e2128', '#0a0c10'],
    ['#4a4e58', '#23262d'],
    ['#2d3138', '#15171c'],
    ['#5a3236', '#26161a'],
  ],
  Competition: [
    ['#7a1018', '#2a0508'],
    ['#3a0408', '#120103'],
    ['#a01825', '#3a060b'],
    ['#5a0a14', '#1f0306'],
    ['#26080c', '#0b0204'],
    ['#c01a2a', '#52070f'],
  ],
  Transformation: [
    ['#6b4a2a', '#291c10'],
    ['#8a5f37', '#3a2814'],
    ['#a87340', '#4a3018'],
    ['#3a2814', '#150d06'],
    ['#7a5230', '#2a1b0d'],
    ['#5a3a20', '#1f140a'],
  ],
}

const CATEGORY_META: Record<CategoryName, { desc: string; year: string }> = {
  Gym: { desc: 'Inside the bank. Iron, sweat, mirrors. Daily.', year: '2018 → 2026' },
  Competition: { desc: 'On the platform, under the lights. Our athletes lift.', year: '2019 → 2026' },
  Transformation: { desc: 'Before. During. After. Months of honest work.', year: '2020 → 2026' },
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
          fontFamily: 'Graduate, serif',
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
            fontFamily: 'Graduate, serif',
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
          fontFamily: 'Graduate, serif',
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
          fontFamily: 'Graduate, serif',
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
  tag,
  category,
  onClick,
  desktop,
}: {
  src: string
  index: number
  tag: string
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
          fontFamily: 'Graduate, serif',
          fontSize: desktop ? 10.5 : 9.5,
          letterSpacing: '0.28em',
          color: RED,
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          zIndex: 2,
        }}
      >
        {stamp}
      </div>

      {/* Bottom strip — tag */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Inter, system-ui',
          fontSize: desktop ? 9 : 8.5,
          letterSpacing: '0.32em',
          color: hover ? '#fff' : 'rgba(255,255,255,0.62)',
          textTransform: 'uppercase',
          zIndex: 2,
          transition: 'color 220ms ease',
        }}
      >
        <span>/ {tag}</span>
        <span style={{ color: hover ? RED : 'rgba(255,255,255,0.32)', transition: 'color 220ms ease' }}>↗</span>
      </div>
    </button>
  )
}

/* ─── Scatter canvas (preserved as optional view) ───────────────────── */
type Item = {
  id: string
  x: number
  y: number
  w: number
  h: number
  rotation: number
  grad: [string, string]
  imgSrc: string
  realIndex: number
}

function makeRand(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function generateLayout(
  seed: number,
  palette: Array<[string, string]>,
  desktop: boolean,
  images: string[]
): Item[] {
  const rand = makeRand(seed)
  const cols = desktop ? 7 : 5
  const rows = desktop ? 5 : 5
  const count = Math.min(desktop ? 30 : 21, images.length)
  const positions: Array<[number, number]> = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) positions.push([c, r])
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }
  const pick = positions.slice(0, count)
  const colStep = desktop ? 240 : 175
  const rowStep = desktop ? 215 : 175
  const cCenter = desktop ? 3 : 2
  const rCenter = desktop ? 2 : 2
  return pick.map(([c, r], i) => {
    const aspect = [0.72, 1.0, 1.34, 0.85, 1.15][i % 5]
    const baseW = desktop
      ? 130 + Math.floor(rand() * 28)
      : 96 + Math.floor(rand() * 20)
    const baseH = Math.round(baseW / aspect)
    const jitter = desktop ? 90 : 60
    const jx = (rand() - 0.5) * jitter
    const jy = (rand() - 0.5) * jitter
    const rotation = (rand() - 0.5) * 6
    const colorIdx = Math.floor(rand() * palette.length)
    return {
      id: `${seed}-${i}`,
      x: (c - cCenter) * colStep + jx,
      y: (r - rCenter) * rowStep + jy,
      w: baseW,
      h: baseH,
      rotation,
      grad: palette[colorIdx],
      imgSrc: images[i % images.length],
      realIndex: i % images.length,
    }
  })
}

function distanceScale(distance: number, desktop: boolean) {
  const FOCUS_RADIUS = desktop ? 380 : 280
  const t = Math.min(1, distance / FOCUS_RADIUS)
  const eased = t * t * (3 - 2 * t)
  return (desktop ? 2.4 : 2.2) - (desktop ? 1.85 : 1.65) * eased
}

function ScatterCanvas({
  category,
  desktop,
  canvasHeight,
  onPick,
}: {
  category: CategoryName
  desktop: boolean
  canvasHeight: number
  onPick: (realIndex: number) => void
}) {
  const items = useMemo(
    () => generateLayout(7 + CATEGORIES.indexOf(category) * 31, PALETTES[category], desktop, CATEGORY_IMAGES[category]),
    [category, desktop]
  )

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 })
  const hasDraggedRef = useRef(false)
  const downTargetRef = useRef<HTMLElement | null>(null)
  const lastMove = useRef({ x: 0, y: 0, t: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    velRef.current = { x: 0, y: 0 }
    panRef.current = { x: 0, y: 0 }
    setPan({ x: 0, y: 0 })
  }, [category])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current)
    velRef.current = { x: 0, y: 0 }
    hasDraggedRef.current = false
    downTargetRef.current = e.target as HTMLElement
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    lastMove.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.hypot(dx, dy) > 5) hasDraggedRef.current = true
    const nx = d.panX + dx
    const ny = d.panY + dy
    panRef.current = { x: nx, y: ny }
    setPan({ x: nx, y: ny })
    const now = performance.now()
    const dt = now - lastMove.current.t || 16
    velRef.current = {
      x: ((e.clientX - lastMove.current.x) / dt) * 16,
      y: ((e.clientY - lastMove.current.y) / dt) * 16,
    }
    lastMove.current = { x: e.clientX, y: e.clientY, t: now }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* noop */ }

    if (!hasDraggedRef.current && downTargetRef.current) {
      const card = downTargetRef.current.closest('[data-real-index]') as HTMLElement | null
      const idx = card?.dataset.realIndex
      if (idx !== undefined) onPick(parseInt(idx, 10))
    }

    const decay = 0.93
    const tick = () => {
      velRef.current.x *= decay
      velRef.current.y *= decay
      const np = {
        x: panRef.current.x + velRef.current.x,
        y: panRef.current.y + velRef.current.y,
      }
      panRef.current = np
      setPan(np)
      if (Math.hypot(velRef.current.x, velRef.current.y) > 0.25) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        height: canvasHeight,
        width: '100%',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
        cursor: dragRef.current.active ? 'grabbing' : 'grab',
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'radial-gradient(80% 50% at 50% 50%, rgba(225,10,31,0.05) 0%, rgba(0,0,0,0) 70%), #0a0a0c',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {items.map((it) => {
          const ex = it.x + pan.x
          const ey = it.y + pan.y
          const dist = Math.hypot(ex, ey)
          const scale = distanceScale(dist, desktop)
          const opacity = Math.max(0.45, 1 - (dist - 200) / 800)
          return (
            <div
              key={it.id}
              data-real-index={it.realIndex}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: it.w,
                height: it.h,
                marginLeft: -it.w / 2,
                marginTop: -it.h / 2,
                transform: `translate3d(${ex}px, ${ey}px, 0) rotate(${it.rotation}deg) scale(${scale})`,
                transformOrigin: 'center center',
                transition: dragRef.current.active
                  ? 'none'
                  : 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
                willChange: 'transform',
                opacity,
                zIndex: Math.round(1000 - dist),
                border: `1px solid rgba(255,255,255,0.1)`,
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.55)',
                background: `linear-gradient(135deg, ${it.grad[0]}, ${it.grad[1]})`,
              }}
            >
              <img
                src={it.imgSrc}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  userSelect: 'none',
                }}
              />
            </div>
          )
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 50%, rgba(10,10,13,0) 55%, rgba(10,10,13,0.78) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          fontFamily: 'Inter, system-ui',
          fontSize: 9.5,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          padding: '6px 14px',
          border: `1px solid ${RED}`,
          background: 'rgba(10,10,13,0.6)',
        }}
      >
        Drag · Tap to open
      </div>
    </div>
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
        fontFamily: 'Graduate, serif',
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
        fontFamily: 'Graduate, serif',
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
                fontFamily: 'Graduate, serif',
                fontSize: desktop ? 11 : 10,
                letterSpacing: '0.28em',
                color: isActive ? RED : 'rgba(255,255,255,0.35)',
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                fontFamily: 'Graduate, serif',
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

/* ─── View toggle (Sheet | Scatter) ────────────────────────────────── */
function ViewToggle({
  view,
  setView,
}: {
  view: 'reel' | 'scatter'
  setView: (v: 'reel' | 'scatter') => void
}) {
  const opts: Array<'reel' | 'scatter'> = ['reel', 'scatter']
  return (
    <div
      style={{
        display: 'inline-flex',
        border: `1px solid ${RED}`,
        fontFamily: 'Graduate, serif',
        fontSize: 10,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
      }}
    >
      {opts.map((o) => {
        const active = view === o
        return (
          <button
            key={o}
            onClick={() => setView(o)}
            style={{
              background: active ? RED : 'transparent',
              color: active ? '#fff' : RED,
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'background 200ms ease, color 200ms ease',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function GallerySection() {
  const [category, setCategory] = useState(0)
  const [view, setView] = useState<'reel' | 'scatter'>('reel')
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isDesktop = useDesktop()

  const catName = CATEGORIES[category]
  const images = CATEGORY_IMAGES[catName]
  const tagPool = TAG_POOLS[catName]
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
              fontFamily: 'Graduate, serif',
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
                  fontFamily: 'Graduate, serif',
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
                  fontFamily: 'Graduate, serif',
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
                      fontFamily: 'Graduate, serif',
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
                      fontFamily: 'Graduate, serif',
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
                      fontFamily: 'Graduate, serif',
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
                <ViewToggle view={view} setView={setView} />
              </div>

              {/* Body */}
              {view === 'reel' ? (
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
                      tag={tagPool[i % tagPool.length]}
                      category={catName}
                      onClick={() => openAt(i)}
                      desktop
                    />
                  ))}
                </div>
              ) : (
                <ScatterCanvas
                  category={catName}
                  desktop
                  canvasHeight={680}
                  onPick={openAt}
                />
              )}
            </div>
          </div>

          <Ticker
            left="Iron · Sweat · Glory"
            right={`${String(images.length).padStart(3, '0')} Frames · ${CATEGORIES.length} Reels · Walk-ins 24/7`}
          />
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
            fontFamily: 'Graduate, serif',
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
                fontFamily: 'Graduate, serif',
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
              fontFamily: 'Graduate, serif',
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
                    fontFamily: 'Graduate, serif',
                    fontSize: 26,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {catName}.
                </div>
              </div>
              <ViewToggle view={view} setView={setView} />
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

            {view === 'reel' ? (
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
                    tag={tagPool[i % tagPool.length]}
                    category={catName}
                    onClick={() => openAt(i)}
                    desktop={false}
                  />
                ))}
              </div>
            ) : (
              <ScatterCanvas
                category={catName}
                desktop={false}
                canvasHeight={520}
                onPick={openAt}
              />
            )}
          </div>
        </div>

        <MobileTicker left="Iron · Sweat · Glory" right={`${String(images.length).padStart(3, '0')} Frames`} />
      </section>
    </>
  )
}
