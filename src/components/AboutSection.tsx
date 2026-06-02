const RED = '#E10A1F'

const STATS = [
  { v: '24/7', l: 'Open Floor' },
  { v: '80', l: 'Cap on Floor' },
  { v: '1:1', l: 'Trainers' },
]

const WINGS = [
  {
    n: '01',
    title: 'Strength Floor',
    body: 'Power racks, platforms, plates. Built for heavy work — no waiting, no lines.',
    tag: 'Iron',
  },
  {
    n: '02',
    title: 'Recovery Suite',
    body: 'Sauna, cold plunge, mobility tools. Recover hard so you can train hard.',
    tag: 'Reset',
  },
  {
    n: '03',
    title: 'Personal Training',
    body: '1-on-1 coaching from competitive lifters. Programmed for the result you want.',
    tag: 'Coach',
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
          fontFamily: 'Graduate, serif',
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
              fontFamily: 'Graduate, serif',
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
            fontFamily: 'Graduate, serif',
            fontSize: 'clamp(82px, 26vw, 112px)',
            lineHeight: 0.84,
            margin: '0 0 0 -4px',
            letterSpacing: '-0.02em',
            color: '#fff',
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
            color: 'rgba(255,255,255,0.72)',
            margin: '32px 0 0',
          }}
        >
          A 24/7 open-floor gym for people who train like they mean it. No classes, no waiting —
          just iron, you, and a trainer if you want one.{' '}
          <span style={{ color: '#fff' }}>
            Forged for lifters, fighters, and anyone chasing a legend worth telling.
          </span>
        </p>

        {/* Stats — red top hairline, vertical dividers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            borderTop: `1px solid ${RED}`,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginTop: 36,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.l}
              style={{
                flex: 1,
                padding: '18px 10px 16px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Graduate, serif',
                  fontSize: 30,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, system-ui',
                  fontSize: 9,
                  letterSpacing: '0.24em',
                  color: 'rgba(255,255,255,0.42)',
                  textTransform: 'uppercase',
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* The Floor. header */}
        <div
          style={{
            marginTop: 64,
            paddingBottom: 18,
            borderBottom: `2px solid ${RED}`,
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, system-ui',
              fontSize: 9.5,
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.42)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            [ 002 / Facilities — Three Wings ]
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
            The Floor.
          </h3>
        </div>

        {/* Wing rows — brutalist mobile adaptation */}
        <div>
          {WINGS.map((w, i) => (
            <div
              key={w.n}
              style={{
                display: 'grid',
                gridTemplateColumns: '78px 1fr',
                gap: 16,
                padding: '26px 0 28px',
                borderBottom:
                  i < WINGS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                alignItems: 'start',
              }}
            >
              {/* Big numeral */}
              <div
                style={{
                  fontFamily: 'Graduate, serif',
                  fontSize: 72,
                  lineHeight: 0.82,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                {w.n}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 9,
                    letterSpacing: '0.32em',
                    color: RED,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  / {w.tag}
                </div>
                <h4
                  style={{
                    fontFamily: 'Graduate, serif',
                    fontSize: 22,
                    letterSpacing: '0.01em',
                    margin: '0 0 10px',
                    color: '#fff',
                    lineHeight: 1.05,
                  }}
                >
                  {w.title}
                </h4>
                <p
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.62)',
                    margin: 0,
                  }}
                >
                  {w.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
