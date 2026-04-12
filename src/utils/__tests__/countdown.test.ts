import { describe, it, expect } from "vitest";
import { msUntilNextLocalMidnight, formatCountdown } from "../countdown";

describe("msUntilNextLocalMidnight", () => {
  it("returns ms until the next local midnight", () => {
    const now = new Date();
    now.setHours(22, 30, 0, 0);
    const ms = msUntilNextLocalMidnight(now);
    expect(ms).toBe(90 * 60 * 1000);
  });

  it("is never negative", () => {
    const ms = msUntilNextLocalMidnight(new Date());
    expect(ms).toBeGreaterThanOrEqual(0);
  });
});

describe("formatCountdown", () => {
  it("formats hours, minutes, seconds with zero padding", () => {
    expect(formatCountdown(0)).toBe("00:00:00");
    expect(formatCountdown(3_661_000)).toBe("01:01:01");
    expect(formatCountdown(12 * 3600 * 1000)).toBe("12:00:00");
  });
});
