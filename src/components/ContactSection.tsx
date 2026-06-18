import { useEffect, useRef } from 'react'

const RED = '#E10A1F'
const GYM_LAT = 7.3400625
const GYM_LNG = 80.6776875
const MAPS_URL = 'https://maps.app.goo.gl/rcHYof6cgEns3dfe7'
const PHONE_DISPLAY = '081 760 1677'
const PHONE_HREF = 'tel:+94817601677'
const PHONE2_DISPLAY = '075 695 3689'
const EMAIL_DISPLAY = 'gloriousfitnessfactory@gmail.com'
const EMAIL_HREF = 'mailto:gloriousfitnessfactory@gmail.com'
const ADDRESS_LINE1 = 'No: 340, Kandy Road'
const ADDRESS_LINE2 = 'Wattegama, Kandy'

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

function LeafletMap({
  className,
  style,
  dark = false,
  staticMap = false,
  targetZoom = 14,
  pulseMarker = false,
}: {
  className?: string
  style?: React.CSSProperties
  dark?: boolean
  staticMap?: boolean
  targetZoom?: number
  pulseMarker?: boolean
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    import('leaflet').then((L) => {
      if (!mapRef.current || instanceRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [GYM_LAT, GYM_LNG],
        zoom: 11,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: !staticMap,
        touchZoom: !staticMap,
        doubleClickZoom: !staticMap,
        keyboard: !staticMap,
        attributionControl: false,
      })

      const tileUrl = dark
        ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      if (dark) {
        // Labels on top in dark mode (so streets stay readable)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map)
      }

      const markerHtml = pulseMarker
        ? `
          <svg width="80" height="80" viewBox="0 0 80 80" style="overflow:visible;">
            <circle cx="40" cy="40" r="6" fill="${RED}"/>
            <circle cx="40" cy="40" r="6" fill="none" stroke="${RED}" stroke-width="2" opacity="0.7">
              <animate attributeName="r" from="6" to="30" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="40" cy="40" r="6" fill="none" stroke="${RED}" stroke-width="2" opacity="0.7">
              <animate attributeName="r" from="6" to="30" dur="2.4s" begin="1.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        `
        : `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
              <path d="M17 1a14 14 0 0 1 14 14c0 9.5-14 26-14 26S3 24.5 3 15A14 14 0 0 1 17 1z" fill="${RED}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <circle cx="17" cy="15" r="5" fill="#fff"/>
            </svg>
          </div>
        `
      const icon = pulseMarker
        ? L.divIcon({ html: markerHtml, className: '', iconSize: [80, 80], iconAnchor: [40, 40] })
        : L.divIcon({ html: markerHtml, className: '', iconSize: [34, 42], iconAnchor: [17, 42] })
      L.marker([GYM_LAT, GYM_LNG], { icon }).addTo(map)

      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)

      instanceRef.current = map

      setTimeout(() => map.invalidateSize(), 50)
      setTimeout(() => map.invalidateSize(), 300)

      const ro = new ResizeObserver(() => map.invalidateSize())
      ro.observe(mapRef.current!)

      let zoomed = false
      const io = new IntersectionObserver(
        (entries) => {
          if (!zoomed && entries[0].isIntersecting) {
            zoomed = true
            map.flyTo([GYM_LAT, GYM_LNG], targetZoom, { duration: 2.2, easeLinearity: 0.18 })
            io.disconnect()
          }
        },
        { threshold: 0.25 }
      )
      io.observe(mapRef.current!)

      const inst = instanceRef.current as unknown as { _ro: ResizeObserver; _io: IntersectionObserver }
      inst._ro = ro
      inst._io = io
    })

    return () => {
      if (instanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inst = instanceRef.current as any
        inst._ro?.disconnect()
        inst._io?.disconnect()
        inst.remove()
        instanceRef.current = null
      }
    }
  }, [dark, staticMap, targetZoom, pulseMarker])

  return <div ref={mapRef} className={className} style={style} />
}

/* ─── Shared data ───────────────────────────────────────────────────── */
type InfoRowData = {
  n: string
  label: string
  value: React.ReactNode
  href: string
  external?: boolean
}

const INFO_ROWS: InfoRowData[] = [
  {
    n: '01',
    label: 'Phone',
    value: (
      <>
        {PHONE_DISPLAY}<br />{PHONE2_DISPLAY}
      </>
    ),
    href: PHONE_HREF,
  },
  { n: '02', label: 'Email', value: EMAIL_DISPLAY, href: EMAIL_HREF },
  {
    n: '03',
    label: 'Address',
    value: (
      <>
        {ADDRESS_LINE1}<br />{ADDRESS_LINE2}, Sri Lanka
      </>
    ),
    href: MAPS_URL,
    external: true,
  },
]

const SOCIALS: { label: string; href: string }[] = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@gloriousfitness?_r=1&_t=ZS-972R32OCFRi' },
  { label: 'Instagram', href: 'https://www.instagram.com/glorious_fitness_center?igsh=MThlNGxjNmV0ZDBxbg==' },
  { label: 'Facebook', href: 'https://www.facebook.com/FITNESSGLORIOUS/' },
]

const RIGHT_PHOTOS: { src: string; label: string }[] = [
  { src: '/gallery/map/photo1.jpeg', label: 'Floor' },
  { src: '/gallery/map/photo2.jpeg', label: 'Strength' },
]

/* ─── Mobile layout ─────────────────────────────────────────────────── */
function MobileContact() {
  return (
    <section
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

      <div
        style={{
          position: 'relative',
          zIndex: 2,
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
        <span>Glorious F.C.</span>
        <span style={{ opacity: 0.85 }}>Wattegama</span>
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 140,
          right: '-14vw',
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(220px, 70vw, 380px)',
          color: 'rgba(225,10,31,0.055)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 0.85,
        }}
      >
        CONTACT
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '56px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
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
            [ 003 / Contact ]
          </div>
        </div>

        <h2
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(60px, 18vw, 88px)',
            lineHeight: 0.86,
            margin: '0 0 0 -2px',
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          Contact
          <br />
          <span style={{ color: RED }}>Us.</span>
        </h2>

        <p
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 15,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.72)',
            margin: '28px 0 0',
          }}
        >
          Walk in. Call. Lift.{' '}
          <span style={{ color: '#fff' }}>The floor never closes.</span>
        </p>

        <div style={{ marginTop: 32 }}>
          {INFO_ROWS.map((row, i) => (
            <a
              key={row.n}
              href={row.href}
              target={row.external ? '_blank' : undefined}
              rel={row.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'grid',
                gridTemplateColumns: '54px 1fr 18px',
                gap: 14,
                padding: '22px 0',
                borderBottom:
                  i < INFO_ROWS.length - 1
                    ? '1px solid rgba(255,255,255,0.07)'
                    : 'none',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 48,
                  lineHeight: 0.82,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                {row.n}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 9,
                    letterSpacing: '0.32em',
                    color: RED,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  / {row.label}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: '#fff',
                    letterSpacing: '0.01em',
                  }}
                >
                  {row.value}
                </div>
              </div>
              <div
                aria-hidden
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.35)',
                  textAlign: 'right',
                  lineHeight: 1,
                }}
              >
                ↗
              </div>
            </a>
          ))}
        </div>

        <a
          href={PHONE_HREF}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 36,
            padding: '18px 22px',
            border: `1px solid ${RED}`,
            background: 'transparent',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'Freshman, serif',
            fontSize: 14,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span>Book a Session</span>
          <span style={{ color: RED, fontSize: 20, lineHeight: 1 }}>→</span>
        </a>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: 22,
            flexWrap: 'wrap',
            paddingBottom: 8,
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 10,
                letterSpacing: '0.32em',
                color: RED,
                textTransform: 'uppercase',
                textDecoration: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              / {s.label}{' '}
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 48,
          borderTop: `1px solid ${RED}`,
          borderBottom: `1px solid ${RED}`,
          height: 320,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <LeafletMap style={{ width: '100%', height: '100%' }} />
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in Maps"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            WebkitTapHighlightColor: 'transparent',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '10px 20px',
            background: 'rgba(10,10,13,0.92)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1001,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 10,
              color: '#fff',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: RED,
                display: 'inline-block',
              }}
            />
            No. 340 Kandy Rd · Wattegama
          </span>
          <span
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 9,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          >
            Open in Google Maps ↗
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
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
        <span>Glorious F.C.</span>
        <span style={{ opacity: 0.85 }}>Iron · Sweat · Glory</span>
      </div>
    </section>
  )
}

/* ─── Map cursor tooltip (desktop) ──────────────────────────────────── */
function MapCursorTooltip({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const tipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current
    const tip = tipRef.current
    if (!target || !tip) return

    let raf = 0
    let x = 0
    let y = 0
    let cx = 0
    let cy = 0
    let active = false

    const render = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      tip.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) {
        raf = requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect()
      x = e.clientX - rect.left
      y = e.clientY - rect.top
      if (!active) {
        active = true
        cx = x
        cy = y
        tip.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
        tip.style.opacity = '1'
        tip.style.scale = '1'
      }
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onLeave = () => {
      active = false
      tip.style.opacity = '0'
      tip.style.scale = '0.85'
    }

    target.addEventListener('mousemove', onMove)
    target.addEventListener('mouseleave', onLeave)
    return () => {
      target.removeEventListener('mousemove', onMove)
      target.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [targetRef])

  return (
    <div
      ref={tipRef}
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20,
        pointerEvents: 'none',
        opacity: 0,
        scale: '0.85',
        transition: 'opacity 0.22s ease, scale 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        transformOrigin: '0 0',
        willChange: 'transform, opacity',
        marginLeft: 22,
        marginTop: 22,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'rgba(10,10,13,0.92)',
          border: `1px solid ${RED}`,
          padding: '10px 14px 10px 16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(225,10,31,0.15)',
          backdropFilter: 'blur(6px)',
        }}
      >
        {/* corner ticks */}
        <span style={{ position: 'absolute', top: -1, left: -1, width: 6, height: 6, borderTop: `1px solid ${RED}`, borderLeft: `1px solid ${RED}` }} />
        <span style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderTop: `1px solid ${RED}`, borderRight: `1px solid ${RED}` }} />
        <span style={{ position: 'absolute', bottom: -1, left: -1, width: 6, height: 6, borderBottom: `1px solid ${RED}`, borderLeft: `1px solid ${RED}` }} />
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, borderBottom: `1px solid ${RED}`, borderRight: `1px solid ${RED}` }} />

        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: RED,
            boxShadow: `0 0 8px ${RED}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 10,
            letterSpacing: '0.32em',
            color: '#fff',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          Open in Google Maps
        </span>
        <span
          style={{
            color: RED,
            fontSize: 13,
            lineHeight: 1,
            fontFamily: 'Freshman, serif',
          }}
        >
          ↗
        </span>
      </div>
      <div
        style={{
          marginTop: 6,
          marginLeft: 2,
          fontFamily: 'Inter, system-ui',
          fontSize: 8.5,
          letterSpacing: '0.32em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
        }}
      >
        7.34°N · 80.68°E
      </div>
    </div>
  )
}

/* ─── Tablet / Desktop layout ───────────────────────────────────────── */
function DesktopContact() {
  const mapAreaRef = useRef<HTMLDivElement>(null)
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 680,
        overflow: 'hidden',
        background: '#0a0a0d',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hover styles for desktop info rows */}
      <style>{`
        .gfc-row { transition: background 0.2s ease; }
        .gfc-row:hover { background: rgba(225,10,31,0.06); }
        .gfc-row:hover .gfc-arrow { color: ${RED}; transform: translateX(3px); }
        .gfc-arrow { transition: color 0.2s ease, transform 0.2s ease; }
        .gfc-social { transition: color 0.2s ease, letter-spacing 0.2s ease; }
        .gfc-social:hover { color: #fff; }
        .gfc-cta { transition: background 0.2s ease, color 0.2s ease; }
        .gfc-cta:hover { background: ${RED}; }
        .gfc-cta:hover .gfc-cta-arrow { color: #fff; }
      `}</style>

      {/* Grain overlay */}
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

      {/* Top ticker */}
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
        <span>Glorious Fitness Factory · Wattegama</span>
        <span style={{ opacity: 0.85 }}>Walk-ins Welcome</span>
      </div>

      {/* Main row */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>

        {/* ── Left panel ── */}
        <div
          style={{
            width: 'clamp(380px, 32vw, 460px)',
            position: 'relative',
            zIndex: 10,
            background: '#0a0a0d',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(40px, 4vh, 64px) clamp(36px, 3vw, 52px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{ width: 32, height: 1, background: RED }} />
            <div
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 10,
                letterSpacing: '0.28em',
                color: RED,
                textTransform: 'uppercase',
              }}
            >
              [ 003 / Contact ]
            </div>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(48px, 4.6vw, 72px)',
              lineHeight: 0.9,
              margin: '0 0 0 -2px',
              letterSpacing: '-0.02em',
              color: '#fff',
            }}
          >
            Contact
            <br />
            <span style={{ color: RED }}>Us.</span>
          </h2>

          {/* Lede */}
          <p
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 14,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.72)',
              margin: '24px 0 0',
              maxWidth: 360,
            }}
          >
            Walk in. Call. Lift.{' '}
            <span style={{ color: '#fff' }}>The floor never closes.</span>
          </p>

          {/* Info rows */}
          <div>
            {INFO_ROWS.map((row, i) => (
              <a
                key={row.n}
                className="gfc-row"
                href={row.href}
                target={row.external ? '_blank' : undefined}
                rel={row.external ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr 20px',
                  gap: 14,
                  padding: '18px 8px 18px 0',
                  borderBottom:
                    i < INFO_ROWS.length - 1
                      ? '1px solid rgba(255,255,255,0.07)'
                      : 'none',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Freshman, serif',
                    fontSize: 42,
                    lineHeight: 0.82,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {row.n}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 9,
                      letterSpacing: '0.32em',
                      color: RED,
                      textTransform: 'uppercase',
                      marginBottom: 5,
                    }}
                  >
                    / {row.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.35,
                      color: '#fff',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {row.value}
                  </div>
                </div>
                <div
                  className="gfc-arrow"
                  aria-hidden
                  style={{
                    fontFamily: 'Freshman, serif',
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.35)',
                    textAlign: 'right',
                    lineHeight: 1,
                  }}
                >
                  ↗
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href={PHONE_HREF}
            className="gfc-cta"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 22px',
              border: `1px solid ${RED}`,
              background: 'transparent',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'Freshman, serif',
              fontSize: 13,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              marginTop: 24,
            }}
          >
            <span>Book a Session</span>
            <span className="gfc-cta-arrow" style={{ color: RED, fontSize: 20, lineHeight: 1 }}>→</span>
          </a>

          {/* Socials — glued under CTA, no top border */}
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gfc-social"
                style={{
                  fontFamily: 'Inter, system-ui',
                  fontSize: 10,
                  letterSpacing: '0.32em',
                  color: RED,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                / {s.label}{' '}
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Map area ── */}
        <div ref={mapAreaRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0d', cursor: 'none' }}>
          <MapCursorTooltip targetRef={mapAreaRef} />
          <LeafletMap
            pulseMarker
            staticMap
            targetZoom={15}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
          />

          {/* Tappable overlay -> external maps */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Maps"
            style={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'none' }}
          />

          {/* Crosshair lines through marker — decorative */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(225,10,31,0.18) 40%, rgba(225,10,31,0.18) 60%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(to right, transparent 0%, rgba(225,10,31,0.18) 40%, rgba(225,10,31,0.18) 60%, transparent 100%)',
              }}
            />
          </div>

          {/* Right-edge photo strip — bleeds slightly off edge */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(60px, 8vh, 110px)',
              right: 'clamp(20px, 2.4vw, 36px)',
              zIndex: 7,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              width: 'clamp(124px, 11vw, 168px)',
            }}
          >
            {RIGHT_PHOTOS.map((p) => (
              <a
                key={p.src}
                href="#gallery"
                style={{
                  position: 'relative',
                  display: 'block',
                  aspectRatio: '4 / 5',
                  border: `1px solid ${RED}`,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
                  background: '#0a0a0d',
                }}
              >
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </a>
            ))}
          </div>

          {/* Bottom-right coord strip — flat, no blur */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: '12px 24px',
              background: '#0a0a0d',
              borderTop: `1px solid ${RED}`,
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              zIndex: 6,
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 11,
                color: '#fff',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 999, background: RED }} />
              No. 340 Kandy Rd · Wattegama
            </span>
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.18)' }} />
            <span
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 9.5,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              Open in Maps ↗
            </span>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
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
        <span>Iron · Sweat · Glory</span>
        <span style={{ opacity: 0.85 }}>{PHONE_DISPLAY} · {PHONE2_DISPLAY} · {EMAIL_DISPLAY}</span>
      </div>
    </section>
  )
}

/* ─── Responsive switcher ───────────────────────────────────────────── */
export default function ContactSection() {
  return (
    <div id="contact">
      <div className="block md:hidden">
        <MobileContact />
      </div>
      <div className="hidden md:block breakout-full">
        <DesktopContact />
      </div>
    </div>
  )
}
