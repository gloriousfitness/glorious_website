import { useEffect, useRef, useState } from 'react'
import MenuButton from '../components/MenuButton'
import NavPanel from '../components/NavPanel'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import GallerySection from '../components/GallerySection'
import CoachSection from '../components/CoachSection'
import ContactSection from '../components/ContactSection'

const RED = '#E10A1F'

const NAV_LINKS = [
  { label: 'About Us', anchor: 'about' },
  { label: 'Gallery', anchor: 'gallery' },
  { label: 'Coach', anchor: 'coach' },
  { label: 'Contact Us', anchor: 'contact' },
]

function DesktopNavLink({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontFamily: 'Graduate, serif',
        fontSize: 11,
        color: hovered ? '#fff' : 'rgba(255,255,255,0.62)',
        textDecoration: 'none',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transition: 'color 200ms ease',
        paddingBottom: 3,
      }}
    >
      {label}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 1,
          width: '100%',
          background: RED,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1)',
          display: 'block',
        }}
      />
    </a>
  )
}

export default function Home({ booted }: { booted: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [linksVisible, setLinksVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenuOpen(true)
    openTimer.current = window.setTimeout(() => setLinksVisible(true), 430)
  }
  const closeMenu = () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    setLinksVisible(false)
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 160)
  }
  const toggle = menuOpen ? closeMenu : openMenu

  const goContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Desktop navbar — hidden on mobile */}
      <div
        className="hidden md:flex items-center justify-between fixed left-0 right-0"
        style={{
          zIndex: 1000,
          margin: '0 auto',
          width: scrolled ? '75%' : '100%',
          top: scrolled ? 14 : 0,
          padding: scrolled ? '11px 28px' : '14px 44px',
          background: scrolled ? 'rgba(13,13,16,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
          border: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          borderRadius: scrolled ? 40 : 0,
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.45)' : 'none',
          transition: [
            'width 520ms cubic-bezier(0.22,1,0.36,1)',
            'top 520ms cubic-bezier(0.22,1,0.36,1)',
            'padding 520ms cubic-bezier(0.22,1,0.36,1)',
            'background 300ms ease',
            'border-color 300ms ease',
            'border-radius 520ms cubic-bezier(0.22,1,0.36,1)',
            'box-shadow 300ms ease',
          ].join(', '),
        }}
      >
        {/* Wordmark — fixed size, never inflates */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex flex-row items-center"
          style={{ gap: 8, textDecoration: 'none', flexShrink: 0 }}
        >
          <img
            src="/glorious-logo.png"
            alt="Glorious logo"
            style={{ height: 34, width: 34, objectFit: 'contain', flexShrink: 0 }}
          />
          <div className="flex flex-col" style={{ gap: 2 }}>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 17,
                color: RED,
                letterSpacing: '0.08em',
                lineHeight: 1,
              }}
            >
              GLORIOUS
            </div>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 7,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.22em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              FITNESS CENTER
            </div>
          </div>
        </a>

        {/* Nav links */}
        <nav className="flex items-center" style={{ gap: 36 }}>
          {NAV_LINKS.map((link) => (
            <DesktopNavLink
              key={link.label}
              label={link.label}
              onClick={() => scrollToAnchor(link.anchor)}
              href={`#${link.anchor}`}
            />
          ))}
        </nav>
      </div>

      <Hero onCta={goContact} booted={booted} />
      <AboutSection />
      <GallerySection />
      <CoachSection />
      <ContactSection />

      {/* Sticky compact header — mobile only */}
      <div
        className="fixed flex items-center justify-between md:hidden"
        style={{
          top: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: '0 auto',
          padding: '12px 24px',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          zIndex: 1000,
          background: scrolled ? 'rgba(13,13,16,0.78)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 220ms ease, border-color 220ms ease',
          pointerEvents: scrolled ? 'auto' : 'none',
          opacity: scrolled ? 1 : 0,
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex flex-row items-center"
          style={{ gap: 7, textDecoration: 'none' }}
        >
          <img
            src="/glorious-logo.png"
            alt="Glorious logo"
            style={{ height: 32, width: 32, objectFit: 'contain', flexShrink: 0 }}
          />
          <div className="flex flex-col" style={{ gap: 1 }}>
            <div
              style={{
                fontFamily: 'Graduate, serif',
                fontSize: 18,
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
                fontFamily: 'Graduate, serif',
                fontSize: 7.5,
                color: '#fff',
                letterSpacing: '0.18em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              FITNESS CENTER
            </div>
          </div>
        </a>
        <div style={{ width: 44, height: 44 }} />
      </div>

      {/* Floating hamburger — mobile only */}
      <div
        className="fixed md:hidden"
        style={{
          top: 'max(44px, env(safe-area-inset-top))',
          right: 24,
          zIndex: 1100,
          maxWidth: 430,
          margin: '0 auto',
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="relative flex justify-end"
          style={{ maxWidth: 430, margin: '0 auto', pointerEvents: 'auto' }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <MenuButton open={menuOpen} onClick={toggle} />
          </div>
        </div>
      </div>

      <NavPanel open={menuOpen} linksVisible={linksVisible} onClose={closeMenu} />
    </>
  )
}
