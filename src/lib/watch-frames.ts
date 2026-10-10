export const watchFrames = Array.from({ length: 208 }, (_, i) => {
  const pad = String(i).padStart(4, '0');
  return `/full-sequence/frame_${pad}.webp`;
});
export const lastWatchFrame = Math.max(0, watchFrames.length - 1);