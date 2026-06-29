export default function HeroContent({
  badgeRef,
  headingRef,
  subheadingRef,
  setButtonRef,
  scrollRef,
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none select-none">
      {/* Lower content block */}
      <div className="pointer-events-auto px-6 sm:px-10 lg:px-16 pb-24 lg:pb-28 w-full max-w-4xl">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-[#79FF3B]/20 bg-[#79FF3B]/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#79FF3B] animate-pulse" />
          <span className="font-inter font-medium text-[#79FF3B] text-[10px] tracking-[0.25em] uppercase">
            New Formula
          </span>
        </div>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="font-syne font-extrabold text-white leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(3.2rem, 8vw, 7.5rem)' }}
        >
          Taste the
          <br />
          <span className="text-[#79FF3B]">Future.</span>
        </h1>

        {/* Subheading */}
        <p
          ref={subheadingRef}
          className="mt-5 lg:mt-6 font-inter font-light text-white/50 text-base lg:text-[1.05rem] leading-relaxed max-w-xs lg:max-w-sm"
        >
          Crafted with real fruit.
          <br />
          Designed for a refreshing experience.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#ingredients"
            ref={setButtonRef(0)}
            className="font-inter font-semibold text-[13px] tracking-wide px-8 py-3.5 rounded-full bg-[#79FF3B] text-[#050505] hover:bg-[#2FAE5A] hover:scale-[1.04] transition-all duration-300 active:scale-100"
          >
            Explore Flavors
          </a>
          <button
            ref={setButtonRef(1)}
            className="font-inter font-light text-[13px] tracking-wide px-8 py-3.5 rounded-full border border-white/20 text-white/80 hover:border-white/45 hover:bg-white/5 transition-all duration-300"
          >
            Watch Commercial
          </button>
        </div>
      </div>

      {/* Scroll Indicator — bottom center */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none"
      >
        <span className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/25">
          Scroll
        </span>
        {/* Mouse-style scroll icon */}
        <div className="w-[18px] h-7 rounded-full border border-white/20 flex items-start justify-center pt-[5px]">
          <div className="w-[3px] h-[5px] rounded-full bg-white/40 animate-bounce" />
        </div>
      </div>
    </div>
  )
}
