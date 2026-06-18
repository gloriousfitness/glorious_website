import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const PHOTO = '/coach-rahul.webp'
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace"

const COACH = {
  name: 'RAHUL',
  title: 'Bodybuilding',
  years: '07',
  bio: 'National-level bodybuilder turned coach. Builds champions from raw iron.',
  cred: 'NATIONAL',
}

const STATS: { k: string; v: string }[] = [
  { k: 'IRON', v: 'Raw lifts' },
  { k: 'PREP', v: 'Stage peak' },
]

type Achievement = { year: string; title: string; place: string; podium?: boolean; mark?: boolean }

const ACHIEVEMENTS: Achievement[] = [
  { year: '2023', title: 'Mr Kandy · Under 21', place: 'RUNNER-UP', podium: true, mark: true },
]

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVis(true)
            io.disconnect()
          }
        })
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, vis }
}

function useInViewVideo() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    const sec = sectionRef.current
    const vid = videoRef.current
    if (!sec || !vid) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) vid.play().catch(() => {})
          else vid.pause()
        })
      },
      { threshold: 0.1 }
    )
    io.observe(sec)
    return () => io.disconnect()
  }, [])
  return { sectionRef, videoRef }
}

/* ────────────────────── DESKTOP ────────────────────── */

function DesktopCoach() {
  const { sectionRef } = useInViewVideo()
  const copyR = useReveal<HTMLDivElement>(0.22)
  const photoR = useReveal<HTMLDivElement>(0.22)

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'transparent',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      {/* blur + dim layer over video showing through */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(18px) brightness(0.55) grayscale(0.6)',
          WebkitBackdropFilter: 'blur(18px) brightness(0.55) grayscale(0.6)',
          background:
            'radial-gradient(ellipse at 75% 50%, rgba(225,10,31,0.10) 0%, rgba(10,10,13,0) 55%), linear-gradient(180deg, rgba(10,10,13,0.40) 0%, rgba(10,10,13,0.60) 100%)',
          zIndex: 0,
        }}
      />
      {/* grain */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.28,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: GRAIN_BG,
        }}
      />

      {/* ticker */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: RED,
          color: '#fff',
          fontFamily: 'Freshman, serif',
          fontSize: 11,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          padding: '10px 64px 10px 320px',
          height: 40,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>§ 04 — On the Floor</span>
        <span style={{ opacity: 0.85 }}>One Coach · No Roster</span>
        <span>Walk on</span>
      </div>

      {/* watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -40,
          right: -20,
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(160px, 18vw, 280px)',
          color: 'rgba(225,10,31,0.025)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 0.85,
        }}
      >
        COACH
      </div>

      {/* MAIN compact band */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: 'clamp(48px, 5.5vw, 96px)',
          padding: 'clamp(72px, 7vw, 112px) clamp(64px, 6vw, 112px) clamp(56px, 5vw, 80px)',
          alignItems: 'start',
          maxWidth: 1480,
          margin: '0 auto',
          minHeight: 'calc(70vh - 40px)',
          boxSizing: 'border-box',
        }}
      >
        {/* photo cutout */}
        <div
          ref={photoR.ref}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            opacity: photoR.vis ? 1 : 0,
            transform: photoR.vis ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
            transition: 'opacity 900ms cubic-bezier(.2,.7,.2,1), transform 1100ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          {/* red plate — offset down+right of photo */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '14px -14px -14px 14px',
              background: RED,
              zIndex: 0,
            }}
          />
          <img
            src={PHOTO}
            alt="Coach Rahul"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 22%',
              display: 'block',
              filter: 'contrast(1.08) saturate(0.78) brightness(0.94)',
            }}
          />
          {/* tag */}
          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              left: 12,
              bottom: 12,
              fontFamily: MONO,
              fontSize: 9.5,
              letterSpacing: '0.3em',
              color: '#fff',
              background: 'rgba(10,10,13,0.78)',
              padding: '6px 10px',
              fontWeight: 700,
            }}
          >
            ● SUBJ_01 / RAHUL
          </div>
        </div>

        {/* type */}
        <div ref={copyR.ref}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 600ms, transform 600ms',
            }}
          >
            <span style={{ width: 32, height: 1, background: RED }} />
            <span
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 11,
                letterSpacing: '0.32em',
                color: RED,
                textTransform: 'uppercase',
              }}
            >
              [ 004 / Coach ]
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(72px, 8.4vw, 140px)',
              lineHeight: 0.86,
              margin: 0,
              letterSpacing: '-0.01em',
              color: '#fff',
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 800ms 80ms, transform 800ms 80ms cubic-bezier(.2,.7,.2,1)',
            }}
          >
            {COACH.name}
            <span style={{ color: RED }}>.</span>
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 18,
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.14)',
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.62)',
              fontWeight: 700,
              opacity: copyR.vis ? 1 : 0,
              transition: 'opacity 700ms 220ms',
            }}
          >
            <span style={{ color: '#fff' }}>{COACH.title.toUpperCase()}</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span>{COACH.years} YRS</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ color: RED }}>{COACH.cred}</span>
          </div>

          <p
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 16,
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.82)',
              margin: '22px 0 0',
              maxWidth: 460,
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 800ms 300ms, transform 800ms 300ms',
            }}
          >
            {COACH.bio}
          </p>

          {/* ACHIEVEMENT LEDGER */}
          <div
            style={{
              marginTop: 32,
              maxWidth: 560,
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 800ms 380ms, transform 800ms 380ms',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span style={{ width: 20, height: 1, background: RED }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9.5,
                  letterSpacing: '0.32em',
                  color: RED,
                  fontWeight: 700,
                }}
              >
                / LOG · STAGE RECORD — SINCE 2019
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 700,
                }}
              >
                {String(ACHIEVEMENTS.length).padStart(2, '0')} ENTRIES
              </span>
            </div>

            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {ACHIEVEMENTS.map((a, i) => (
                <li
                  key={a.year}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '54px 1fr auto',
                    gap: 14,
                    alignItems: 'baseline',
                    padding: '10px 0 10px 12px',
                    borderTop:
                      i === 0 ? '1px solid rgba(255,255,255,0.18)' : '1px dashed rgba(255,255,255,0.10)',
                    borderLeft: a.mark ? `2px solid ${RED}` : '2px solid transparent',
                    background: a.mark ? 'rgba(225,10,31,0.06)' : 'transparent',
                    fontFamily: MONO,
                    fontWeight: 700,
                    opacity: copyR.vis ? 1 : 0,
                    transform: copyR.vis ? 'translateY(0)' : 'translateY(6px)',
                    transition: `opacity 600ms ${420 + i * 60}ms ease, transform 600ms ${420 + i * 60}ms ease`,
                  }}
                >
                  <span
                    style={{
                      color: a.mark ? RED : 'rgba(255,255,255,0.92)',
                      fontSize: 11,
                      letterSpacing: '0.16em',
                    }}
                  >
                    {a.year}
                  </span>
                  <span
                    style={{
                      color: a.mark ? '#fff' : 'rgba(255,255,255,0.82)',
                      fontSize: 11.5,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.title}
                  </span>
                  <span
                    style={{
                      color: a.podium ? RED : 'rgba(255,255,255,0.45)',
                      fontSize: 10,
                      letterSpacing: '0.26em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.podium ? '●' : '○'} {a.place}
                  </span>
                </li>
              ))}
              <li
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.18)',
                  marginTop: 0,
                  paddingTop: 10,
                  paddingLeft: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700,
                  opacity: copyR.vis ? 1 : 0,
                  transition: `opacity 600ms ${420 + ACHIEVEMENTS.length * 60}ms ease`,
                }}
              >
                <span>● PODIUM · ○ FINALIST</span>
                <span style={{ color: RED }}>STILL COMPETING</span>
              </li>
            </ol>
          </div>

          {/* stat pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10,
              marginTop: 28,
              maxWidth: 560,
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 800ms 720ms, transform 800ms 720ms',
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.k}
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(10,10,13,0.45)',
                  backdropFilter: 'blur(6px)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontFamily: MONO,
                  fontWeight: 700,
                  minWidth: 0,
                }}
              >
                <span style={{ color: RED, fontSize: 9.5, letterSpacing: '0.28em' }}>
                  / {s.k}
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.86)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.v}
                </span>
              </div>
            ))}
          </div>

          {/* sign-off */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 14,
              borderTop: `1px solid ${RED}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 700,
              opacity: copyR.vis ? 1 : 0,
              transition: 'opacity 800ms 540ms',
            }}
          >
            <span>FIND HIM UNDER THE SQUAT RACK</span>
            <span style={{ color: RED }}>● ON DUTY</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────── MOBILE ────────────────────── */

function MobileCoach() {
  const { sectionRef } = useInViewVideo()
  const copyR = useReveal<HTMLDivElement>(0.18)
  const photoR = useReveal<HTMLDivElement>()

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'transparent',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      {/* blur + dim layer over video showing through */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(14px) brightness(0.55) grayscale(0.6)',
          WebkitBackdropFilter: 'blur(14px) brightness(0.55) grayscale(0.6)',
          background:
            'linear-gradient(180deg, rgba(10,10,13,0.45) 0%, rgba(10,10,13,0.65) 100%)',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.28,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: GRAIN_BG,
        }}
      />

      {/* ticker */}
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
          justifyContent: 'space-between',
        }}
      >
        <span>§ 04 — Coach</span>
        <span style={{ opacity: 0.85 }}>One on the Floor</span>
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -20,
          right: '-12vw',
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(140px, 48vw, 240px)',
          color: 'rgba(225,10,31,0.06)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 0.85,
        }}
      >
        COACH
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '40px 22px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* photo — full-bleed */}
        <div
          ref={photoR.ref}
          style={{
            position: 'relative',
            width: '80vw',
            marginLeft: 'calc(-22px + 10vw)',
            aspectRatio: '4 / 5',
            alignSelf: 'flex-start',
            opacity: photoR.vis ? 1 : 0,
            transform: photoR.vis ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 900ms, transform 1100ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <img
            src={PHOTO}
            alt="Coach Rahul"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 22%',
              display: 'block',
              filter: 'contrast(1.08) saturate(0.78) brightness(0.94)',
            }}
          />
        </div>

        {/* eyebrow — sits above name, overlaps photo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '88vw',
            marginLeft: 'calc(-22px + 6vw)',
            marginTop: 'calc(-0.45 * 22vw - 32px)',
            position: 'relative',
            zIndex: 3,
            opacity: photoR.vis ? 1 : 0,
            transition: 'opacity 700ms 60ms ease',
          }}
        >
          <span style={{ width: 24, height: 1, background: RED }} />
          <span
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: RED,
              textTransform: 'uppercase',
              textShadow: '0 4px 18px rgba(0,0,0,0.65)',
            }}
          >
            [ 004 / Coach ]
          </span>
        </div>

        {/* name — fills photo width, ~45% overlaps photo bottom */}
        <h2
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: '22vw',
            lineHeight: 0.86,
            margin: 0,
            marginTop: 8,
            width: '88vw',
            marginLeft: 'calc(-22px + 6vw)',
            letterSpacing: '-0.02em',
            color: '#fff',
            position: 'relative',
            zIndex: 3,
            textShadow: '0 6px 24px rgba(0,0,0,0.55)',
            whiteSpace: 'nowrap',
            opacity: photoR.vis ? 1 : 0,
            transform: photoR.vis ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 900ms 120ms cubic-bezier(.2,.7,.2,1), transform 1000ms 120ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          {COACH.name}
          <span style={{ color: RED }}>.</span>
        </h2>

        {/* type */}
        <div ref={copyR.ref} style={{ marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.14)',
              fontFamily: MONO,
              fontSize: 9.5,
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.62)',
              fontWeight: 700,
            }}
          >
            <span style={{ color: '#fff' }}>{COACH.title.toUpperCase()}</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span>{COACH.years} YRS</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ color: RED }}>{COACH.cred}</span>
          </div>

          <p
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 15,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: '18px 0 0',
            }}
          >
            {COACH.bio}
          </p>

          {/* ACHIEVEMENT LEDGER */}
          <div style={{ marginTop: 26 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ width: 16, height: 1, background: RED }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8.5,
                  letterSpacing: '0.3em',
                  color: RED,
                  fontWeight: 700,
                }}
              >
                / LOG · SINCE 2019
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: '0.26em',
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 700,
                }}
              >
                {String(ACHIEVEMENTS.length).padStart(2, '0')} ENTRIES
              </span>
            </div>

            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {ACHIEVEMENTS.map((a, i) => (
                <li
                  key={a.year}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr auto',
                    gap: 10,
                    alignItems: 'baseline',
                    padding: '8px 0 8px 8px',
                    borderTop:
                      i === 0 ? '1px solid rgba(255,255,255,0.18)' : '1px dashed rgba(255,255,255,0.10)',
                    borderLeft: a.mark ? `2px solid ${RED}` : '2px solid transparent',
                    background: a.mark ? 'rgba(225,10,31,0.08)' : 'transparent',
                    fontFamily: MONO,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      color: a.mark ? RED : 'rgba(255,255,255,0.92)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                    }}
                  >
                    {a.year}
                  </span>
                  <span
                    style={{
                      color: a.mark ? '#fff' : 'rgba(255,255,255,0.82)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.title}
                  </span>
                  <span
                    style={{
                      color: a.podium ? RED : 'rgba(255,255,255,0.45)',
                      fontSize: 8.5,
                      letterSpacing: '0.22em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.podium ? '●' : '○'} {a.place}
                  </span>
                </li>
              ))}
              <li
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.18)',
                  paddingTop: 8,
                  paddingLeft: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700,
                }}
              >
                <span>● PODIUM · ○ FINAL</span>
                <span style={{ color: RED }}>ONGOING</span>
              </li>
            </ol>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 6,
              marginTop: 22,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.k}
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(10,10,13,0.45)',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  fontFamily: MONO,
                  fontWeight: 700,
                  minWidth: 0,
                }}
              >
                <span style={{ color: RED, fontSize: 8.5, letterSpacing: '0.24em' }}>
                  / {s.k}
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.86)',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.v}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 22,
              paddingTop: 12,
              borderTop: `1px solid ${RED}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 700,
            }}
          >
            <span>UNDER THE SQUAT RACK</span>
            <span style={{ color: RED }}>● ON DUTY</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────── ROOT ────────────────────── */

export default function CoachSection() {
  return (
    <div id="coach">
      <div className="block md:hidden">
        <MobileCoach />
      </div>
      <div className="hidden md:block">
        <DesktopCoach />
      </div>
    </div>
  )
}
