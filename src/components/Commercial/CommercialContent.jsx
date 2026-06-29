export default function CommercialContent({
  labelRef,
  headingRef,
  subRef,
  btn1Ref,
  btn2Ref,
  onWatchAgain,
}) {
  return (
    <div className="w-[34%] lg:w-[32%] flex-shrink-0 flex flex-col justify-center">
      {/* Label */}
      <div ref={labelRef} className="flex items-center gap-3 mb-5">
        <span className="font-inter font-medium text-[#79FF3B] text-[10px] tracking-[0.3em] uppercase">
          Premium Experience
        </span>
        <span className="block w-7 h-px bg-[#79FF3B]/50" />
      </div>

      {/* Main Heading */}
      <h2
        ref={headingRef}
        className="font-syne font-extrabold text-white leading-[0.92] tracking-tight"
        style={{ fontSize: 'clamp(2.2rem, 4.2vw, 5rem)' }}
      >
        Crafted
        <br />
        to <span className="text-[#79FF3B]">Refresh.</span>
      </h2>

      {/* Subheading */}
      <p
        ref={subRef}
        className="mt-4 lg:mt-5 font-inter font-light text-white/48 text-sm leading-relaxed max-w-[260px]"
      >
        Every frame tells the story of freshness, real fruit, and unforgettable taste.
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 lg:mt-8 flex flex-wrap gap-3">
        <button
          ref={btn1Ref}
          onClick={onWatchAgain}
          className="flex items-center gap-2 font-inter font-semibold text-[13px] px-6 py-3 rounded-full bg-[#79FF3B] text-[#050505] hover:bg-[#2FAE5A] hover:scale-[1.04] transition-all duration-300 active:scale-100"
        >
          {/* Play icon */}
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Again
        </button>

        <button
          ref={btn2Ref}
          className="flex items-center gap-2 font-inter font-light text-[13px] px-6 py-3 rounded-full border border-white/20 text-white/80 hover:border-white/50 hover:bg-white/5 transition-all duration-300"
        >
          Explore More
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
