import type { ReactNode } from "react";
import { MOTION_CLASS } from "../styles/motion";

interface Props {
  children: ReactNode;
  shake?: boolean;
}

export function Grid({ children, shake }: Props) {
  const classes = `grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md mx-auto ${
    shake ? MOTION_CLASS.shake : ""
  }`;
  return <div className={classes}>{children}</div>;
}
