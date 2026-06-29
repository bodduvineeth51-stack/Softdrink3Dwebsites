import { useCanvasAnimation } from './useCanvasAnimation'

export function useFrameAnimation(canvasRef) {
  return useCanvasAnimation(canvasRef, {
    totalFrames: 240,
    loopDuration: 7000,
    frameFolder: '/hero-frames',
  })
}
