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

  return (
    <div className="min-h-full w-full flex justify-center">
      <main className="w-full max-w-xl px-4 py-4 sm:py-6">
        {screen === "menu" && <MenuScreen />}
        {screen === "game" && <GameScreen />}
        {screen === "result" && <ResultScreen />}
        {screen === "stats" && <StatsScreen />}
      </main>
      {!onboarded && <Onboarding onDismiss={dismissOnboarding} />}
    </div>
  );
}
