export default function IngredientsContent({
  labelRef,
  headingRef,
  subheadingRef,
  buttonRef,
  scrollRef,
}) {
  return (
    <div className="absolute inset-0 flex items-center pointer-events-none select-none">
      {/* Left-aligned text block — vertically centered */}
      <div className="pointer-events-auto px-6 sm:px-10 lg:px-16 max-w-xl">
        {/* Label with decorative line */}
        <div ref={labelRef} className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px bg-[#79FF3B]/50" />
          <span className="font-inter font-medium text-[#79FF3B] text-[10px] tracking-[0.3em] uppercase">
            Crafted From Nature
          </span>
        </div>

        {/* Main Heading */}
        <h2
          ref={headingRef}
          className="font-syne font-extrabold text-white leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.8rem)' }}
        >
          Real Ingredients.
          <br />
          <span className="text-[#79FF3B]">Real Refreshment.</span>
        </h2>

        {/* Subheading */}
        <p
          ref={subheadingRef}
          className="mt-5 lg:mt-6 font-inter font-light text-white/48 text-sm lg:text-[0.95rem] leading-relaxed max-w-[22rem]"
        >
          Made with real fruits, natural flavors,
          <br />
          and zero compromise.
        </p>

        {/* CTA Button */}
        <div ref={buttonRef} className="mt-8 lg:mt-10">
          <button className="font-inter font-semibold text-[13px] tracking-wide px-8 py-3.5 rounded-full bg-[#79FF3B] text-[#050505] hover:bg-[#2FAE5A] hover:scale-[1.04] transition-all duration-300 active:scale-100">
            Discover Ingredients
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
        <div className="w-[18px] h-7 rounded-full border border-white/20 flex items-start justify-center pt-[5px]">
          <div className="w-[3px] h-[5px] rounded-full bg-white/35 animate-bounce" />
        </div>
      </div>
    </div>
  )
}
