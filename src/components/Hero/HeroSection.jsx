import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFrameAnimation } from '../../hooks/useFrameAnimation'
import Navbar from '../Navbar/Navbar'
import HeroContent from './HeroContent'

export default function HeroSection() {
  const canvasRef = useRef(null)
  const navRef = useRef(null)
  const loadingRef = useRef(null)
  const progressBarRef = useRef(null)
  const progressTextRef = useRef(null)

  // Per-element refs for GSAP — no class-name targeting needed
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const buttonsRef = useRef([])
  const scrollRef = useRef(null)

  const { isLoaded, loadProgress } = useFrameAnimation(canvasRef)

  // Live-update the loading progress bar via DOM (avoids React re-render every tick)
  useEffect(() => {
    const pct = Math.round(loadProgress * 100)
    if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`
    if (progressTextRef.current) progressTextRef.current.textContent = `${pct}%`
  }, [loadProgress])

  // Set all animated elements invisible before first paint
  useEffect(() => {
    gsap.set(navRef.current, { y: -20, opacity: 0 })
    gsap.set(
      [badgeRef.current, headingRef.current, subheadingRef.current].filter(Boolean),
      { y: 45, opacity: 0 },
    )
    gsap.set(buttonsRef.current.filter(Boolean), { y: 25, opacity: 0 })
    gsap.set(scrollRef.current, { y: 12, opacity: 0 })
  }, [])

  // Entrance animation sequence — fires once all 240 frames are cached
  useEffect(() => {
    if (!isLoaded) return

    // 1. Fade the loading screen out
    gsap.to(loadingRef.current, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => {
        if (loadingRef.current) loadingRef.current.style.display = 'none'

        // 2. Staggered entrance cascade
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(navRef.current, { y: 0, opacity: 1, duration: 0.9 })
          .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')
          .to(headingRef.current, { y: 0, opacity: 1, duration: 1.05 }, '-=0.55')
          .to(subheadingRef.current, { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' }, '-=0.75')
          .to(buttonsRef.current.filter(Boolean), {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.13,
          }, '-=0.6')
          .to(scrollRef.current, { y: 0, opacity: 0.45, duration: 0.65, ease: 'power2.out' }, '-=0.3')
      },
    })
  }, [isLoaded])

  // Stable ref setter for button array
  const setButtonRef = (index) => (el) => {
    buttonsRef.current[index] = el
  }

  return (
    <section
      id="home"
      className="relative w-screen h-screen overflow-hidden bg-[#050505]"
    >
      {/* ── Canvas — full-screen frame animation ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ── Cinematic gradient overlay for text legibility ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg,' +
            'rgba(5,5,5,0.62) 0%,' +
            'rgba(5,5,5,0.05) 22%,' +
            'rgba(5,5,5,0.00) 48%,' +
            'rgba(5,5,5,0.88) 100%)',
        }}
      />

      {/* ── Navigation ── */}
      <Navbar ref={navRef} />

      {/* ── Hero text & CTAs ── */}
      <HeroContent
        badgeRef={badgeRef}
        headingRef={headingRef}
        subheadingRef={subheadingRef}
        setButtonRef={setButtonRef}
        scrollRef={scrollRef}
      />

      {/* ── Loading screen (sits above everything until frames are ready) ── */}
      <div
        ref={loadingRef}
        className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
      >
        {/* Brand mark */}
        <p className="font-syne font-extrabold text-3xl lg:text-4xl tracking-widest mb-2 select-none">
          Ri<span className="text-[#79FF3B]">Doy</span>
        </p>
        <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-white/20 mb-12 select-none">
          Premium Refreshment
        </p>

        {/* Progress bar */}
        <div className="w-48 lg:w-60">
          <div className="h-[1px] w-full bg-white/10 overflow-hidden mb-3">
            <div
              ref={progressBarRef}
              className="h-full bg-[#79FF3B] rounded-full"
              style={{ width: '0%', transition: 'width 80ms linear' }}
            />
          </div>
          <p
            ref={progressTextRef}
            className="text-center font-inter text-[10px] tracking-[0.25em] uppercase text-white/22 select-none"
          >
            0%
          </p>
        </div>
      </div>
    </section>
  )
}
