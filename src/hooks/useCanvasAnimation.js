import { useEffect, useRef, useState, useCallback } from 'react'

export function useCanvasAnimation(canvasRef, { totalFrames, loopDuration, frameFolder }) {
  const framesRef        = useRef([])
  const ctxRef           = useRef(null)
  const rafRef           = useRef(null)
  const startTimeRef     = useRef(null)
  const currentFrameRef  = useRef(0)
  const isRunningRef     = useRef(false)
  const isVisibleRef     = useRef(false)   // tracks IntersectionObserver state

  const cropRef = useRef({ w: 0, h: 0, sx: 0, sy: 0, sw: 0, sh: 0 })

  const loopDurationRef = useRef(loopDuration)
  const totalFramesRef  = useRef(totalFrames)
  useEffect(() => {
    loopDurationRef.current = loopDuration
    totalFramesRef.current  = totalFrames
  }, [loopDuration, totalFrames])

  const [isLoaded, setIsLoaded]       = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const drawFrame = useCallback(
    (index) => {
      const ctx = ctxRef.current
      const img = framesRef.current[index]
      if (!ctx || !img || !img.complete || img.naturalWidth === 0) return

      const canvas = canvasRef.current
      if (!canvas) return

      const { width: cw, height: ch } = canvas
      let { w, h, sx, sy, sw, sh } = cropRef.current

      if (w !== cw || h !== ch) {
        const { naturalWidth: iw, naturalHeight: ih } = img
        const canvasRatio = cw / ch
        const imgRatio    = iw / ih

        if (imgRatio > canvasRatio) {
          sh = ih; sw = ih * canvasRatio; sx = (iw - sw) / 2; sy = 0
        } else {
          sw = iw; sh = iw / canvasRatio; sx = 0; sy = (ih - sh) / 2
        }
        cropRef.current = { w: cw, h: ch, sx, sy, sw, sh }
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
    },
    [canvasRef],
  )

  const animate = useCallback(
    (timestamp) => {
      if (!isRunningRef.current) return
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed    = (timestamp - startTimeRef.current) % loopDurationRef.current
      const frameIndex = Math.floor((elapsed / loopDurationRef.current) * totalFramesRef.current)

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }

      rafRef.current = requestAnimationFrame(animate)
    },
    [drawFrame],
  )

  // Preload — throttled to ~20 state updates (every 5%)
  useEffect(() => {
    let loadedCount = 0
    let isMounted   = true
    let lastBucket  = -1
    const images    = new Array(totalFrames)

    for (let i = 0; i < totalFrames; i++) {
      const img  = new Image()
      // Strip leading slash from frameFolder so BASE_URL + folder never doubles up.
      // BASE_URL is '/' locally and '/repo-name/' on GitHub Pages.
      const folder = frameFolder.replace(/^\//, '')
      img.src = `${import.meta.env.BASE_URL}${folder}/frame_${String(i + 1).padStart(4, '0')}.png`
      images[i]  = img

      const onSettled = () => {
        if (!isMounted) return
        loadedCount++
        const bucket = Math.floor((loadedCount / totalFrames) * 20)
        if (bucket > lastBucket || loadedCount === totalFrames) {
          lastBucket = bucket
          setLoadProgress(loadedCount / totalFrames)
        }
        if (loadedCount === totalFrames) {
          framesRef.current = images
          setIsLoaded(true)
        }
      }

      img.onload  = onSettled
      img.onerror = onSettled
    }

    return () => { isMounted = false }
  }, [totalFrames, frameFolder])

  // Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      ctxRef.current = canvas.getContext('2d', { alpha: false })
      cropRef.current = { w: 0, h: 0, sx: 0, sy: 0, sw: 0, sh: 0 }
      if (framesRef.current.length > 0) drawFrame(currentFrameRef.current)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef, drawFrame])

  // IntersectionObserver — start/stop based on viewport visibility (threshold 0.5)
  useEffect(() => {
    if (!isLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const startLoop = () => {
      if (isRunningRef.current) return
      startTimeRef.current  = null
      isRunningRef.current  = true
      drawFrame(currentFrameRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    const stopLoop = () => {
      isRunningRef.current = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) startLoop()
        else stopLoop()
      },
      { threshold: 0.5 },
    )

    observer.observe(canvas)

    return () => {
      stopLoop()
      observer.disconnect()
    }
  }, [isLoaded, animate, drawFrame, canvasRef])

  // Global canvas:pause / canvas:resume events
  // CommercialSection dispatches these so background canvases stop when the
  // video section is active (they're geometrically "visible" inside the pinned
  // container even when hidden behind Commercial at z:3, so IntersectionObserver
  // alone can't stop them).
  useEffect(() => {
    if (!isLoaded) return

    const doStop = () => {
      isRunningRef.current = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const doStart = () => {
      if (isRunningRef.current) return
      // Only restart if IntersectionObserver last saw this canvas as visible
      if (!isVisibleRef.current) return
      startTimeRef.current = null
      isRunningRef.current = true
      drawFrame(currentFrameRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('canvas:pause',  doStop)
    window.addEventListener('canvas:resume', doStart)

    return () => {
      window.removeEventListener('canvas:pause',  doStop)
      window.removeEventListener('canvas:resume', doStart)
    }
  }, [isLoaded, animate, drawFrame])

  return { isLoaded, loadProgress }
}
