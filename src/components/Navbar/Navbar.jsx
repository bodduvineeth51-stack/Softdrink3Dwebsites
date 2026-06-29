import { useEffect, useState, forwardRef } from 'react'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Ingredients', href: '#ingredients' },
  { label: 'Commercial', href: '#commercial' },
  { label: 'Contact', href: '#contact' },
]

const Navbar = forwardRef(function Navbar(_, ref) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Guard: only call setScrolled when the boolean actually flips.
    // Without this, every scroll pixel past 40 triggers a React re-render.
    let prev = false
    const handleScroll = () => {
      const next = window.scrollY > 40
      if (next !== prev) { prev = next; setScrolled(next) }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      ref={ref}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/85 backdrop-blur-2xl border-b border-white/[0.04] py-4'
          : 'bg-transparent backdrop-blur-sm py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-syne font-extrabold text-xl lg:text-2xl tracking-widest"
        >
          Ri<span className="text-[#79FF3B]">Doy</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="font-inter text-[11px] tracking-[0.22em] uppercase text-white/55 hover:text-white/90 transition-colors duration-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#ingredients"
          className="hidden md:inline-flex items-center gap-2 font-inter text-[11px] font-medium tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-[#79FF3B]/30 text-[#79FF3B] hover:border-[#79FF3B]/70 hover:bg-[#79FF3B]/8 transition-all duration-300"
        >
          <span className="w-1 h-1 rounded-full bg-[#79FF3B]" />
          Explore
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px bg-white/70 transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-[6px]' : 'w-6'}`}
          />
          <span
            className={`block h-px bg-white/70 transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-4'}`}
          />
          <span
            className={`block h-px bg-white/70 transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-[6px]' : 'w-5'}`}
          />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-6 pb-6 pt-4 gap-5 border-t border-white/5 mt-4">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-inter text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#ingredients"
              onClick={() => setMenuOpen(false)}
              className="inline-block font-inter text-xs font-medium tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-[#79FF3B]/30 text-[#79FF3B]"
            >
              Explore Flavors
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
})

export default Navbar
