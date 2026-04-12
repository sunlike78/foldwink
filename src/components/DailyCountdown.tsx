import { useEffect, useState } from "react";
import { formatCountdown, msUntilNextLocalMidnight } from "../utils/countdown";

export function DailyCountdown() {
  const [ms, setMs] = useState(msUntilNextLocalMidnight());

  useEffect(() => {
    const id = window.setInterval(() => {
      setMs(msUntilNextLocalMidnight());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="text-center text-sm text-muted">
      Next daily in{" "}
      <span className="text-text font-semibold tabular-nums">{formatCountdown(ms)}</span>
    </div>
  );
}
