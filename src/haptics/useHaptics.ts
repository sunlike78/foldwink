import { useCallback, useSyncExternalStore } from "react";
import {
  getHapticSettings,
  isHapticsSupported,
  setHapticEnabled,
  triggerHaptic,
  type HapticEvent,
} from "./haptics";

/**
 * Thin React layer over `haptics.ts`. Components never touch `navigator.vibrate`
 * directly — they always go through `triggerHaptic` here.
 */

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function notify(): void {
  for (const l of listeners) l();
}

interface SettingsSnapshot {
  enabled: boolean;
}

let snapshot: SettingsSnapshot = getHapticSettings();

function getSnapshot(): SettingsSnapshot {
  return snapshot;
}

function refresh(): void {
  snapshot = getHapticSettings();
  notify();
}

export function useHapticSettings(): {
  enabled: boolean;
  supported: boolean;
  toggle: () => void;
} {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const toggle = useCallback(() => {
    setHapticEnabled(!s.enabled);
    refresh();
  }, [s.enabled]);
  return { enabled: s.enabled, supported: isHapticsSupported(), toggle };
}

export function useHaptics(): (event: HapticEvent) => void {
  return useCallback((event: HapticEvent) => {
    triggerHaptic(event);
  }, []);
}
