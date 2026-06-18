const RED = '#E10A1F'

const NAV_LINKS: Array<{ label: string; anchor: string }> = [
  { label: 'About Us', anchor: 'about' },
  { label: 'Gallery', anchor: 'gallery' },
  { label: 'Coach', anchor: 'coach' },
  { label: 'Contact Us', anchor: 'contact' },
]

type Props = { open: boolean; linksVisible: boolean; onClose: () => void }

export default function NavPanel({ open, linksVisible, onClose }: Props) {
  const go = (anchor: string) => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById(anchor)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 260)
  }

  return (
    <div
      aria-hidden={!open}
      className="fixed top-0 right-0 bottom-0 flex flex-col md:hidden"
      style={{
        background: '#0d0d10',
        width: '100%',
        maxWidth: 430,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: open
          ? 'transform 450ms cubic-bezier(0.22,1,0.36,1)'
          : 'transform 400ms cubic-bezier(0.55,0,1,0.45)',
        zIndex: 1050,
        willChange: 'transform',
      }}
    >
      <div style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px 18px' }}>
          <div className="flex flex-row items-center" style={{ gap: 7 }}>
            <img
              src="/glorious-logo.webp"
              alt="Glorious logo"
              style={{ height: 40, width: 40, objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="flex flex-col" style={{ gap: 1 }}>
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 24,
                  color: RED,
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  WebkitTextStroke: `0.5px ${RED}`,
                }}
              >
                GLORIOUS
              </div>
              <div
                style={{
                  fontFamily: 'Freshman, serif',
                  fontSize: 9,
                  color: '#fff',
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                FITNESS FACTORY
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 32px 0' }}>
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.label}
            href={`#${link.anchor}`}
            onClick={(e) => {
              e.preventDefault()
              go(link.anchor)
            }}
            style={{
              fontFamily: 'Freshman, serif',
              fontSize: 34,
              lineHeight: 1,
              color: '#fff',
              textDecoration: 'none',
              display: 'block',
              padding: '19px 0',
              borderBottom: i < NAV_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              opacity: linksVisible ? 1 : 0,
              transform: linksVisible ? 'translateY(0)' : 'translateY(-13px)',
              transition: linksVisible
                ? `opacity 380ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 380ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`
                : 'opacity 130ms ease, transform 130ms ease',
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: '0 32px 56px',
          opacity: linksVisible ? 1 : 0,
          transition: `opacity 380ms ease ${3 * 90 + 120}ms`,
        }}
      >
        <div style={{ width: 32, height: 2, background: RED, borderRadius: 2 }} />
      </div>
    </div>
  )
}
