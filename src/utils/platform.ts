/**
 * Detect iOS Safari running in a regular browser tab (not standalone /
 * Add-to-Home-Screen mode, not Chrome-on-iOS).
 *
 * Used to surface an "Add to Home Screen for full-screen play" hint on
 * the menu, because iOS Safari forbids the JS Fullscreen API for iframes
 * and only standalone-launched Safari sheds the URL / toolbar chrome.
 */
export function isIosSafariInBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua);
  if (!isIos) return false;
  // Exclude non-Safari iOS browsers — Chrome (CriOS), Firefox (FxiOS),
  // Edge (EdgiOS) render differently and the Add-to-Home trick is
  // Safari-specific.
  if (/CriOS|FxiOS|EdgiOS/.test(ua)) return false;
  // Already launched as a PWA from the home screen — no hint needed.
  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return false;
  if (typeof window !== "undefined") {
    const mm = window.matchMedia?.("(display-mode: standalone)");
    if (mm?.matches) return false;
  }
  return true;
}
