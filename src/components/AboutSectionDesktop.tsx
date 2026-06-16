import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const BONE = '#f4ede4'
const RUST = '#5a1a1f'

const STATS = [
  { v: '6—10', l: 'Open Daily' },
  { v: '1:1', l: 'Coaching' },
  { v: 'ALL', l: 'Disciplines' },
]

const WINGS = [
  {
    n: '01',
    code: 'A-01',
    title: 'Strength Training',
    body: 'Weight lifting, powerlifting, resistance work. Pull plates, push limits, build the base.',
    tag: 'Iron',
    kit: 'Racks · Bars · Plates',
    goal: 'Raw Power',
  },
  {
    n: '02',
    code: 'A-02',
    title: 'Muscle Building',
    body: 'Bodybuilding splits and hypertrophy programs. Size the frame, sculpt the lines.',
    tag: 'Mass',
    kit: 'Dumbbells · Cables · Machines',
    goal: 'Size',
  },
  {
    n: '03',
    code: 'B-01',
    title: 'Fat Loss',
    body: 'HIIT, cardio mixes, fat-loss circuits. Sweat hard, burn clean, drop weight.',
    tag: 'Cut',
    kit: 'Bikes · Rowers · Floor',
    goal: 'Burn',
  },
  {
    n: '04',
    code: 'B-02',
    title: 'Cardiovascular',
    body: 'Treadmill, cycle, row, stair-climb. Pump lungs, build the engine, finish strong.',
    tag: 'Pulse',
    kit: 'Treads · Cycles · Steppers',
    goal: 'Engine',
  },
  {
    n: '05',
    code: 'C-01',
    title: 'Endurance',
    body: 'Long-haul cardio, circuit training, sports conditioning. Outlast every round.',
    tag: 'Stamina',
    kit: 'Circuit Floor · Open Mats',
    goal: 'Distance',
  },
  {
    n: '06',
    code: 'C-02',
    title: 'Performance',
    body: 'Athletic conditioning, speed and agility, sport-specific work. Train like the game demands.',
    tag: 'Athlete',
    kit: 'Sleds · Boxes · Open Floor',
    goal: 'Game Day',
  },
  {
    n: '07',
    code: 'D-01',
    title: 'Personal Training',
    body: 'One-on-one coaching with customized fitness programs built around your exact goals. No guesswork — just a coach, a plan, and results.',
    tag: 'Coach',
    kit: 'Full Gym Access',
    goal: 'Your Goal',
  },
]

function WingRow({
  wing,
  delay,
  visible,
  isLast,
}: {
  wing: (typeof WINGS)[0]
  delay: number
  visible: boolean
  isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '110px 1fr 200px',
        columnGap: 48,
        alignItems: 'start',
        padding: '40px 0 36px',
        borderBottom: isLast ? 'none' : '1px solid rgba(244,237,228,0.10)',
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 600ms ${300 + delay}ms ease, transform 700ms ${300 + delay}ms cubic-bezier(0.22,1,0.36,1)`,
        cursor: 'default',
      }}
    >
      {/* Row hover wash + stamp */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '0 -40px',
          background: hovered
            ? 'linear-gradient(90deg, rgba(90,26,31,0.32) 0%, rgba(90,26,31,0) 75%)'
            : 'transparent',
          transition: 'background 360ms ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Registration mark — right edge cross */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: -28,
          bottom: -7,
          width: 14,
          height: 14,
          color: hovered ? RED : 'rgba(244,237,228,0.22)',
          fontSize: 14,
          lineHeight: 1,
          fontFamily: 'monospace',
          transition: 'color 320ms ease',
        }}
      >
        +
      </div>

      {/* LEFT column — outlined numeral + code */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(72px, 6.4vw, 96px)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: hovered ? `1.5px ${RED}` : `1.4px rgba(244,237,228,0.85)`,
            transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)',
            transform: hovered ? 'translateX(6px)' : 'translateX(0)',
            userSelect: 'none',
          }}
        >
          {wing.n}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.24em',
            color: 'rgba(244,237,228,0.4)',
            textTransform: 'uppercase',
          }}
        >
          §&nbsp;&nbsp;{wing.code}
        </div>
      </div>

      {/* MIDDLE — eyebrow + title + body */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 10.5,
            letterSpacing: '0.32em',
            color: hovered ? RED : 'rgba(244,237,228,0.55)',
            textTransform: 'uppercase',
            marginBottom: 14,
            transition: 'color 280ms ease',
          }}
        >
          [ {wing.n} / {wing.tag.toUpperCase()} ]
        </div>
        <h3
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(34px, 3vw, 44px)',
            letterSpacing: '0.005em',
            margin: '0 0 18px',
            color: BONE,
            lineHeight: 1.02,
            textTransform: 'uppercase',
          }}
        >
          {wing.title}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 15,
            lineHeight: 1.65,
            color: 'rgba(244,237,228,0.6)',
            margin: 0,
            maxWidth: 520,
          }}
        >
          {wing.body}
        </p>
      </div>

      {/* RIGHT — protocol metadata stack */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          paddingLeft: 20,
          borderLeft: `1px solid rgba(244,237,228,0.12)`,
          paddingTop: 4,
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 9,
            letterSpacing: '0.28em',
            color: 'rgba(244,237,228,0.35)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Kit
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 12,
            color: BONE,
            letterSpacing: '0.04em',
            marginBottom: 18,
            lineHeight: 1.5,
          }}
        >
          {wing.kit}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 9,
            letterSpacing: '0.28em',
            color: 'rgba(244,237,228,0.35)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Goal
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 13,
            color: hovered ? RED : BONE,
            letterSpacing: '0.06em',
            transition: 'color 280ms ease',
          }}
        >
          {wing.goal}
        </div>
      </div>
    </div>
  )
}

export default function AboutSectionDesktop() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold: 0.08 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="about"
      style={{
        background: '#0a0a0d',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top ticker strip */}
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
        <span>Est. — Glorious Fitness Center</span>
        <span style={{ opacity: 0.85 }}>Iron · Sweat · Glory</span>
        <span>Open 6AM — 10PM · No Classes</span>
      </div>

      {/* Inner content */}
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '104px 80px 96px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── TOP: identity + copy + inline stats ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '44px 1fr 1fr',
            gap: 64,
            marginBottom: 96,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Watermark — contained to identity block */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-8%',
              right: '-6vw',
              fontFamily: 'Freshman, serif',
              fontSize: 'clamp(180px, 20vw, 320px)',
              color: 'rgba(225,10,31,0.05)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
              lineHeight: 0.85,
            }}
          >
            ABOUT
          </div>
          {/* Rotated side label */}
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
              opacity: visible ? 1 : 0,
              transition: 'opacity 800ms ease',
            }}
          >
            § 01 — Who We Are
          </div>

          {/* Headline + section number */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 11,
                letterSpacing: '0.24em',
                color: RED,
                marginBottom: 28,
              }}
            >
              [ 001 / Identity ]
            </div>
            <h2
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 'clamp(72px, 8vw, 132px)',
                lineHeight: 0.86,
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              About
              <br />
              <span style={{ color: RED }}>Us.</span>
            </h2>
          </div>

          {/* Right: copy + stats stacked */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 800ms 120ms ease, transform 800ms 120ms cubic-bezier(0.22,1,0.36,1)',
              alignSelf: 'end',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 17,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.78)',
                margin: '0 0 20px',
                maxWidth: 520,
              }}
            >
              Open 6 to 10, every single day. Strength, conditioning, performance — whatever the
              goal demands, the kit is here. No classes, no schedule — just iron, you, and a coach
              if you want one.{' '}
              <span style={{ color: '#fff' }}>
                Forged for lifters, fighters, and anyone chasing a legend worth telling.
              </span>
            </p>

            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 15,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                margin: '0 0 28px',
                maxWidth: 520,
              }}
            >
              Every level. Every goal. Weight loss, muscle, raw strength, endurance — we run
              personalized programs built around the individual, not the crowd. Modern equipment,
              real coaches, an environment that demands your best.{' '}
              <span style={{ color: 'rgba(255,255,255,0.78)' }}>
                Fitness is a lifestyle. Our mission is to inspire, motivate, and push you to become
                the version of yourself worth becoming.
              </span>
            </p>

            {/* Tagline callout */}
            <div
              style={{
                paddingLeft: 16,
                borderLeft: `2px solid ${RED}`,
                marginBottom: 44,
              }}
            >
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 14,
                  letterSpacing: '0.14em',
                  color: RED,
                  textTransform: 'uppercase',
                  lineHeight: 1.5,
                }}
              >
                Train Hard · Stay Strong · Achieve More.
              </div>
            </div>

            {/* Inline stats tape */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                borderTop: `1px solid ${RED}`,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.l}
                  style={{
                    flex: 1,
                    padding: '24px 0 22px',
                    paddingLeft: i === 0 ? 0 : 24,
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 'clamp(34px, 3.4vw, 48px)',
                      color: '#fff',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, system-ui',
                      fontSize: 9.5,
                      letterSpacing: '0.28em',
                      color: 'rgba(255,255,255,0.4)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROGRAM LEDGER HEADER ── */}
        <div
          style={{
            position: 'relative',
            opacity: visible ? 1 : 0,
            transition: 'opacity 700ms 280ms ease',
            marginBottom: 24,
          }}
        >
          {/* Document classification bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.32em',
              color: 'rgba(244,237,228,0.5)',
              textTransform: 'uppercase',
              paddingBottom: 18,
              borderBottom: '1px solid rgba(244,237,228,0.16)',
              marginBottom: 28,
            }}
          >
            <span style={{ color: RED }}>●</span>
            <span>Glorious F.C.</span>
            <span style={{ opacity: 0.4 }}>///</span>
            <span>Program Manifest</span>
            <span style={{ opacity: 0.4 }}>///</span>
            <span>Vol. 02</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(244,237,228,0.35)' }}>
              Rev. 2026 — 07 Entries
            </span>
          </div>

          {/* Title row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingBottom: 28,
              borderBottom: `2px solid ${RED}`,
              gap: 32,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 10.5,
                  letterSpacing: '0.32em',
                  color: RED,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}
              >
                [ § 002 — Training Disciplines ]
              </div>
              <h3
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 'clamp(56px, 6.4vw, 96px)',
                  letterSpacing: '-0.015em',
                  margin: 0,
                  color: BONE,
                  lineHeight: 0.92,
                  textTransform: 'uppercase',
                }}
              >
                The Program
                <br />
                <span style={{ color: RED }}>Ledger.</span>
              </h3>
            </div>

          </div>

          {/* Column legend strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 200px',
              columnGap: 48,
              marginTop: 16,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 9,
              letterSpacing: '0.28em',
              color: 'rgba(244,237,228,0.32)',
              textTransform: 'uppercase',
            }}
          >
            <div>Index</div>
            <div>Discipline</div>
            <div style={{ paddingLeft: 20 }}>Specification</div>
          </div>
        </div>

        {/* ── LEDGER ENTRIES ── */}
        <div
          style={{
            position: 'relative',
            paddingTop: 12,
          }}
        >
          {/* Blueprint grid behind rows */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '0 -16px',
              backgroundImage:
                'linear-gradient(rgba(244,237,228,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(244,237,228,0.025) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
              zIndex: 0,
              maskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 88%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 14%, #000 88%, transparent 100%)',
            }}
          />

          {/* Vertical column rule — far left margin */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: -16,
              top: 24,
              bottom: 24,
              width: 1,
              background:
                'linear-gradient(180deg, transparent 0%, rgba(225,10,31,0.5) 12%, rgba(225,10,31,0.5) 88%, transparent 100%)',
              zIndex: 0,
            }}
          />

          {/* Side label — rotated chapter mark */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: -56,
              top: 60,
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 9.5,
              letterSpacing: '0.4em',
              color: 'rgba(244,237,228,0.32)',
              textTransform: 'uppercase',
            }}
          >
            Ch. 02 — Forge / Manifest
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {WINGS.map((w, i) => (
              <WingRow
                key={w.n}
                wing={w}
                delay={i * 90}
                visible={visible}
                isLast={i === WINGS.length - 1}
              />
            ))}
          </div>

          {/* Ledger footer */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 32,
              paddingTop: 20,
              borderTop: `1px solid rgba(244,237,228,0.16)`,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 9.5,
              letterSpacing: '0.3em',
              color: 'rgba(244,237,228,0.4)',
              textTransform: 'uppercase',
            }}
          >
            <span>End of Manifest</span>
            <span style={{ color: RED }}>— § 002 / 07 of 07 —</span>
            <span>Filed · GFC Archive</span>
          </div>
        </div>
      </div>
    </section>
  )
}
