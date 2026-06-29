import { useState, useRef, useCallback } from 'react'
import gsap from 'gsap'

const INPUT_BASE =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 ' +
  'font-inter text-sm text-white placeholder:text-white/28 ' +
  'focus:outline-none focus:border-[#79FF3B]/35 focus:bg-white/[0.06] ' +
  'transition-all duration-200 appearance-none'

function validate({ name, email, subject, message }) {
  if (!name.trim())    return 'Please enter your name.'
  if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email.'
  if (!subject.trim()) return 'Please enter a subject.'
  if (!message.trim()) return 'Please enter a message.'
  return null
}

function riseParticles(container) {
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div')
    el.style.cssText =
      `position:absolute;` +
      `width:${1.5 + Math.random() * 2.5}px;` +
      `height:${1.5 + Math.random() * 2.5}px;` +
      `background:#79FF3B;border-radius:50%;` +
      `left:${5 + Math.random() * 90}%;` +
      `bottom:15%;` +
      `pointer-events:none;z-index:100;` +
      `opacity:${0.5 + Math.random() * 0.5};`
    container.appendChild(el)
    gsap.to(el, {
      y: -(55 + Math.random() * 100),
      x: (Math.random() - 0.5) * 55,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.9,
      ease: 'power2.out',
      delay: Math.random() * 0.35,
      onComplete: () => el.remove(),
    })
  }
}

export default function ContactForm({ onSuccess }) {
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')   // idle | submitting | success | error
  const [error,  setError]  = useState('')

  const containerRef = useRef(null)
  const sweepRef     = useRef(null)
  const btnRef       = useRef(null)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }, [error])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const msg = validate(form)
    if (msg) { setError(msg); return }

    setError('')
    setStatus('submitting')

    try {
      // Lazy-import Firebase only on first submit — keeps initial bundle lighter
      const { db } = await import('../../lib/firebase.js')

      if (db) {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
        await addDoc(collection(db, 'contactMessages'), {
          ...form,
          timestamp: serverTimestamp(),
        })
      } else {
        // Firebase not configured — simulate network delay
        await new Promise(r => setTimeout(r, 900))
      }

      setStatus('success')
      onSuccess?.()
      riseParticles(containerRef.current)

      // Reset after 3 s
      setTimeout(() => {
        setStatus('idle')
        setForm({ name: '', email: '', subject: '', message: '' })
      }, 3000)
    } catch (err) {
      console.error('[RiDoy] Form submit error:', err)
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }, [form, onSuccess])

  // Button hover: light sweep
  const handleBtnEnter = useCallback(() => {
    gsap.fromTo(sweepRef.current,
      { x: '-115%' },
      { x: '115%', duration: 0.55, ease: 'power2.inOut' },
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative rounded-[24px] p-6 lg:p-7"
      style={{
        background: 'rgba(8,8,8,0.72)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(121,255,59,0.18)',
        boxShadow:
          '0 0 80px rgba(121,255,59,0.06),' +
          '0 30px 60px rgba(0,0,0,0.55),' +
          'inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Form header */}
      <div className="mb-5">
        <h3 className="font-syne font-bold text-white text-lg mb-2">Send us a message</h3>
        <div className="w-7 h-0.5 bg-[#79FF3B]/60 rounded-full" />
      </div>

      {/* ── Success state ── */}
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ border: '1px solid rgba(121,255,59,0.35)', background: 'rgba(121,255,59,0.08)' }}
          >
            <svg className="w-8 h-8 text-[#79FF3B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-syne font-bold text-white text-xl">Message Sent!</p>
            <p className="font-inter font-light text-white/45 text-sm mt-1">We'll get back to you soon.</p>
          </div>
        </div>
      ) : (
        /* ── Form ── */
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/28 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              </span>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your Name" className={INPUT_BASE + ' pl-9'} />
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/28 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                </svg>
              </span>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Your Email" className={INPUT_BASE + ' pl-9'} />
            </div>
          </div>

          {/* Subject */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/28 pointer-events-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            <input type="text" name="subject" value={form.subject} onChange={handleChange}
              placeholder="Subject" className={INPUT_BASE + ' pl-9'} />
          </div>

          {/* Message */}
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-white/28 pointer-events-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4z" />
              </svg>
            </span>
            <textarea name="message" value={form.message} onChange={handleChange}
              placeholder="Your Message" rows={4}
              className={INPUT_BASE + ' pl-9 resize-none leading-relaxed'} />
          </div>

          {/* Error */}
          {error && (
            <p className="font-inter text-[#FF4040] text-xs">{error}</p>
          )}

          {/* Submit button */}
          <button
            ref={btnRef}
            type="submit"
            disabled={status === 'submitting'}
            onMouseEnter={handleBtnEnter}
            className="relative overflow-hidden w-full font-inter font-semibold text-[13px] py-4 rounded-2xl bg-[#79FF3B] text-[#050505] flex items-center justify-center gap-2.5 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(121,255,59,0.45)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {/* Light sweep overlay */}
            <div
              ref={sweepRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.28) 50%, transparent 80%)',
                transform: 'translateX(-115%)',
              }}
            />

            {status === 'submitting' ? (
              <>
                <div className="w-4 h-4 border-2 border-[#050505]/25 border-t-[#050505] rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
