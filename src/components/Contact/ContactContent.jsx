const SOCIALS = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function ContactContent({
  labelRef, headingRef, lineRef, sub1Ref, sub2Ref, socialsRef, isSuccess,
}) {
  return (
    <div className="flex flex-col justify-center">
      {/* Label */}
      <div ref={labelRef} className="flex items-center gap-3 mb-5">
        <span className="font-inter font-medium text-[#79FF3B] text-[10px] tracking-[0.3em] uppercase">
          {isSuccess ? 'Message Received' : "Let's Connect"}
        </span>
        <span className="block w-8 h-px bg-[#79FF3B]/50" />
      </div>

      {/* Main Heading */}
      <h2
        ref={headingRef}
        className="font-syne font-extrabold text-white leading-[0.95] tracking-tight"
        style={{ fontSize: 'clamp(2.2rem, 4vw, 4.8rem)' }}
      >
        {isSuccess ? (
          <>
            Thank You.
            <br />
            <span className="text-[#79FF3B]">We'll Be in Touch.</span>
          </>
        ) : (
          <>
            Let's Create
            <br />
            Something
            <br />
            <span className="text-[#79FF3B]">Refreshing Together.</span>
          </>
        )}
      </h2>

      {/* Accent line */}
      <div ref={lineRef} className="w-10 h-0.5 bg-[#79FF3B]/60 rounded-full mt-5 mb-4" />

      {/* Subheading 1 */}
      <p ref={sub1Ref} className="font-inter font-light text-white/55 text-sm lg:text-[0.9rem] leading-relaxed mb-2">
        Every great refreshment begins with a simple conversation.
      </p>

      {/* Subheading 2 */}
      <p ref={sub2Ref} className="font-inter font-light text-white/35 text-xs lg:text-[0.8rem] leading-relaxed">
        Whether you have a question, collaboration idea, or just want to say hello, we'd love to hear from you.
      </p>

      {/* Social Icons */}
      <div ref={socialsRef} className="flex flex-wrap gap-2.5 mt-7">
        {SOCIALS.map(({ name, href, icon }) => (
          <a
            key={name}
            href={href}
            aria-label={name}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.08] text-white/40 hover:text-[#79FF3B] hover:border-[#79FF3B]/30 hover:bg-[#79FF3B]/5 hover:scale-[1.06] hover:shadow-[0_0_12px_rgba(121,255,59,0.18)] transition-all duration-300"
          >
            {icon}
            <span className="font-inter text-[11px] font-light">{name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
