import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection       from './components/Hero/HeroSection'
import IngredientsSection from './components/Ingredients/IngredientsSection'
import CommercialSection from './components/Commercial/CommercialSection'
import ContactSection    from './components/Contact/ContactSection'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const curtainWrapRef      = useRef(null)
  const ingredientsPanelRef = useRef(null)
  const commercialPanelRef  = useRef(null)
  const contactPanelRef     = useRef(null)

  useEffect(() => {
    /*
     * Four-layer Curtain Reveal Stage
     * ─────────────────────────────────────────────────────────────────
     *  All four sections live inside one 100vh container (overflow:hidden).
     *  A single pinned GSAP timeline drives three consecutive curtain reveals:
     *
     *   Scroll   0 → 100vh  Ingredients rises over Hero
     *   Scroll 100 → 200vh  Commercial  rises over Ingredients
     *   Scroll 200 → 300vh  Contact     rises over Commercial
     *
     *  end: '+=300%' → 300vh of pin-scroll budget.
     *  GSAP adds a 300vh spacer (pinSpacing:true) so future content can follow.
     *
     *  Z-order:  Hero (1) → Ingredients (2) → Commercial (3) → Contact (4)
     *  Each panel starts at translateY(100%), hidden by overflow:hidden.
     */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: curtainWrapRef.current,
          start: 'top top',
          end: '+=600%',        // 200vh per reveal — slower, more deliberate
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
        },
      })

      tl.to(ingredientsPanelRef.current, { y: 0, ease: 'none', duration: 1 })
        .to(commercialPanelRef.current,  { y: 0, ease: 'none', duration: 1 })
        .to(contactPanelRef.current,     { y: 0, ease: 'none', duration: 1 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/*
       * Single overflow:hidden stage — GSAP pins this for 300vh of scroll.
       * All four sections live here; one is visible at a time.
       */}
      <div
        ref={curtainWrapRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* ── Layer 1: Hero ── stays fixed behind all curtains */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <HeroSection />
        </div>

        {/* ── Layer 2: Ingredients ── first curtain */}
        <div
          ref={ingredientsPanelRef}
          className="absolute inset-0"
          style={{ zIndex: 2, transform: 'translateY(100%)', willChange: 'transform' }}
        >
          <IngredientsSection />
        </div>

        {/* ── Layer 3: Commercial ── second curtain */}
        <div
          ref={commercialPanelRef}
          className="absolute inset-0"
          style={{ zIndex: 3, transform: 'translateY(100%)', willChange: 'transform' }}
        >
          <CommercialSection />
        </div>

        {/* ── Layer 4: Contact ── third curtain (grand finale) */}
        <div
          ref={contactPanelRef}
          className="absolute inset-0"
          style={{ zIndex: 4, transform: 'translateY(100%)', willChange: 'transform' }}
        >
          <ContactSection />
        </div>
      </div>

      {/* Future sections appended here — appear after GSAP's 300vh spacer */}
    </main>
  )
}
