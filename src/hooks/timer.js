import { useEffect, useRef } from "react";
import { useCounter } from "./counter";

export function useTimer(delay, max, running, onFinish, name = "default name") {
  const ref = useRef(false);
  const { count } = useCounter(delay, delay, max, running);

  if (count >= max && !ref.current && running) {
    onFinish();
    ref.current = true;
  }

  useEffect(() => {
    ref.current = false;
  }, [delay, max, running]);

  return { time: count };
}
