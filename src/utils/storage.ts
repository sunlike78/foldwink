export function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // intentional: ignore quota / disabled storage
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // intentional
  }
}
