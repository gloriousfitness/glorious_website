import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const WORD = 'GLORIOUS'
const DURATION_MS = 3200
const FLIP_HOLD_MS = 650
const SWIPE_MS = 900
const MORPH_MS = 520
const DOT_STEP_MS = 200
const DOT_HOLD_MS = 150
// approx px width of 3 dots + 2 gaps at max size: 14+7+7 + 8+8 = 44
const DOT_CLUSTER_W = 44

type Props = { onDone: () => void; onVideoStart?: () => void }

export default function Loading({ onDone, onVideoStart }: Props) {
  const [progress, setProgress] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [swiping, setSwiping] = useState(false)
  const [fontReady, setFontReady] = useState(false)
  const [dotPhase, setDotPhase] = useState(0)
  const [morphing, setMorphing] = useState(false)
  const [morphed, setMorphed] = useState(false)
  const rafRef = useRef(0)
  const startRef = useRef(0)
  const videoStartedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    document.fonts.load('1em Graduate').then(() => {
      if (!cancelled) setFontReady(true)
    }).catch(() => {
      if (!cancelled) setFontReady(true)
    })
    const fallback = setTimeout(() => { if (!cancelled) setFontReady(true) }, 1200)
    return () => { cancelled = true; clearTimeout(fallback) }
  }, [])

  // Dot cycling → when font ready at phase 2, trigger morph
  useEffect(() => {
    if (morphing || morphed) return
    const atThird = dotPhase === 2
    const delay = atThird && fontReady ? DOT_HOLD_MS : DOT_STEP_MS
    const t = setTimeout(() => {
      if (atThird && fontReady) {
        setMorphing(true)
        setTimeout(() => setMorphed(true), MORPH_MS)
      } else {
        setDotPhase(p => (p + 1) % 3)
      }
    }, delay)
    return () => clearTimeout(t)
  }, [dotPhase, fontReady, morphing, morphed])

  useEffect(() => {
    if (!morphed) return
    startRef.current = performance.now()
    const tick = (t: number) => {
      const elapsed = t - startRef.current
      const u = Math.min(1, elapsed / DURATION_MS)
      const p = u < 0.8 ? (u / 0.8) * 70 : 70 + ((u - 0.8) / 0.2) * 30
      setProgress(Math.min(100, p))
      if (!videoStartedRef.current && p >= 95) {
        videoStartedRef.current = true
        onVideoStart?.()
      }
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setFlipped(true)
          setTimeout(() => {
            setSwiping(true)
            setTimeout(onDone, SWIPE_MS)
          }, FLIP_HOLD_MS)
        }, 180)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onDone, morphed])

  const filledCount = Math.min(WORD.length, Math.floor((progress * WORD.length) / 100 + 0.0001))

  // Bar target dimensions (resolved at render, used as morph target)
  const barTransition = [
    `width ${MORPH_MS}ms cubic-bezier(0.65,0,0.35,1)`,
    `height ${MORPH_MS}ms cubic-bezier(0.65,0,0.35,1)`,
    `border-radius ${MORPH_MS}ms ease`,
    `background-color ${MORPH_MS}ms ease`,
    `gap ${MORPH_MS}ms ease`,
    'opacity 320ms ease',
  ].join(', ')

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: flipped ? RED : '#000',
        transition: 'background-color 480ms cubic-bezier(0.65,0,0.35,1)',
        transform: swiping ? 'translateY(-100%)' : 'translateY(0)',
        transitionProperty: 'background-color, transform',
        transitionDuration: `480ms, ${SWIPE_MS}ms`,
        transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1), cubic-bezier(0.76,0,0.24,1)',
        boxShadow: swiping ? '0 -30px 60px rgba(0,0,0,0.5)' : 'none',
        zIndex: 2000,
      }}
    >
      {flipped && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(120% 80% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)',
          }}
        />
      )}

      <div
        className="select-none leading-none flex"
        style={{
          fontFamily: 'Graduate, serif',
          fontSize: 'clamp(44px, 9vw, 140px)',
          letterSpacing: '0.06em',
          opacity: morphing ? 1 : 0,
          transition: `opacity ${MORPH_MS}ms ease`,
        }}
      >
        {WORD.split('').map((ch, i) => {
          const isFilled = i < filledCount
          let color: string, stroke: string
          if (flipped) {
            color = '#000'
            stroke = '#000'
          } else if (isFilled) {
            color = RED
            stroke = RED
          } else {
            color = 'transparent'
            stroke = RED
          }
          return (
            <span
              key={i}
              style={{
                color,
                WebkitTextStroke: `clamp(1.4px, 0.25vw, 3.5px) ${stroke}`,
                transition:
                  'color 340ms cubic-bezier(0.65,0,0.35,1), -webkit-text-stroke-color 340ms cubic-bezier(0.65,0,0.35,1)',
                padding: '0 1px',
                display: 'inline-block',
              }}
            >
              {ch}
            </span>
          )
        })}
      </div>

      {/*
        Single container morphs: dots cluster → bar track
        overflow:hidden clips dots as height squishes
        dots fade out mid-morph; fill appears after morphed
      */}
      <div
        style={{
          marginTop: 'clamp(26px, 3vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          // morph from dot cluster dimensions → bar dimensions
          width: morphing ? 'clamp(200px, 28vw, 480px)' : `${DOT_CLUSTER_W}px`,
          height: morphing ? 'clamp(3px, 0.35vw, 6px)' : 'clamp(10px, 1vw, 14px)',
          borderRadius: morphing ? '3px' : '8px',
          backgroundColor: morphing ? 'rgba(255,255,255,0.10)' : 'transparent',
          opacity: flipped ? 0 : 1,
          transition: barTransition,
          position: 'relative',
        }}
      >
        {/* Dots — fade out as container squishes */}
        {!morphed && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              position: 'absolute',
              opacity: morphing ? 0 : 1,
              transition: `opacity ${MORPH_MS * 0.4}ms ease`,
            }}
          >
            {[0, 1, 2].map(i => {
              const big = dotPhase === i
              const size = big ? 'clamp(10px, 1vw, 14px)' : 'clamp(5px, 0.5vw, 7px)'
              return (
                <div
                  key={i}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: RED,
                    transition: 'width 260ms cubic-bezier(0.34,1.56,0.64,1), height 260ms cubic-bezier(0.34,1.56,0.64,1)',
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Progress fill — appears only after morph complete */}
        {morphed && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              background: RED,
              borderRadius: '3px',
              transition: 'width 120ms linear',
            }}
          />
        )}
      </div>
    </div>
  )
}
