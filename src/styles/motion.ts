/**
 * Foldwink motion tokens — one source of truth.
 *
 * Rules:
 *   - CSS / transform-only. No animation library, ever.
 *   - Durations live here. Components reference these constants or the
 *     matching class names, they do not hardcode ms values.
 *   - Every animated surface must have a `prefers-reduced-motion` escape
 *     hatch in `src/styles/index.css`.
 */

export const MOTION_DURATION = {
  /** Card press / button press feedback */
  press: 120,
  /** Foldwink Tabs reveal polish */
  tab: 220,
  /** Correct-guess card pop */
  pop: 260,
  /** Result screen arrival */
  result: 320,
  /** Wrong-guess grid shake */
  shake: 420,
  /** Streak pulse on result screen */
  streak: 1800,
} as const;

export const MOTION_CLASS = {
  /** Scale-down on active press. Apply to any tactile button/card. */
  press: "active:scale-[0.97]",
  /** Subtle 2.5D lift for a selected card. Transform + shadow only. */
  selectedLift: "-translate-y-[1px] shadow-[0_10px_22px_-14px_rgba(124,196,255,0.55)]",
  /** One-shot pop when a card becomes solved. */
  solvedPop: "fw-pop",
  /** Wrong-guess shake, apply to the grid wrapper. */
  shake: "fw-shake",
  /** Result-summary arrival. */
  resultPop: "fw-result-pop",
  /** Tab reveal polish. */
  tabReveal: "fw-tab-reveal",
  /** Streak celebration pulse. */
  streakPulse: "fw-streak-pulse",
  /** Standard transition for color/shadow/transform changes. */
  baseTransition: "transition-[transform,box-shadow,background-color] duration-150",
} as const;

export type MotionClassKey = keyof typeof MOTION_CLASS;
