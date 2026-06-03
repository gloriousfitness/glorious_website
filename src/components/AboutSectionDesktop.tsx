import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'

const STATS = [
  { v: '24/7', l: 'Open Floor' },
  { v: '80', l: 'Cap on Floor' },
  { v: '1:1', l: 'Personal Trainers' },
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
        gridTemplateColumns: '180px 1fr 2fr 120px',
        gap: 48,
        alignItems: 'center',
        padding: '36px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ${300 + delay}ms ease, transform 700ms ${300 + delay}ms cubic-bezier(0.22,1,0.36,1)`,
        cursor: 'default',
      }}
    >
      {/* Hover background fill — bleeds full row */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '0 -32px',
          background: hovered
            ? 'linear-gradient(90deg, rgba(225,10,31,0.08) 0%, rgba(225,10,31,0) 60%)'
            : 'transparent',
          transition: 'background 320ms ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Big index numeral */}
      <div
        style={{
          fontFamily: 'Freshman, serif',
          fontSize: 'clamp(72px, 7vw, 108px)',
          lineHeight: 0.85,
          color: hovered ? RED : 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.02em',
          transition: 'color 280ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)',
          transform: hovered ? 'translateX(8px)' : 'translateX(0)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {wing.n}
      </div>

      {/* Title + tag */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'Inter, system-ui',
            fontSize: 9.5,
            letterSpacing: '0.32em',
            color: hovered ? RED : 'rgba(255,255,255,0.32)',
            textTransform: 'uppercase',
            marginBottom: 10,
            transition: 'color 280ms ease',
          }}
        >
          / {wing.tag}
        </div>
        <h3
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 26,
            letterSpacing: '0.01em',
            margin: 0,
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          {wing.title}
        </h3>
      </div>

      {/* Body */}
      <p
        style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 15,
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.6)',
          margin: 0,
          maxWidth: 480,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {wing.body}
      </p>

      {/* Right arrow indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: hovered ? 48 : 24,
            height: 1,
            background: hovered ? RED : 'rgba(255,255,255,0.25)',
            transition: 'width 320ms cubic-bezier(0.22,1,0.36,1), background 280ms ease',
          }}
        />
        <span
          style={{
            fontFamily: 'Freshman, serif',
            fontSize: 14,
            color: hovered ? RED : 'rgba(255,255,255,0.4)',
            transition: 'color 280ms ease',
          }}
        >
          →
        </span>
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
        <span>Open 24 / 7 · No Classes · No Lines</span>
      </div>

      {/* Watermark — big, off-axis */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '38%',
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
          fontWeight: 400,
        }}
      >
        ABOUT
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
          }}
        >
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
                margin: '0 0 44px',
                maxWidth: 520,
              }}
            >
              A 24/7 open-floor gym for people who train like they mean it. No classes, no waiting
              — just iron, you, and a trainer if you want one.{' '}
              <span style={{ color: '#fff' }}>
                Forged for lifters, fighters, and anyone chasing a legend worth telling.
              </span>
            </p>

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

        {/* ── FACILITIES HEADER ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '44px 1fr',
            gap: 64,
            alignItems: 'end',
            marginBottom: 16,
            paddingBottom: 24,
            borderBottom: `2px solid ${RED}`,
            opacity: visible ? 1 : 0,
            transition: 'opacity 700ms 280ms ease',
          }}
        >
          <div
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 11,
              color: RED,
              letterSpacing: '0.24em',
            }}
          >
            §
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3
              style={{
                fontFamily: 'Freshman, serif',
                fontSize: 38,
                letterSpacing: '0.01em',
                margin: 0,
                color: '#fff',
                lineHeight: 1,
              }}
            >
              The Floor.
            </h3>
            <div
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 10.5,
                letterSpacing: '0.32em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
              }}
            >
              [ 002 / Facilities — Three Wings ]
            </div>
          </div>
        </div>

        {/* ── WING ROWS ── */}
        <div style={{ paddingLeft: 108 }}>
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
      </div>
    </section>
  )
}
