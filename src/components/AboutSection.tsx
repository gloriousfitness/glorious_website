const RED = '#E10A1F'
const BONE = '#f4ede4'

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
]

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: '#0a0a0d',
        color: BONE,
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
          opacity: 0.32,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: GRAIN_BG,
        }}
      />

      {/* Ticker strip */}
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

      {/* Watermark — ABOUT bleeding right edge */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 120,
          right: '-12vw',
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(200px, 64vw, 360px)',
          color: 'rgba(225,10,31,0.055)',
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

      {/* Inner content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '56px 20px 64px',
        }}
      >
        {/* § Identity mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 28,
              height: 1,
              background: RED,
            }}
          />
          <div
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: RED,
              textTransform: 'uppercase',
            }}
          >
            [ 001 / Identity ]
          </div>
        </div>

        {/* Headline — bleeds left past padding */}
        <h2
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 'clamp(82px, 26vw, 112px)',
            lineHeight: 0.95,
            margin: '0 0 0 -4px',
            letterSpacing: '-0.02em',
            color: BONE,
          }}
        >
          About
          <br />
          <span style={{ color: RED }}>Us.</span>
        </h2>

        <p
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 15,
            lineHeight: 1.6,
            color: 'rgba(244,237,228,0.72)',
            margin: '32px 0 0',
          }}
        >
          Open 6 to 10, every single day. Strength, conditioning, performance — whatever the goal
          demands, the kit is here. No classes, no schedule — just iron, you, and a coach if you
          want one.{' '}
          <span style={{ color: BONE }}>
            Forged for lifters, fighters, and anyone chasing a legend worth telling.
          </span>
        </p>

        <p
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 14,
            lineHeight: 1.65,
            color: 'rgba(244,237,228,0.55)',
            margin: '20px 0 0',
          }}
        >
          Every level. Every goal. Weight loss, muscle, raw strength, endurance — we run
          personalized programs built around the individual, not the crowd. Modern equipment,
          real coaches, and an environment that demands your best.{' '}
          <span style={{ color: 'rgba(244,237,228,0.72)' }}>
            Fitness is a lifestyle. Our mission is to inspire, motivate, and push you to become
            the version of yourself worth becoming.
          </span>
        </p>

        {/* Tagline callout */}
        <div
          style={{
            marginTop: 28,
            paddingLeft: 14,
            borderLeft: `2px solid ${RED}`,
          }}
        >
          <div
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 13,
              letterSpacing: '0.14em',
              color: RED,
              textTransform: 'uppercase',
              lineHeight: 1.5,
            }}
          >
            Train Hard · Stay Strong · Achieve More.
          </div>
        </div>

        {/* Stats — red top hairline, vertical dividers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            borderTop: `1px solid ${RED}`,
            borderBottom: '1px solid rgba(244,237,228,0.08)',
            marginTop: 36,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.l}
              style={{
                flex: 1,
                padding: '18px 10px 16px',
                borderRight: i < 2 ? '1px solid rgba(244,237,228,0.06)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 30,
                  color: BONE,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 9,
                  letterSpacing: '0.24em',
                  color: 'rgba(244,237,228,0.42)',
                  textTransform: 'uppercase',
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* ── PROGRAM LEDGER HEADER ── */}
        <div style={{ marginTop: 48 }}>
          {/* Classification bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 8.5,
              letterSpacing: '0.28em',
              color: 'rgba(244,237,228,0.5)',
              textTransform: 'uppercase',
              paddingBottom: 12,
              borderBottom: '1px solid rgba(244,237,228,0.14)',
              marginBottom: 18,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: RED }}>●</span>
            <span>Program</span>
            <span style={{ opacity: 0.4 }}>///</span>
            <span>Manifest</span>
            <span style={{ opacity: 0.4 }}>///</span>
            <span>Vol. 02</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(244,237,228,0.35)' }}>
              06 entries
            </span>
          </div>

          {/* Title + stamp row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 16,
              paddingBottom: 18,
              borderBottom: `2px solid ${RED}`,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  color: RED,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                [ § 002 — Disciplines ]
              </div>
              <h3
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 'clamp(40px, 12vw, 56px)',
                  letterSpacing: '-0.01em',
                  margin: 0,
                  color: BONE,
                  lineHeight: 0.92,
                  textTransform: 'uppercase',
                }}
              >
                Program
                <br />
                <span style={{ color: RED }}>Ledger.</span>
              </h3>
            </div>

            {/* Mini approval stamp */}
            <div
              style={{
                transform: 'rotate(-6deg)',
                border: `2px solid ${RED}`,
                padding: '6px 9px 5px',
                color: RED,
                textAlign: 'center',
                opacity: 0.85,
                position: 'relative',
                flexShrink: 0,
                background: 'rgba(13,6,8,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 6.5,
                  letterSpacing: '0.28em',
                  marginBottom: 2,
                  opacity: 0.7,
                }}
              >
                CERT.
              </div>
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                APPROVED
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 6,
                  letterSpacing: '0.28em',
                  marginTop: 2,
                  opacity: 0.6,
                }}
              >
                GFC · 26
              </div>
              <span style={{ position: 'absolute', top: -1, left: -1, width: 5, height: 5, borderTop: `2px solid ${BONE}`, borderLeft: `2px solid ${BONE}` }} />
              <span style={{ position: 'absolute', top: -1, right: -1, width: 5, height: 5, borderTop: `2px solid ${BONE}`, borderRight: `2px solid ${BONE}` }} />
              <span style={{ position: 'absolute', bottom: -1, left: -1, width: 5, height: 5, borderBottom: `2px solid ${BONE}`, borderLeft: `2px solid ${BONE}` }} />
              <span style={{ position: 'absolute', bottom: -1, right: -1, width: 5, height: 5, borderBottom: `2px solid ${BONE}`, borderRight: `2px solid ${BONE}` }} />
            </div>
          </div>
        </div>

        {/* ── LEDGER ENTRIES ── */}
        <div
          style={{
            position: 'relative',
            marginTop: 16,
            paddingTop: 8,
          }}
        >
          {/* Blueprint grid behind rows */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '0 -20px',
              backgroundImage:
                'linear-gradient(rgba(244,237,228,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(244,237,228,0.025) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              pointerEvents: 'none',
              zIndex: 0,
              maskImage:
                'linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
            }}
          />

          {/* Vertical red rule far-left */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: -10,
              top: 20,
              bottom: 20,
              width: 1,
              background:
                'linear-gradient(180deg, transparent 0%, rgba(225,10,31,0.5) 10%, rgba(225,10,31,0.5) 90%, transparent 100%)',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {WINGS.map((w, i) => (
              <div
                key={w.n}
                style={{
                  padding: '24px 0 26px',
                  borderBottom:
                    i < WINGS.length - 1 ? '1px solid rgba(244,237,228,0.10)' : 'none',
                  position: 'relative',
                }}
              >
                {/* Reg cross right edge */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    right: -14,
                    bottom: -7,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: 'rgba(244,237,228,0.22)',
                    lineHeight: 1,
                  }}
                >
                  +
                </span>

                {/* Top: bracket eyebrow + code chip */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 9.5,
                      letterSpacing: '0.3em',
                      color: RED,
                      textTransform: 'uppercase',
                    }}
                  >
                    [ {w.n} / {w.tag.toUpperCase()} ]
                  </div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 9,
                      letterSpacing: '0.24em',
                      color: 'rgba(244,237,228,0.4)',
                      textTransform: 'uppercase',
                    }}
                  >
                    §&nbsp;{w.code}
                  </div>
                </div>

                {/* Numeral + title row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '78px 1fr',
                    gap: 16,
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 64,
                      lineHeight: 0.82,
                      letterSpacing: '-0.02em',
                      color: 'transparent',
                      WebkitTextStroke: `1.3px ${BONE}`,
                      userSelect: 'none',
                    }}
                  >
                    {w.n}
                  </div>
                  <h4
                    style={{
                      fontFamily: 'Freshman, serif',
                      fontSize: 24,
                      letterSpacing: '0.005em',
                      margin: 0,
                      color: BONE,
                      lineHeight: 1.02,
                      textTransform: 'uppercase',
                    }}
                  >
                    {w.title}
                  </h4>
                </div>

                {/* Body */}
                <p
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: 'rgba(244,237,228,0.6)',
                    margin: '0 0 16px',
                  }}
                >
                  {w.body}
                </p>

                {/* Spec strip — Protocol | Load */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    borderTop: '1px solid rgba(244,237,228,0.12)',
                    paddingTop: 12,
                  }}
                >
                  <div style={{ borderRight: '1px solid rgba(244,237,228,0.08)', paddingRight: 12 }}>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: 8.5,
                        letterSpacing: '0.28em',
                        color: 'rgba(244,237,228,0.35)',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Kit
                    </div>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: 11,
                        color: BONE,
                        letterSpacing: '0.04em',
                        lineHeight: 1.4,
                      }}
                    >
                      {w.kit}
                    </div>
                  </div>
                  <div style={{ paddingLeft: 12 }}>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: 8.5,
                        letterSpacing: '0.28em',
                        color: 'rgba(244,237,228,0.35)',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Goal
                    </div>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: 12,
                        color: BONE,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {w.goal}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ledger footer */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 24,
              paddingTop: 16,
              borderTop: `1px solid rgba(244,237,228,0.16)`,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 8.5,
              letterSpacing: '0.26em',
              color: 'rgba(244,237,228,0.4)',
              textTransform: 'uppercase',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            <span>End</span>
            <span style={{ color: RED }}>§ 002 / 06 of 06</span>
            <span>GFC Archive</span>
          </div>
        </div>
      </div>
    </section>
  )
}
