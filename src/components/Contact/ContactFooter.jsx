const NAV = ['Home', 'Ingredients', 'Commercial', 'Contact']

const FOOTER_SOCIALS = [
  {
    label: 'Instagram',
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
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
]

export default function ContactFooter() {
  return (
    <footer className="flex-shrink-0 border-t border-white/[0.05] px-10 lg:px-16 py-5">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0 justify-between">
        {/* Brand */}
        <div className="flex flex-col items-center lg:items-start gap-1">
          <span className="font-syne font-extrabold text-[15px] tracking-widest select-none">
            Ri<span className="text-[#79FF3B]">Doy</span>
          </span>
          <span className="font-inter text-[10px] text-white/25 tracking-wide">
            Crafted with Real Fruits.&nbsp; Good Health • Good Taste
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-5 lg:gap-7">
          {NAV.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-inter text-[10px] text-white/30 hover:text-white/65 tracking-[0.18em] uppercase transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social icons + copyright */}
        <div className="flex flex-col items-center lg:items-end gap-2">
          <div className="flex items-center gap-3">
            {FOOTER_SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/28 hover:text-[#79FF3B] transition-colors duration-300"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="font-inter text-[10px] text-white/20 tracking-wide">
            © 2026 RiDoy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
