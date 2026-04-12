import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function Header({ title, subtitle, right }: Props) {
  return (
    <header className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
