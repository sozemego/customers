import React from "react";
import { useCounter } from "../hooks/counter";
import { isRunning } from "../game/selectors";

export function GameClock() {
  const running = isRunning();
  const { count } = useCounter(1000, 1000, Number.MAX_SAFE_INTEGER, running);

  let minutes = 0;
  let seconds = count / 1000;
  while (seconds >= 60) {
    minutes += 1;
    seconds -= 60;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return <div>{`${minutes}:${seconds}`}</div>;
}
