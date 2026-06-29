import { useEffect, useState, useCallback } from 'react'

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function VideoPlayer({
  tiltWrapRef,
  videoRef,
  progressBarRef,
  timeDisplayRef,
  lightSweepRef,
  src,
}) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Wire time updates directly to DOM — zero React re-renders during playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return
      const pct = (video.currentTime / video.duration) * 100
      if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent =
          `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`
      }
    }

    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('play',  onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('play',  onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [videoRef, progressBarRef, timeDisplayRef])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.paused ? video.play() : video.pause()
  }, [videoRef])

  const seekTo = useCallback((e) => {
    const video = videoRef.current
    if (!video || !video.duration || isNaN(video.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration
  }, [videoRef])

  return (
    <div
      ref={tiltWrapRef}
      className="w-full max-w-[820px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glass + glow frame */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{
          border: '1px solid rgba(121,255,59,0.22)',
          boxShadow:
            '0 0 0 1px rgba(121,255,59,0.06),' +
            '0 0 50px rgba(121,255,59,0.10),' +
            '0 0 120px rgba(121,255,59,0.05),' +
            '0 40px 80px rgba(0,0,0,0.75)',
          background: 'rgba(5,5,5,0.6)',
        }}
      >
        {/* Entry light sweep — sweeps across border/glass on section enter */}
        <div
          ref={lightSweepRef}
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.07) 50%, transparent 85%)',
            transform: 'translateX(-110%)',
          }}
        />

        {/* Video — always in the DOM so videoRef is never null when play() fires.
            src={undefined} (no attribute) shows a black rectangle as placeholder. */}
        <video
          ref={videoRef}
          src={src || undefined}
          loop
          playsInline
          className="block w-full"
          style={{ aspectRatio: '16 / 9', maxHeight: '100%', objectFit: 'cover' }}
        />

        {/* Custom controls bar — bottom gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pb-3.5 pt-10"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="flex-shrink-0 text-white/75 hover:text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Progress bar */}
            <div
              className="flex-1 h-[3px] bg-white/18 rounded-full overflow-hidden cursor-pointer group"
              onClick={seekTo}
              role="progressbar"
              aria-label="Video progress"
            >
              <div
                ref={progressBarRef}
                className="h-full bg-[#79FF3B] rounded-full pointer-events-none transition-none"
                style={{ width: '0%' }}
              />
            </div>

            {/* Time display */}
            <span
              ref={timeDisplayRef}
              className="flex-shrink-0 font-inter text-[11px] text-white/50 font-light tabular-nums whitespace-nowrap"
            >
              0:00 / 0:00
            </span>
          </div>
        </div>
      </div>

      {/* Reflection glow beneath the video */}
      <div
        aria-hidden="true"
        className="mx-auto pointer-events-none"
        style={{
          width: '70%',
          height: '32px',
          marginTop: '2px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(121,255,59,0.14) 0%, transparent 75%)',
          filter: 'blur(14px)',
        }}
      />
    </div>
  )
}
