const RED = '#E10A1F'

const COACHES = [
  {
    name: 'Marcus Vale',
    role: 'Head of Strength',
    bio: 'Powerlifter · 12 yrs · Programs squat, bench, deadlift cycles for raw strength.',
    grad: ['#3a3f47', '#1c1e24'] as [string, string],
  },
  {
    name: 'Ines Korr',
    role: 'Conditioning',
    bio: 'Ex-CrossFit Regional · GPP, work capacity, engine work for endurance under load.',
    grad: ['#7a1018', '#2a0508'] as [string, string],
  },
  {
    name: 'Rafe Okoye',
    role: 'Bodybuilding',
    bio: 'IFBB Pro · Hypertrophy, contest prep, posing. Detail-obsessed programming.',
    grad: ['#6b4a2a', '#291c10'] as [string, string],
  },
]

export default function CoachSection() {
  return (
    <section
      id="coach"
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
        1-on-1 personal training
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
        Co<span style={{ color: RED }}>a</span>ch.
      </h2>

      <div className="flex flex-col" style={{ marginTop: 28, gap: 16 }}>
        {COACHES.map((c) => (
          <div
            key={c.name}
            style={{
              background: '#161618',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: 18,
              boxShadow: '0 18px 40px -22px rgba(0,0,0,0.7)',
            }}
          >
            <div className="flex" style={{ gap: 16 }}>
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  width: 88,
                  height: 110,
                  borderRadius: 12,
                  background: `linear-gradient(140deg, ${c.grad[0]} 0%, ${c.grad[1]} 100%)`,
                  boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'repeating-linear-gradient(115deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 9px)',
                    mixBlendMode: 'overlay',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    bottom: 8,
                    left: 8,
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  PHOTO
                </div>
              </div>

              <div className="flex flex-col" style={{ flex: 1, gap: 4 }}>
                <div
                  style={{
                    fontFamily: 'Graduate, serif',
                    fontSize: 8.5,
                    letterSpacing: '0.22em',
                    color: RED,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  {c.role}
                </div>
                <h3
                  style={{
                    fontFamily: 'Graduate, serif',
                    fontSize: 22,
                    letterSpacing: '0.02em',
                    margin: 0,
                    color: '#fff',
                    lineHeight: 1.1,
                  }}
                >
                  {c.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, system-ui',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.7)',
                    margin: '6px 0 0',
                  }}
                >
                  {c.bio}
                </p>
              </div>
            </div>

            <button
              style={{
                marginTop: 16,
                width: '100%',
                height: 40,
                borderRadius: 999,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                fontFamily: 'Inter, system-ui',
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
