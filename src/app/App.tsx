import { useEffect, useRef } from "react";
import { useGameStore } from "../game/state/appStore";
import { MenuScreen } from "../screens/MenuScreen";
import { GameScreen } from "../screens/GameScreen";
import { ResultScreen } from "../screens/ResultScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { Onboarding } from "../components/Onboarding";

export function App() {
  const screen = useGameStore((s) => s.screen);
  const onboarded = useGameStore((s) => s.onboarded);
  const dismissOnboarding = useGameStore((s) => s.dismissOnboarding);
  const stats = useGameStore((s) => s.stats);
  const todayDailyRecord = useGameStore((s) => s.todayDailyRecord);
  const startDaily = useGameStore((s) => s.startDaily);

  // First-time user experience: after dismissing the onboarding overlay,
  // drop the player straight into today's daily puzzle instead of leaving
  // them on the menu to figure out the next step. Four gates:
  //   - gamesPlayed === 0 (truly first time)
  //   - todayDailyRecord === null (hasn't touched today yet)
  //   - screen === "menu" (not resuming an in-progress or finished game)
  //   - this is the *initial* dismiss, not a re-open from the menu's
  //     `showOnboarding` button. Without this gate, a player who hasn't
  //     solved a game yet could tap "How to play" from the menu and be
  //     force-navigated into the daily when they close it.
  const initialDismissConsumed = useRef(false);
  const handleOnboardingDismiss = () => {
    const shouldAutoRoute =
      !initialDismissConsumed.current &&
      stats.gamesPlayed === 0 &&
      todayDailyRecord === null &&
      screen === "menu";
    initialDismissConsumed.current = true;
    dismissOnboarding();
    if (shouldAutoRoute) startDaily();
  };

  // Reset document scroll on every screen change. Without this, opening a
  // taller result screen after several next-puzzle rounds leaves the user
  // scrolled mid-page and the "Next puzzle" CTA appears to drift further
  // down the viewport with each puzzle (browser scrollY preserved across
  // unmount/mount, content now longer). Always bring the player to the
  // top of the new screen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use instant scroll — the default smooth scroll fights the layout
    // settle on mobile and looks like a late jump.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [screen]);

  return (
    <div className="w-full flex justify-center">
      <main className="w-full max-w-xl px-4 pt-4 sm:pt-6 fw-safe-pb" data-fw-screen={screen}>
        {screen === "menu" && <MenuScreen />}
        {screen === "game" && <GameScreen />}
        {screen === "result" && <ResultScreen />}
        {screen === "stats" && <StatsScreen />}
      </main>
      {!onboarded && <Onboarding onDismiss={handleOnboardingDismiss} />}
    </div>
  );
}
