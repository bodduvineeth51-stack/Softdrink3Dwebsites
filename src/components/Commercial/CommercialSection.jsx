import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import CommercialContent from './CommercialContent'
import VideoPlayer from './VideoPlayer'

// ── Feature data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 19H3c0-8.84 7.16-16 16-16 0 8.84-7.16 16-16 16" />
      </svg>
    ),
    name: 'Real Fruits',
    desc: 'Handpicked for real taste.',
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    name: 'Natural Flavors',
    desc: 'Made with natural essence.',
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    name: 'Zero Compromise',
    desc: 'No artificial colors or preservatives.',
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <polyline points="6,6 12,12 18,6" strokeLinejoin="round" />
        <polyline points="6,18 12,12 18,18" strokeLinejoin="round" />
      </svg>
    ),
    name: 'Chilled to Perfection',
    desc: 'For the ultimate refreshing experience.',
  },
]

// 8 static ambient particles — no CSS animation, zero compositor overhead.
// Pure GPU-promoted translucent dots give the atmospheric feel without CPU cost.
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 8  + (i * 11.5) % 82,
  y: 10 + (i * 13.7) % 78,
  size: 1.5 + (i % 3) * 0.8,
  opacity: 0.05 + (i % 4) * 0.025,
}))

// ── Component ─────────────────────────────────────────────────────────────────

export default function CommercialSection() {
  const sectionRef      = useRef(null)
  const videoRef        = useRef(null)
  const tiltWrapRef     = useRef(null)
  const progressBarRef  = useRef(null)
  const timeDisplayRef  = useRef(null)
  const lightSweepRef   = useRef(null)
  const floatRef        = useRef(null)
  const mouseTiltRaf = useRef(null)   // rAF gate for mouse parallax
  const isActiveRef  = useRef(false)  // true while Commercial is the visible section

  const labelRef           = useRef(null)
  const headingRef         = useRef(null)
  const subRef             = useRef(null)
  const btn1Ref            = useRef(null)
  const btn2Ref            = useRef(null)
  const featureLabelRef    = useRef(null)
  const featureHeadRef     = useRef(null)
  const featuresRef        = useRef([])
  const scrollIndicatorRef = useRef(null)

  const [videoSrc, setVideoSrc] = useState(null)

  // ── Pre-load video 2 s after mount ───────────────────────────────────────
  // Giving Hero frame loading a 2 s head-start means the video buffers quietly
  // in the background. By the time the user scrolls through two curtain reveals
  // (typically 8–20 s) it is fully ready, so video.play() never races a cold load.
  useEffect(() => {
    const t = setTimeout(
      () => setVideoSrc(`${import.meta.env.BASE_URL}video-asset/videoAssetCroped.mp4`),
      2000,
    )
    return () => clearTimeout(t)
  }, [])

  // ── Section visibility: video play/pause + background canvas control ──────
  //
  // videoSrc is included in the deps intentionally:
  //   IntersectionObserver fires immediately on observe() with the current state.
  //   When videoSrc arrives (2 s after mount) and the section is already visible,
  //   the observer is recreated → fires → calls play() with the now-ready src.
  //   Without this, a fast scroll to Commercial before 2 s leaves the video silent.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting
        const video = videoRef.current

        if (entry.isIntersecting) {
          window.dispatchEvent(new Event('canvas:pause'))

          if (video && videoSrc) {
            // Muted play is unconditionally allowed from async contexts.
            // Unmute immediately after the play() Promise resolves (first frame ready).
            video.muted = true
            video.play()
              .then(() => { video.muted = false })
              .catch(() => {})
          }
        } else {
          window.dispatchEvent(new Event('canvas:resume'))

          if (video) {
            video.pause()
            video.currentTime = 0
            video.muted = true
          }
        }
      },
      { threshold: 0.5 },
    )

    obs.observe(section)
    return () => obs.disconnect()
  }, [videoSrc])

  // ── video:pause global event — fired by Contact section when it becomes active.
  // The IntersectionObserver above can't detect that Commercial is visually covered
  // by Contact (same bounding rect inside the pinned container), so Contact signals
  // us directly via this event.
  useEffect(() => {
    const stopVideo = () => {
      const video = videoRef.current
      if (!video) return
      video.pause()
      video.currentTime = 0
      video.muted = true
      isActiveRef.current = false
    }

    window.addEventListener('video:pause', stopVideo)
    return () => window.removeEventListener('video:pause', stopVideo)
  }, [])

  // ── Entry animation — IntersectionObserver at 80% visibility ─────────────
  // (ScrollTrigger positions are meaningless inside a pinned curtain container)
  useEffect(() => {
    gsap.set(
      [
        labelRef.current, headingRef.current, subRef.current,
        btn1Ref.current, btn2Ref.current,
        featureLabelRef.current, featureHeadRef.current,
        ...featuresRef.current.filter(Boolean),
        scrollIndicatorRef.current,
      ].filter(Boolean),
      { opacity: 0, y: 28 },
    )

    let fired = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true
          observer.disconnect()

          // Light sweep across video glass frame
          gsap.to(lightSweepRef.current, {
            x: '220%', duration: 1.5, delay: 0.3, ease: 'power2.inOut',
          })

          // Text cascade
          const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })
          tl.to(labelRef.current,        { opacity: 1, y: 0, duration: 0.7 })
            .to(headingRef.current,       { opacity: 1, y: 0, duration: 0.95 }, '-=0.4')
            .to(subRef.current,           { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
            .to([btn1Ref.current, btn2Ref.current].filter(Boolean), {
              opacity: 1, y: 0, duration: 0.65, stagger: 0.1,
            }, '-=0.55')
            .to(featureLabelRef.current,  { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
            .to(featureHeadRef.current,   { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
            .to(featuresRef.current.filter(Boolean), {
              opacity: 1, y: 0, duration: 0.5, stagger: 0.09,
            }, '-=0.45')
            .to(scrollIndicatorRef.current, { opacity: 0.45, y: 0, duration: 0.5 }, '-=0.2')

          // Floating tween on the video
          floatRef.current = gsap.to(tiltWrapRef.current, {
            y: -10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9,
          })
        }
      },
      { threshold: 0.8 },
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      floatRef.current?.kill()
    }
  }, [])

  // ── Mouse parallax — rAF-gated so GSAP fires once per frame max ──────────
  const handleMouseMove = useCallback((e) => {
    if (mouseTiltRaf.current) return   // skip if a frame is already queued

    const cx = e.clientX
    const cy = e.clientY

    mouseTiltRaf.current = requestAnimationFrame(() => {
      mouseTiltRaf.current = null

      const section = sectionRef.current
      const tilt    = tiltWrapRef.current
      if (!section || !tilt) return

      const { left, top, width, height } = section.getBoundingClientRect()
      const x = (cx - left) / width  - 0.5
      const y = (cy - top)  / height - 0.5

      gsap.to(tilt, {
        rotateY:  x * 7,
        rotateX: -y * 4,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (mouseTiltRaf.current) {
      cancelAnimationFrame(mouseTiltRaf.current)
      mouseTiltRaf.current = null
    }
    gsap.to(tiltWrapRef.current, {
      rotateY: 0, rotateX: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)',
    })
  }, [])

  // ── Watch Again ───────────────────────────────────────────────────────────
  const handleWatchAgain = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => {})
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="commercial"
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden bg-[#050505] flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background gradients ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-10%', left: '28%',
          width: '58%', height: '65%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(121,255,59,0.045) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '35%', height: '45%',
          background: 'linear-gradient(135deg, rgba(121,255,59,0.022) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
        }} />
      </div>

      {/* Static ambient particles — no CSS animation, GPU-promoted dots only */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#79FF3B]"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              opacity: p.opacity,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ── Main content row ── */}
      <div className="flex-1 flex items-center gap-10 lg:gap-14 px-10 lg:px-16 pt-20 min-h-0">
        <CommercialContent
          labelRef={labelRef}
          headingRef={headingRef}
          subRef={subRef}
          btn1Ref={btn1Ref}
          btn2Ref={btn2Ref}
          onWatchAgain={handleWatchAgain}
        />

        <div
          className="flex-1 flex items-center justify-center min-h-0 py-4"
          style={{ perspective: '900px' }}
        >
          <VideoPlayer
            tiltWrapRef={tiltWrapRef}
            videoRef={videoRef}
            progressBarRef={progressBarRef}
            timeDisplayRef={timeDisplayRef}
            lightSweepRef={lightSweepRef}
            src={videoSrc}
          />
        </div>
      </div>

      {/* ── Feature grid ── */}
      <div className="px-10 lg:px-16 pb-6 lg:pb-8 flex-shrink-0">
        <div className="border-t border-white/[0.05] mb-5" />

        <div className="flex flex-col items-center mb-4 gap-1">
          <span ref={featureLabelRef} className="font-inter font-medium text-[#79FF3B] text-[9px] tracking-[0.3em] uppercase">
            What's Inside
          </span>
          <h3 ref={featureHeadRef} className="font-syne font-bold text-white text-sm lg:text-base tracking-tight">
            Real Ingredients. Real Refreshment.
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.name}
              ref={el => { featuresRef.current[i] = el }}
              className="flex items-start gap-3"
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#79FF3B]"
                style={{ border: '1px solid rgba(121,255,59,0.22)', background: 'rgba(121,255,59,0.06)' }}
              >
                {f.icon}
              </div>
              <div>
                <p className="font-inter font-semibold text-white text-[12px] leading-snug">{f.name}</p>
                <p className="font-inter font-light text-white/38 text-[11px] leading-snug mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={scrollIndicatorRef} className="flex flex-col items-center gap-2 mt-4 pointer-events-none">
          <div className="w-px h-5 bg-gradient-to-b from-white/20 to-transparent" />
          <span className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/25">Scroll</span>
        </div>
      </div>
    </section>
  )
}
