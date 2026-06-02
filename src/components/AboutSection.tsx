const RED = '#E10A1F'

const STATS = [
  { v: '24/7', l: 'Open Floor' },
  { v: '80', l: 'Cap on Floor' },
  { v: '1:1', l: 'Personal Trainers' },
]

const WINGS = [
  {
    title: 'Strength Floor',
    body: 'Power racks, platforms, plates. Built for heavy work — no waiting, no lines.',
  },
  {
    title: 'Recovery Suite',
    body: 'Sauna, cold plunge, mobility tools. Recover hard so you can train hard.',
  },
  {
    title: 'Personal Training',
    body: '1-on-1 coaching from competitive lifters. Programmed for the result you want.',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative"
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
        Who we are
      </div>
      <h2
        style={{
          fontFamily: 'Graduate, serif',
          fontSize: 44,
          lineHeight: 0.95,
          margin: 0,
          letterSpacing: '0.01em',
          color: '#fff',
        }}
      >
        About<br />
        <span style={{ color: RED }}>Us.</span>
      </h2>

      <p
        style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 15,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.75)',
          margin: '28px 0 0',
        }}
      >
        A 24/7 open-floor gym for people who train like they mean it. No classes, no waiting —
        just iron, you, and a trainer if you want one. Forged for lifters, fighters, and anyone
        chasing a legend worth telling.
      </p>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginTop: 32,
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {STATS.map((s) => (
          <div key={s.l} className="flex flex-col items-center" style={{ gap: 6 }}>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 28,
                color: RED,
                lineHeight: 1,
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 9.5,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col" style={{ marginTop: 32, gap: 14 }}>
        {WINGS.map((w, i) => (
          <div
            key={w.title}
            style={{
              background: '#161618',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: '22px 22px',
            }}
          >
            <div className="flex items-center" style={{ gap: 12, marginBottom: 10 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: 'rgba(225,10,31,0.12)',
                  border: `1px solid ${RED}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Graduate, serif',
                  fontSize: 11,
                  color: RED,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                style={{
                  fontFamily: 'Graduate, serif',
                  fontSize: 20,
                  letterSpacing: '0.02em',
                  margin: 0,
                  color: '#fff',
                }}
              >
                {w.title}
              </h3>
            </div>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
              }}
            >
              {w.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
