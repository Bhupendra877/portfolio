/** Kept for API compatibility: the page no longer has a blocking loader, so the app is ready immediately. */
export function markReady() {}
export function onAppReady(fn: () => void) { fn(); return () => {}; }
