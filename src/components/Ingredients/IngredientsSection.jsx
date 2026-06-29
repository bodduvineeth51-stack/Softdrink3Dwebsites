import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useCanvasAnimation } from '../../hooks/useCanvasAnimation'
import IngredientsContent from './IngredientsContent'

export default function IngredientsSection() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const buttonRef = useRef(null)
  const scrollRef = useRef(null)

  const { isLoaded } = useCanvasAnimation(canvasRef, {
    totalFrames: 240,
    loopDuration: 7000,
    frameFolder: '/ingredients-frames',
  })

  // Initialise text elements invisible — GSAP owns these styles
  useEffect(() => {
    gsap.set(
      [labelRef.current, headingRef.current, subheadingRef.current, buttonRef.current, scrollRef.current].filter(Boolean),
      { opacity: 0, y: 38 },
    )
  }, [])

  // Text entrance via IntersectionObserver (not ScrollTrigger).
  //
  // Why IntersectionObserver and not ScrollTrigger here?
  // This section lives inside a curtain panel that starts at translateY(100%).
  // The parent container has overflow:hidden, so the browser clips the panel to 0
  // visibility until it slides into view. IntersectionObserver respects that clipping
  // and fires correctly at threshold 0.8 (80% of the canvas is in the visible area =
  // curtain is 80% complete). ScrollTrigger trigger positions would be wrong because
  // the section's "scroll position" is fixed inside the pinned container.
  useEffect(() => {
    if (!isLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    let fired = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true
          observer.disconnect()

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to(labelRef.current, { y: 0, opacity: 1, duration: 0.75 })
            .to(headingRef.current, { y: 0, opacity: 1, duration: 1.05 }, '-=0.45')
            .to(subheadingRef.current, { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' }, '-=0.7')
            .to(buttonRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.55')
            .to(scrollRef.current, { y: 0, opacity: 0.45, duration: 0.65, ease: 'power2.out' }, '-=0.25')
        }
      },
      { threshold: 0.8 },
    )

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [isLoaded])

  return (
    <section
      id="ingredients"
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden bg-[#050505]"
    >
      {/* ── Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ── Left vignette ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg,' +
            'rgba(5,5,5,0.80) 0%,' +
            'rgba(5,5,5,0.50) 30%,' +
            'rgba(5,5,5,0.12) 58%,' +
            'rgba(5,5,5,0.00) 100%)',
        }}
      />

      {/* ── Top / bottom atmospheric gradient ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg,' +
            'rgba(5,5,5,0.45) 0%,' +
            'rgba(5,5,5,0.00) 18%,' +
            'rgba(5,5,5,0.00) 78%,' +
            'rgba(5,5,5,0.55) 100%)',
        }}
      />

      {/* ── UI Overlay ── */}
      <IngredientsContent
        labelRef={labelRef}
        headingRef={headingRef}
        subheadingRef={subheadingRef}
        buttonRef={buttonRef}
        scrollRef={scrollRef}
      />
    </section>
  )
}
