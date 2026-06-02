import { useEffect, useMemo, useRef, useState } from 'react'

const RED = '#E10A1F'
const CATEGORIES = ['Gym', 'Competition', 'Transformation'] as const

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

const CATEGORY_IMAGES: Record<string, string[]> = {
  Gym: GYM_IMAGES,
  Competition: GYM_IMAGES,
  Transformation: GYM_IMAGES,
}

const PALETTES: Record<string, Array<[string, string]>> = {
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
    ['#1a1a1d', '#0a0a0c'],
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

type Item = {
  id: string
  x: number
  y: number
  w: number
  h: number
  rotation: number
  grad: [string, string]
  imgSrc?: string
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
  desktop = false,
  images: string[] = []
): Item[] {
  const rand = makeRand(seed)
  const cols = desktop ? 7 : 5
  const rows = desktop ? 5 : 5
  const count = desktop ? 30 : 21
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
    const rotation = (rand() - 0.5) * 8
    const colorIdx = Math.floor(rand() * palette.length)
    return {
      id: `${seed}-${i}`,
      x: (c - cCenter) * colStep + jx,
      y: (r - rCenter) * rowStep + jy,
      w: baseW,
      h: baseH,
      rotation,
      grad: palette[colorIdx],
      imgSrc: images.length > 0 ? images[i % images.length] : undefined,
    }
  })
}

function distanceScale(distance: number, desktop = false) {
  const FOCUS_RADIUS = desktop ? 380 : 280
  const t = Math.min(1, distance / FOCUS_RADIUS)
  const eased = t * t * (3 - 2 * t)
  return (desktop ? 2.4 : 2.2) - (desktop ? 1.85 : 1.65) * eased
}

function GalleryImage({
  grad,
  rotation,
  w,
  h,
  imgSrc,
}: {
  grad: [string, string]
  rotation: number
  w: number
  h: number
  imgSrc?: string
}) {
  const [c1, c2] = grad
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: w,
        height: h,
        borderRadius: 14,
        background: `linear-gradient(${(135 + rotation * 4) | 0}deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: '0 6px 20px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset',
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 14,
            userSelect: 'none',
          }}
        />
      )}
      {/* subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.22) 100%)',
          borderRadius: 14,
        }}
      />
    </div>
  )
}

function CategoryBar({
  active,
  onChange,
  desktop,
}: {
  active: number
  onChange: (i: number) => void
  desktop?: boolean
}) {
  return (
    <div style={{ width: desktop ? '100%' : undefined }}>
      <div
        className="relative flex"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999,
          padding: 4,
          height: desktop ? 48 : 44,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: 4,
            width: `calc((100% - 8px) / 3)`,
            background: RED,
            borderRadius: 999,
            transform: `translateX(${active * 100}%)`,
            transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 4px 14px rgba(225,10,31,0.35)',
          }}
        />
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => onChange(i)}
            className="relative flex-1 bg-transparent border-0 cursor-pointer p-0"
            style={{
              zIndex: 1,
              color: '#fff',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: desktop ? 11.5 : 10.5,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'lbFadeIn 180ms ease forwards',
        cursor: 'zoom-out',
      }}
    >
      <style>{`
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lbScaleIn { from { transform: scale(0.93) } to { transform: scale(1) } }
      `}</style>
      <img
        src={src}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '92vw',
          maxHeight: '92vh',
          objectFit: 'contain',
          borderRadius: 12,
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          animation: 'lbScaleIn 200ms cubic-bezier(0.22,1,0.36,1) forwards',
          cursor: 'default',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          color: '#fff',
          width: 40,
          height: 40,
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(6px)',
        }}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}

function GalleryCanvas({
  category,
  desktop,
  canvasHeight,
  onImageClick,
}: {
  category: number
  desktop: boolean
  canvasHeight: number
  onImageClick: (src: string) => void
}) {
  const layouts = useMemo(
    () => CATEGORIES.map((c, i) => generateLayout(7 + i * 31, PALETTES[c], desktop, CATEGORY_IMAGES[c])),
    [desktop]
  )
  const items = layouts[category]

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 })
  const hasDraggedRef = useRef(false)
  const downTargetRef = useRef<HTMLElement | null>(null)
  const lastMove = useRef({ x: 0, y: 0, t: 0 })
  const rafRef = useRef(0)
  const prevCategoryRef = useRef(category)

  useEffect(() => {
    if (prevCategoryRef.current !== category) {
      prevCategoryRef.current = category
      cancelAnimationFrame(rafRef.current)
      velRef.current = { x: 0, y: 0 }
      panRef.current = { x: 0, y: 0 }
      setPan({ x: 0, y: 0 })
    }
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
      const card = downTargetRef.current.closest('[data-img-src]') as HTMLElement | null
      const src = card?.dataset.imgSrc
      if (src) onImageClick(src)
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
      className="relative overflow-hidden select-none"
      style={{
        height: canvasHeight,
        width: '100%',
        touchAction: 'none',
        cursor: dragRef.current.active ? 'grabbing' : 'grab',
        WebkitUserSelect: 'none',
        borderRadius: desktop ? 24 : 18,
        border: '1px solid rgba(255,255,255,0.06)',
        background:
          'radial-gradient(80% 50% at 50% 50%, rgba(225,10,31,0.04) 0%, rgba(0,0,0,0) 70%), #0a0a0c',
      }}
    >
      <div className="absolute inset-0">
        {items.map((it) => {
          const ex = it.x + pan.x
          const ey = it.y + pan.y
          const dist = Math.hypot(ex, ey)
          const scale = distanceScale(dist, desktop)
          const distOpacity = Math.max(0.45, 1 - (dist - 200) / 800)
          return (
            <div
              key={it.id}
              className="absolute"
              data-img-src={it.imgSrc ?? ''}
              style={{
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
                opacity: distOpacity,
                zIndex: Math.round(1000 - dist),
              }}
            >
              <GalleryImage grad={it.grad} rotation={it.rotation} w={it.w} h={it.h} imgSrc={it.imgSrc} />
            </div>
          )
        })}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, rgba(13,13,16,0) 55%, rgba(13,13,16,0.75) 100%)',
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 999,
          background: 'rgba(13,13,16,0.5)',
          backdropFilter: 'blur(6px)',
        }}
      >
        Drag to explore
      </div>
    </div>
  )
}

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

const CATEGORY_COUNTS = { Gym: 30, Competition: 30, Transformation: 30 }
const CATEGORY_DESCS: Record<string, string> = {
  Gym: 'Inside the training floor — equipment, atmosphere, and the daily grind.',
  Competition: 'On the platform, under the lights. Our athletes compete.',
  Transformation: 'Before, during, and after. Real results, real people.',
}

export default function GallerySection() {
  const [category, setCategory] = useState(0)
  const [renderKey, setRenderKey] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const isDesktop = useDesktop()

  const onChangeCategory = (i: number) => {
    if (i === category) return
    setPhase('out')
    setTimeout(() => {
      setCategory(i)
      setRenderKey((k) => k + 1)
      setPhase('in')
      setTimeout(() => setPhase('idle'), 260)
    }, 250)
  }

  const canvasOpacity = phase === 'out' ? 0 : 1
  const catName = CATEGORIES[category]

  if (isDesktop) {
    return (
      <>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      <section
        id="gallery"
        className="breakout-full"
        style={{
          background: '#0d0d10',
          color: '#fff',
          padding: '80px 64px 80px',
          display: 'flex',
          gap: 56,
          alignItems: 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        {/* Left info panel */}
        <div
          style={{
            flexShrink: 0,
            width: 320,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 11,
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            Inside the floor · 2026
          </div>

          <h2
            style={{
              fontFamily: 'Graduate, serif',
              fontSize: 72,
              lineHeight: 0.9,
              margin: '0 0 32px',
              letterSpacing: '-0.01em',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Gall<span style={{ color: RED }}>e</span>ry
          </h2>

          {/* Thin red rule */}
          <div
            style={{
              width: 40,
              height: 2,
              background: RED,
              marginBottom: 28,
              borderRadius: 1,
            }}
          />

          <CategoryBar active={category} onChange={onChangeCategory} desktop />

          {/* Category meta */}
          <div
            style={{
              marginTop: 28,
              transition: 'opacity 250ms ease',
              opacity: canvasOpacity,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              {catName}
            </div>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 13.5,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
              }}
            >
              {CATEGORY_DESCS[catName]}
            </p>

            <div
              style={{
                marginTop: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: 'Graduate, serif',
                  fontSize: 36,
                  color: RED,
                  lineHeight: 1,
                }}
              >
                {CATEGORY_COUNTS[catName]}
              </span>
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                }}
              >
                Photos
              </span>
            </div>
          </div>

          {/* Bottom corner label */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 48,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
            }}
          >
            Glorious Fitness Center
          </div>
        </div>

        {/* Right canvas — fills remaining width */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            opacity: canvasOpacity,
            transition: 'opacity 250ms ease-out',
          }}
        >
          <GalleryCanvas
            key={renderKey}
            category={category}
            desktop={true}
            canvasHeight={680}
            onImageClick={setLightboxSrc}
          />
        </div>
      </section>
      </>
    )
  }

  // Mobile layout
  return (
    <>
    {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    <section
      id="gallery"
      style={{ background: '#0d0d10', color: '#fff', padding: '64px 24px 56px' }}
    >
      <div
        style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 12,
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Inside the floor · 2026
      </div>
      <h2
        style={{
          fontFamily: 'Graduate, serif',
          fontSize: 44,
          lineHeight: 0.95,
          margin: '0 0 24px',
          letterSpacing: '0.01em',
          color: '#fff',
        }}
      >
        Gall<span style={{ color: RED }}>e</span>ry
      </h2>

      <CategoryBar active={category} onChange={onChangeCategory} />

      <div
        className="relative"
        style={{
          marginTop: 18,
          opacity: canvasOpacity,
          transition: 'opacity 250ms ease-out',
        }}
      >
        <GalleryCanvas key={renderKey} category={category} desktop={false} canvasHeight={520} onImageClick={setLightboxSrc} />
      </div>
    </section>
    </>
  )
}
