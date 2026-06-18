import { useEffect, useRef, useState } from 'react'

const RED = '#E10A1F'
const WORD = 'GLORIOUS'
const FLIP_HOLD_MS = 650
const SWIPE_MS = 900
const MORPH_MS = 520
const DOT_STEP_MS = 200
const DOT_HOLD_MS = 150
const BUFFER_TARGET = 0.5 // 50% of hero video must be buffered
const SAFETY_MS = 20000 // fallback if buffer never reaches target
const MIN_HOLD_MS = 600 // floor so bar never snaps instantly to 100
// approx px width of 3 dots + 2 gaps at max size: 14+7+7 + 8+8 = 44
const DOT_CLUSTER_W = 44

type Props = { onDone: () => void; onVideoStart?: () => void; videoSrc?: string }

export default function Loading({ onDone, onVideoStart, videoSrc = '/hero.mp4' }: Props) {
  const [progress, setProgress] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [swiping, setSwiping] = useState(false)
  const [fontReady, setFontReady] = useState(false)
  const [dotPhase, setDotPhase] = useState(0)
  const [morphing, setMorphing] = useState(false)
  const [morphed, setMorphed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef(0)
  const startRef = useRef(0)
  const videoStartedRef = useRef(false)
  const bufferedFracRef = useRef(0)
  const reachedTargetRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    document.fonts.load('1em Freshman').then(() => {
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

  // Track real buffered fraction of hero video
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const measure = () => {
      const dur = v.duration
      if (!isFinite(dur) || dur <= 0) return
      let end = 0
      for (let i = 0; i < v.buffered.length; i++) {
        end = Math.max(end, v.buffered.end(i))
      }
      const frac = Math.min(1, end / dur)
      if (frac > bufferedFracRef.current) bufferedFracRef.current = frac
      if (!reachedTargetRef.current && frac >= BUFFER_TARGET) {
        reachedTargetRef.current = true
      }
    }
    const onCanPlayThrough = () => {
      bufferedFracRef.current = Math.max(bufferedFracRef.current, BUFFER_TARGET)
      reachedTargetRef.current = true
    }
    v.addEventListener('progress', measure)
    v.addEventListener('loadedmetadata', measure)
    v.addEventListener('canplaythrough', onCanPlayThrough)
    // safety: never block forever
    const safety = setTimeout(() => {
      bufferedFracRef.current = Math.max(bufferedFracRef.current, BUFFER_TARGET)
      reachedTargetRef.current = true
    }, SAFETY_MS)
    try { v.load() } catch {}
    return () => {
      v.removeEventListener('progress', measure)
      v.removeEventListener('loadedmetadata', measure)
      v.removeEventListener('canplaythrough', onCanPlayThrough)
      clearTimeout(safety)
    }
  }, [])

  useEffect(() => {
    if (!morphed) return
    startRef.current = performance.now()
    let pRef = 0
    const tick = (t: number) => {
      const elapsed = t - startRef.current
      // map buffered 0..BUFFER_TARGET → 0..100
      const bufP = Math.min(100, (bufferedFracRef.current / BUFFER_TARGET) * 100)
      // min hold ensures bar visually fills even when video is cached
      const holdCeil = Math.min(100, (elapsed / MIN_HOLD_MS) * 100)
      const target = Math.min(bufP, holdCeil)
      pRef = pRef + (target - pRef) * 0.18
      if (target - pRef < 0.3 && target > pRef) pRef = target
      setProgress(pRef)
      if (!videoStartedRef.current && reachedTargetRef.current && elapsed >= MIN_HOLD_MS) {
        videoStartedRef.current = true
        onVideoStart?.()
      }
      const done = reachedTargetRef.current && elapsed >= MIN_HOLD_MS && pRef >= 99.5
      if (!done) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setProgress(100)
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
  }, [onDone, onVideoStart, morphed])

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
      {/* Hidden prefetch video — drives real buffered progress.
          Browser caches the bytes so the visible <Hero> reuses them. */}
      <video
        ref={videoRef}
        src={videoSrc}
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />

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
          fontFamily: 'Freshman, serif',
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
