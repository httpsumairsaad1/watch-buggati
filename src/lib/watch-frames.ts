const pointers = import.meta.glob<{ default: { url: string } }>("../assets/full-sequence/*.asset.json", { eager: true });
export const watchFrames = Object.entries(pointers).sort(([a], [b]) => a.localeCompare(b)).map(([, asset]) => asset.default.url);
export const lastWatchFrame = Math.max(0, watchFrames.length - 1);