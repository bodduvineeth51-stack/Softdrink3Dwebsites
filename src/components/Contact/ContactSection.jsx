import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import ContactBackground from './ContactBackground'
import ContactContent    from './ContactContent'
import ContactForm       from './ContactForm'
import ContactFooter     from './ContactFooter'

export default function ContactSection() {
  const sectionRef = useRef(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // GSAP animation refs
  const labelRef    = useRef(null)
  const headingRef  = useRef(null)
  const lineRef     = useRef(null)
  const sub1Ref     = useRef(null)
  const sub2Ref     = useRef(null)
  const socialsRef  = useRef(null)
  const formWrapRef = useRef(null)

  // ── Pause background canvases when Contact is active ─────────────────────
  // (Hero + Ingredients are geometrically "visible" inside the pinned curtain
  // container even when this section is the top layer, so we signal manually.)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(new Event('canvas:pause'))
          window.dispatchEvent(new Event('video:pause'))   // stop Commercial video
        } else {
          window.dispatchEvent(new Event('canvas:resume'))
        }
      },
      { threshold: 0.5 },
    )

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  // ── Entry animation — IntersectionObserver at 80% visibility ─────────────
  // (ScrollTrigger positions are meaningless inside the pinned curtain stage.)
  useEffect(() => {
    const els = [
      labelRef.current, headingRef.current, lineRef.current,
      sub1Ref.current, sub2Ref.current, socialsRef.current,
      formWrapRef.current,
    ].filter(Boolean)

    gsap.set(els, { opacity: 0, y: 35 })

    let fired = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true
          observer.disconnect()

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.to(labelRef.current,   { opacity: 1, y: 0, duration: 0.75 })
            .to(headingRef.current,  { opacity: 1, y: 0, duration: 1.05 }, '-=0.45')
            .to(lineRef.current,     { opacity: 1, y: 0, duration: 0.5  }, '-=0.65')
            .to(sub1Ref.current,     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
            .to(sub2Ref.current,     { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.55')
            .to(socialsRef.current,  { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45')
            .to(formWrapRef.current, { opacity: 1, y: 0, duration: 0.95 }, '-=0.6')
        }
      },
      { threshold: 0.8 },
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ── Success callback — flips the heading for 3 s ─────────────────────────
  const handleSuccess = useCallback(() => {
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-screen min-h-screen lg:h-screen overflow-hidden bg-[#050505] flex flex-col"
    >
      {/* ── Animated background (fog, particles, rays) ── */}
      <ContactBackground />

      {/* ── Main content row ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-14 px-8 sm:px-10 lg:px-16 pt-24 pb-6 min-h-0">
        {/* Left — text */}
        <div className="w-full lg:w-[42%] lg:flex-shrink-0">
          <ContactContent
            labelRef={labelRef}
            headingRef={headingRef}
            lineRef={lineRef}
            sub1Ref={sub1Ref}
            sub2Ref={sub2Ref}
            socialsRef={socialsRef}
            isSuccess={isSuccess}
          />
        </div>

        {/* Right — form */}
        <div ref={formWrapRef} className="w-full lg:flex-1">
          <ContactForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* ── Footer ── */}
      <ContactFooter />
    </section>
  )
}
