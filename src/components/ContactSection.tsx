import { useEffect, useRef } from 'react'

const RED = '#E10A1F'
const GYM_LAT = 7.2906
const GYM_LNG = 80.6337

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
        stroke={RED}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={RED} strokeWidth="1.5" />
      <path d="M4 7l8 6 8-6" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
        stroke={RED}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" stroke={RED} strokeWidth="1.5" />
    </svg>
  )
}
function TikTokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3c.5 2.5 2.5 4.5 5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1" fill="#fff" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14 8h2.5V4.5H14c-2 0-3.5 1.5-3.5 3.5v2H8v3.5h2.5V21H14v-7.5h2.5L17 10h-3V8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 18, padding: '4px 0' }}>
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(225,10,31,0.08)', border: '1px solid rgba(225,10,31,0.18)' }}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0" style={{ gap: 3 }}>
        <div style={{ fontFamily: 'Graduate, serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.22em', lineHeight: 1, textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'Inter, system-ui', fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.3, letterSpacing: '0.01em' }}>
          {value}
        </div>
      </div>
    </div>
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button aria-label={label} className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-0" style={{ width: 46, height: 46, WebkitTapHighlightColor: 'transparent' }}>
      {icon}
    </button>
  )
}

function LeafletMap({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    import('leaflet').then((L) => {
      if (!mapRef.current || instanceRef.current) return

      // Fix default icon paths broken by bundlers
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
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // Custom red marker
      const markerHtml = `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
            <path d="M17 1a14 14 0 0 1 14 14c0 9.5-14 26-14 26S3 24.5 3 15A14 14 0 0 1 17 1z" fill="${RED}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
            <circle cx="17" cy="15" r="5" fill="#fff"/>
          </svg>
        </div>
      `
      const icon = L.divIcon({ html: markerHtml, className: '', iconSize: [34, 42], iconAnchor: [17, 42] })
      L.marker([GYM_LAT, GYM_LNG], { icon }).addTo(map)

      // Attribution small
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)

      instanceRef.current = map

      // Force tile fill after CSS layout settles
      setTimeout(() => map.invalidateSize(), 50)
      setTimeout(() => map.invalidateSize(), 300)

      // Invalidate on container resize (handles breakout CSS applying late)
      const ro = new ResizeObserver(() => map.invalidateSize())
      ro.observe(mapRef.current!)

      // Zoom in when section scrolls into view — one-shot
      let zoomed = false
      const io = new IntersectionObserver(
        (entries) => {
          if (!zoomed && entries[0].isIntersecting) {
            zoomed = true
            map.flyTo([GYM_LAT, GYM_LNG], 14, { duration: 2.2, easeLinearity: 0.18 })
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
  }, [])

  return <div ref={mapRef} className={className} style={style} />
}

// Shared contact card content
function ContactCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 14 : 20,
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 11,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Get in touch
        </div>
        <h2
          style={{
            fontFamily: 'Graduate, serif',
            fontSize: compact ? 32 : 44,
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: '0.01em',
            color: '#fff',
          }}
        >
          Contact<br />
          <span style={{ color: RED }}>Us.</span>
        </h2>
      </div>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 14 }}>
        <InfoRow icon={<PhoneIcon />} label="Phone" value="+44 20 7946 0820" />
        <InfoRow icon={<MailIcon />} label="Email" value="hello@glorious.fit" />
        <InfoRow
          icon={<PinIcon />}
          label="Address"
          value={<>14 Dalada Veediya<br />Kandy 20000</>}
        />
      </div>

      {/* Socials */}
      <div
        className="flex items-center"
        style={{
          paddingTop: compact ? 10 : 18,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          justifyContent: 'space-around',
        }}
      >
        <SocialButton icon={<TikTokIcon />} label="TikTok" />
        <SocialButton icon={<InstagramIcon />} label="Instagram" />
        <SocialButton icon={<FacebookIcon />} label="Facebook" />
      </div>
    </div>
  )
}

/* ─── Mobile layout ─────────────────────────────────────────────────── */
function MobileContact() {
  return (
    <section id="contact" style={{ background: '#0d0d10', color: '#fff', padding: '64px 24px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Inter, system-ui', fontSize: 12, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 12 }}>
          Get in touch
        </div>
        <h2 style={{ fontFamily: 'Graduate, serif', fontSize: 44, lineHeight: 0.95, margin: '0 0 24px', letterSpacing: '0.01em', color: '#fff' }}>
          Contact<br /><span style={{ color: RED }}>Us.</span>
        </h2>
      </div>

      <div style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '26px 22px 22px', boxShadow: '0 18px 40px -20px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <InfoRow icon={<PhoneIcon />} label="Phone" value="+44 20 7946 0820" />
        <InfoRow icon={<MailIcon />} label="Email" value="hello@glorious.fit" />
        <InfoRow icon={<PinIcon />} label="Address" value={<>14 Forge Lane<br />London E2 8AA</>} />
        <div className="flex items-center" style={{ marginTop: 8, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)', justifyContent: 'space-around' }}>
          <SocialButton icon={<TikTokIcon />} label="TikTok" />
          <SocialButton icon={<InstagramIcon />} label="Instagram" />
          <SocialButton icon={<FacebookIcon />} label="Facebook" />
        </div>
      </div>

      {/* Map */}
      <div style={{ marginTop: 18, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', height: 300, position: 'relative' }}>
        <LeafletMap style={{ width: '100%', height: '100%' }} />
        {/* Location badge */}
        <div
          className="absolute flex items-center"
          style={{ left: 14, bottom: 14, padding: '8px 12px', borderRadius: 10, background: 'rgba(13,13,16,0.82)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', gap: 8, zIndex: 1000, pointerEvents: 'none' }}
        >
          <div style={{ width: 6, height: 6, borderRadius: 999, background: RED }} />
          <div style={{ fontFamily: 'Graduate, serif', fontSize: 10, color: '#fff', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Kandy
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Desktop-only white icon variants ─────────────────────────────── */
function PhoneIconW() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
function MailIconW() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PinIconW() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

/* ─── Tablet / Desktop layout ───────────────────────────────────────── */
function DesktopContact() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: '#0d0d10',
        color: '#fff',
      }}
    >
      {/* Full-bleed Leaflet map */}
      <LeafletMap
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Left edge fade — blends map into card zone */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(13,13,16,0.45) 0%, transparent 42%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── RED CARD ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 'clamp(40px, 5vw, 80px)',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: 'clamp(290px, 26vw, 350px)',
          borderRadius: 18,
          overflow: 'hidden',
          background: 'rgba(13,13,16,0.45)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Card content */}
        <div style={{ position: 'relative', padding: '30px 26px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 9,
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.65)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Get in touch
            </div>
            <h2
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 34,
                lineHeight: 0.95,
                margin: 0,
                letterSpacing: '0.01em',
                color: '#fff',
                textShadow: '0 2px 12px rgba(0,0,0,0.25)',
              }}
            >
              Contact<br />
              <span style={{ opacity: 0.88 }}>Us.</span>
            </h2>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', marginBottom: 18 }} />

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(
              [
                { icon: <PhoneIconW />, label: 'Phone', value: '+44 20 7946 0820' },
                { icon: <MailIconW />, label: 'Email', value: 'hello@glorious.fit' },
                { icon: <PinIconW />, label: 'Address', value: <span>14 Dalada Veediya<br />Kandy 20000</span> },
              ] as { icon: React.ReactNode; label: string; value: React.ReactNode }[]
            ).map(({ icon, label, value }) => (
              <div key={label} className="flex items-center" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(0,0,0,0.22)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div
                    style={{
                      fontFamily: 'Graduate, serif',
                      fontSize: 8.5,
                      color: 'rgba(255,255,255,0.6)',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#fff',
                      lineHeight: 1.35,
                      letterSpacing: '0.01em',
                      textShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '18px 0 14px' }} />

          {/* Social buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {([
              { icon: <TikTokIcon />, label: 'TikTok' },
              { icon: <InstagramIcon />, label: 'Instagram' },
              { icon: <FacebookIcon />, label: 'Facebook' },
            ] as { icon: React.ReactNode; label: string }[]).map(({ icon, label }) => (
              <button
                key={label}
                aria-label={label}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.22)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location badge bottom-right */}
      <div
        className="absolute flex items-center"
        style={{
          right: 24,
          bottom: 24,
          padding: '10px 16px',
          borderRadius: 12,
          background: 'rgba(13,13,16,0.82)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          gap: 10,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: 999, background: RED }} />
        <div style={{ fontFamily: 'Graduate, serif', fontSize: 11, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          14 Dalada Veediya · Kandy
        </div>
      </div>
    </section>
  )
}

/* ─── Responsive switcher ───────────────────────────────────────────── */
export default function ContactSection() {
  return (
    <>
      {/* Mobile: shown when parent shell is ≤ 430px (mobile-shell) */}
      <div className="block md:hidden">
        <MobileContact />
      </div>
      {/* Tablet / Desktop — breaks out of mobile-shell to fill viewport */}
      <div className="hidden md:block breakout-full">
        <DesktopContact />
      </div>
    </>
  )
}
