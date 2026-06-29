import { useRef, useEffect } from 'react'
import gsap from 'gsap'

// Stable geometry — computed once at module load, never changes
const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x:  (i * 37.3 + 8) % 92,
  y:  (i * 53.7 + 5) % 88,
  size: 1.2 + (i % 5) * 0.65,
  opacity: 0.08 + (i % 6) * 0.05,
  dur:   6  + (i % 7) * 1.8,
  delay: (i % 9) * 0.6,
  dy:   20  + (i % 5) * 12,
  dx:   (i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 4),
}))

const BUBBLES = Array.from({ length: 7 }, (_, i) => ({
  id: i, x: 10 + i * 13, y: 25 + (i % 3) * 22, size: 5 + (i % 3) * 4,
}))

export default function ContactBackground() {
  const fog1Ref      = useRef(null)
  const fog2Ref      = useRef(null)
  const fog3Ref      = useRef(null)
  const ray1Ref      = useRef(null)
  const ray2Ref      = useRef(null)
  const parallaxRef  = useRef(null)
  const particleRefs = useRef([])
  const mouseRafRef  = useRef(null)

  /*
   * Single IntersectionObserver controls everything:
   *   • All GSAP tweens (fog drift, particle float, ray pulse) start ONLY when the
   *     Contact section enters the viewport and are killed when it leaves.
   *   • The window mouse listener is added/removed together with the tweens.
   *
   * Without this, all 30 tweens run continuously from page load even while
   * the user is on Hero, Ingredients or Commercial — a silent CPU drain.
   */
  useEffect(() => {
    let fogTweens      = []
    let particleTweens = []
    let rayTweens      = []
    let mouseBound     = false

    const handleMouse = (e) => {
      if (mouseRafRef.current) return
      const cx = e.clientX, cy = e.clientY
      mouseRafRef.current = requestAnimationFrame(() => {
        mouseRafRef.current = null
        if (!parallaxRef.current) return
        gsap.to(parallaxRef.current, {
          x: (cx / window.innerWidth  - 0.5) * 22,
          y: (cy / window.innerHeight - 0.5) * 12,
          duration: 1.6, ease: 'power2.out', overwrite: 'auto',
        })
      })
    }

    const startAll = () => {
      if (fogTweens.length > 0) return   // already running

      fogTweens = [
        gsap.to(fog1Ref.current, {
          x: '-42px', opacity: 0.28, duration: 22,
          ease: 'sine.inOut', yoyo: true, repeat: -1,
        }),
        gsap.to(fog2Ref.current, {
          x: '+36px', opacity: 0.22, duration: 27,
          ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 8,
        }),
        gsap.to(fog3Ref.current, {
          y: '-22px', x: '+18px', opacity: 0.18, duration: 19,
          ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3,
        }),
      ]

      particleTweens = particleRefs.current.filter(Boolean).map((el, i) => {
        const p = PARTICLES[i] ?? PARTICLES[0]
        return gsap.to(el, {
          y: `+=${p.dy}`, x: `+=${p.dx}`, opacity: p.opacity + 0.15,
          duration: p.dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: p.delay,
        })
      })

      rayTweens = [
        gsap.to(ray1Ref.current, { opacity: 0.07, duration: 7,  ease: 'sine.inOut', yoyo: true, repeat: -1 }),
        gsap.to(ray2Ref.current, { opacity: 0.05, duration: 10, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 }),
      ]

      if (!mouseBound) {
        window.addEventListener('mousemove', handleMouse, { passive: true })
        mouseBound = true
      }
    }

    const stopAll = () => {
      ;[...fogTweens, ...particleTweens, ...rayTweens].forEach(t => t.kill())
      fogTweens = []; particleTweens = []; rayTweens = []

      if (mouseBound) {
        window.removeEventListener('mousemove', handleMouse)
        mouseBound = false
      }
      if (mouseRafRef.current) {
        cancelAnimationFrame(mouseRafRef.current)
        mouseRafRef.current = null
      }
    }

    // Observe any stable element inside this component — fog1 works fine.
    // overflow:hidden on the curtain container clips it to zero when Contact is
    // not the active panel, so IntersectionObserver correctly sees it as hidden.
    const target = fog1Ref.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? startAll() : stopAll() },
      { threshold: 0.05 },
    )

    observer.observe(target)

    return () => {
      stopAll()
      observer.disconnect()
    }
  }, [])   // runs once — closure is stable

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Centre-top spotlight — static, no animation */}
      <div style={{
        position: 'absolute', top: '-8%', left: '15%',
        width: '70%', height: '60%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(121,255,59,0.055) 0%, rgba(47,174,90,0.02) 50%, transparent 75%)',
        filter: 'blur(35px)',
      }} />

      {/* Fog 1 — will be GSAP-animated, pre-promote to GPU layer */}
      <div ref={fog1Ref} style={{
        position: 'absolute', bottom: '5%', left: '-8%',
        width: '48%', height: '55%',
        background: 'radial-gradient(ellipse at 25% 75%, rgba(47,174,90,0.22) 0%, rgba(121,255,59,0.06) 40%, transparent 70%)',
        filter: 'blur(55px)', opacity: 0.15,
        willChange: 'transform, opacity',
      }} />

      {/* Fog 2 */}
      <div ref={fog2Ref} style={{
        position: 'absolute', bottom: '8%', right: '-8%',
        width: '42%', height: '50%',
        background: 'radial-gradient(ellipse at 75% 65%, rgba(47,174,90,0.18) 0%, rgba(121,255,59,0.05) 40%, transparent 70%)',
        filter: 'blur(58px)', opacity: 0.12,
        willChange: 'transform, opacity',
      }} />

      {/* Fog 3 */}
      <div ref={fog3Ref} style={{
        position: 'absolute', bottom: '-4%', left: '28%',
        width: '44%', height: '32%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(121,255,59,0.14) 0%, transparent 70%)',
        filter: 'blur(42px)', opacity: 0.10,
        willChange: 'transform, opacity',
      }} />

      {/* Light ray 1 */}
      <div ref={ray1Ref} style={{
        position: 'absolute', top: '-15%', left: '12%',
        width: '80px', height: '70%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(121,255,59,0.05) 40%, rgba(121,255,59,0.07) 60%, transparent 100%)',
        filter: 'blur(12px)', transform: 'rotate(12deg)', opacity: 0.03,
        willChange: 'opacity',
      }} />

      {/* Light ray 2 */}
      <div ref={ray2Ref} style={{
        position: 'absolute', top: '-15%', right: '20%',
        width: '60px', height: '60%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(121,255,59,0.04) 50%, transparent 100%)',
        filter: 'blur(14px)', transform: 'rotate(-10deg)', opacity: 0.02,
        willChange: 'opacity',
      }} />

      {/* Vignette — static */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Parallax layer — moves as one unit on mouse move */}
      <div ref={parallaxRef} style={{ position: 'absolute', inset: '-5%', willChange: 'transform' }}>
        {PARTICLES.map((p, i) => (
          <div
            key={p.id}
            ref={el => { particleRefs.current[i] = el }}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: '#79FF3B',
              opacity: p.opacity,
              willChange: 'transform, opacity',
            }}
          />
        ))}

        {BUBBLES.map(b => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}%`, top: `${b.y}%`,
              width: b.size, height: b.size,
              borderRadius: '50%',
              border: '1px solid rgba(121,255,59,0.25)',
              background: 'rgba(121,255,59,0.04)',
              opacity: 0.25 + (b.id % 3) * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
