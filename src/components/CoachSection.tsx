import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const BG = '#0a0a0d'
const PHOTO = '/coach-rahul.jpeg'
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace"

const COACH = {
  name: 'RAHUL',
  surname: '',
  title: 'Bodybuilding',
  years: '05',
  bio: 'National-level bodybuilder turned coach. Builds champions from raw iron.',
  cred: 'NATIONAL',
}

const LEDGER = [
  { n: '01', k: 'FLOOR', v: 'Strength wing — daily 05:00 / 22:00' },
  { n: '02', k: 'IRON', v: 'Hypertrophy, raw lifts, structural work' },
  { n: '03', k: 'PREP', v: 'Stage prep, posing rounds, contest peak' },
]

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

function useReveal<T extends HTMLElement>(threshold = 0.12) {
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

/* ────────────────────── DESKTOP ────────────────────── */

function DesktopCoach() {
  const photoR = useReveal<HTMLDivElement>()
  const copyR = useReveal<HTMLDivElement>(0.2)

  return (
    <section
      style={{
        background: BG,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      {/* grain */}
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
          padding: '11px 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>§ 04 — On the Floor</span>
        <span style={{ opacity: 0.85 }}>One Coach · No Roster · No Tier</span>
        <span>Walk on · 24 / 7</span>
      </div>

      {/* COACH watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '34%',
          left: '-2vw',
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
        COACH
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          height: 'calc(100vh - 41px)',
          minHeight: 720,
        }}
      >
        {/* ── LEFT: photo bleed ── */}
        <div
          ref={photoR.ref}
          style={{
            position: 'relative',
            overflow: 'hidden',
            opacity: photoR.vis ? 1 : 0,
            transform: photoR.vis ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 1100ms cubic-bezier(.2,.7,.2,1), transform 1400ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <img
            src={PHOTO}
            alt="Coach Rahul"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              filter: 'contrast(1.08) saturate(0.78) brightness(0.92)',
            }}
          />

          {/* deep vignette right edge -> seams into type column */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(10,10,13,0) 55%, rgba(10,10,13,0.55) 82%, rgba(10,10,13,1) 100%), linear-gradient(180deg, rgba(10,10,13,0.45) 0%, rgba(10,10,13,0) 28%, rgba(10,10,13,0) 65%, rgba(10,10,13,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* photo grain overlay */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.45,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              backgroundImage: GRAIN_BG,
            }}
          />

          {/* top-left bracket chrome */}
          <div
            style={{
              position: 'absolute',
              top: 36,
              left: 36,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.75)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 700,
            }}
          >
            <span style={{ color: RED }}>●</span>
            <span>FRAME / SUBJ_01</span>
          </div>

          {/* bottom-left frame caption */}
          <div
            style={{
              position: 'absolute',
              left: 36,
              bottom: 32,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.55)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontWeight: 700,
            }}
          >
            <span>RAHUL · GLORIOUS FITNESS · KANDY</span>
            <span style={{ color: 'rgba(255,255,255,0.32)' }}>SHOT 01 / 01 — UNRETOUCHED</span>
          </div>

          {/* rotated side label inside photo */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: 40,
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              transformOrigin: 'center',
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.5)',
              whiteSpace: 'nowrap',
              fontWeight: 700,
            }}
          >
            § 04 / HEAD COACH / SOLE
          </div>
        </div>

        {/* ── RIGHT: type column ── */}
        <div
          ref={copyR.ref}
          style={{
            padding: '88px clamp(48px, 5vw, 88px) 80px clamp(40px, 4vw, 64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* eyebrow */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 22,
                opacity: copyR.vis ? 1 : 0,
                transform: copyR.vis ? 'translateY(0)' : 'translateY(-8px)',
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

            {/* big name */}
            <h2
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 'clamp(96px, 11vw, 184px)',
                lineHeight: 0.84,
                margin: 0,
                letterSpacing: '-0.01em',
                color: '#fff',
                opacity: copyR.vis ? 1 : 0,
                transform: copyR.vis ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 800ms 100ms, transform 800ms 100ms cubic-bezier(.2,.7,.2,1)',
              }}
            >
              {COACH.name}
              <span style={{ color: RED }}>.</span>
            </h2>

            {/* spec line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginTop: 24,
                paddingTop: 14,
                borderTop: '1px solid rgba(255,255,255,0.12)',
                fontFamily: MONO,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.62)',
                fontWeight: 700,
                opacity: copyR.vis ? 1 : 0,
                transition: 'opacity 700ms 240ms',
              }}
            >
              <span style={{ color: '#fff' }}>{COACH.title.toUpperCase()}</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span>
                {COACH.years} YRS
              </span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span style={{ color: RED }}>{COACH.cred}</span>
            </div>

            {/* bio */}
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 17,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.78)',
                margin: '36px 0 0',
                maxWidth: 460,
                opacity: copyR.vis ? 1 : 0,
                transform: copyR.vis ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 800ms 320ms, transform 800ms 320ms',
              }}
            >
              {COACH.bio}
            </p>
          </div>

          {/* ledger bottom */}
          <div
            style={{
              marginTop: 64,
              borderTop: `1px solid ${RED}`,
              paddingTop: 4,
              opacity: copyR.vis ? 1 : 0,
              transform: copyR.vis ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 800ms 440ms, transform 800ms 440ms',
            }}
          >
            {LEDGER.map((row, i) => (
              <LedgerRow key={row.n} {...row} last={i === LEDGER.length - 1} />
            ))}

            {/* sign-off */}
            <div
              style={{
                marginTop: 28,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.42)',
                fontWeight: 700,
              }}
            >
              <span>FIND HIM UNDER THE SQUAT RACK</span>
              <span style={{ color: RED }}>● ON DUTY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LedgerRow({
  n,
  k,
  v,
  last,
}: {
  n: string
  k: string
  v: string
  last?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 92px 1fr',
        gap: 18,
        padding: '16px 0',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.08)',
        alignItems: 'baseline',
        cursor: 'default',
        transition: 'transform 280ms cubic-bezier(.22,1,.36,1)',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
      }}
    >
      <span
        style={{
          fontFamily: 'Freshman, serif',
          fontSize: 28,
          color: hovered ? RED : '#fff',
          lineHeight: 1,
          letterSpacing: '0.02em',
          transition: 'color 240ms',
        }}
      >
        {n}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: '0.28em',
          color: hovered ? RED : 'rgba(255,255,255,0.55)',
          fontWeight: 700,
          transition: 'color 240ms',
        }}
      >
        / {k}
      </span>
      <span
        style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 14,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        {v}
      </span>
    </div>
  )
}

/* ────────────────────── MOBILE ────────────────────── */

function MobileCoach() {
  const photoR = useReveal<HTMLDivElement>()
  const copyR = useReveal<HTMLDivElement>(0.18)

  return (
    <section
      style={{
        background: BG,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      {/* grain */}
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

      {/* watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 220,
          right: '-14vw',
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(180px, 60vw, 320px)',
          color: 'rgba(225,10,31,0.05)',
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

      {/* photo full-bleed */}
      <div
        ref={photoR.ref}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          opacity: photoR.vis ? 1 : 0,
          transform: photoR.vis ? 'scale(1)' : 'scale(1.05)',
          transition: 'opacity 1100ms, transform 1400ms cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <img
          src={PHOTO}
          alt="Coach Rahul"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            display: 'block',
            filter: 'contrast(1.08) saturate(0.78) brightness(0.92)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,13,0.55) 0%, rgba(10,10,13,0) 30%, rgba(10,10,13,0) 50%, rgba(10,10,13,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.45,
            mixBlendMode: 'overlay',
            backgroundImage: GRAIN_BG,
            pointerEvents: 'none',
          }}
        />

        {/* top label */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 20,
            fontFamily: MONO,
            fontSize: 9.5,
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700,
          }}
        >
          <span style={{ color: RED }}>●</span>
          <span>FRAME / SUBJ_01</span>
        </div>

        {/* bottom-left caption */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 14,
            fontFamily: MONO,
            fontSize: 8.5,
            letterSpacing: '0.26em',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 700,
          }}
        >
          UNRETOUCHED · KANDY
        </div>
      </div>

      {/* type column */}
      <div
        ref={copyR.ref}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '32px 22px 56px',
          marginTop: -60, /* lift name over photo bleed */
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
            opacity: copyR.vis ? 1 : 0,
            transition: 'opacity 600ms',
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
            }}
          >
            [ 004 / Coach ]
          </span>
        </div>

        {/* name */}
        <h2
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(80px, 24vw, 120px)',
            lineHeight: 0.84,
            margin: 0,
            letterSpacing: '-0.02em',
            color: '#fff',
            opacity: copyR.vis ? 1 : 0,
            transform: copyR.vis ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 800ms 80ms, transform 800ms 80ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          {COACH.name}
          <span style={{ color: RED }}>.</span>
        </h2>

        {/* spec line */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 18,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.12)',
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

        {/* bio */}
        <p
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 15.5,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.78)',
            margin: '24px 0 0',
          }}
        >
          {COACH.bio}
        </p>

        {/* ledger */}
        <div
          style={{
            marginTop: 36,
            borderTop: `1px solid ${RED}`,
            paddingTop: 4,
          }}
        >
          {LEDGER.map((row, i) => (
            <div
              key={row.n}
              style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr',
                gap: 14,
                padding: '14px 0',
                borderBottom:
                  i < LEDGER.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 24,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {row.n}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: '0.26em',
                    color: RED,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  / {row.k}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.72)',
                  }}
                >
                  {row.v}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* sign-off */}
        <div
          style={{
            marginTop: 22,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: '0.26em',
            color: 'rgba(255,255,255,0.42)',
            fontWeight: 700,
          }}
        >
          <span>UNDER THE SQUAT RACK</span>
          <span style={{ color: RED }}>● ON DUTY</span>
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
