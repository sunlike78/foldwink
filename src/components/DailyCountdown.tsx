import { useEffect, useState } from "react";
import { formatCountdown, msUntilNextLocalMidnight } from "../utils/countdown";
import { useT } from "../i18n/useLanguage";

export function DailyCountdown() {
  const [ms, setMs] = useState(msUntilNextLocalMidnight());
  const t = useT();

  useEffect(() => {
    const id = window.setInterval(() => {
      setMs(msUntilNextLocalMidnight());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="text-center text-sm text-muted">
      {t.daily.nextDailyIn}{" "}
      <span className="text-text font-semibold tabular-nums">{formatCountdown(ms)}</span>
    </div>
  );
}
