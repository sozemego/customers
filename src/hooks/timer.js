import { useEffect, useRef } from "react";
import { useCounter } from "./counter";

export function useTimer(
  delay,
  increment,
  max,
  running,
  onFinish,
  resetOnFinish = false,
  name = "default name"
) {
  const ref = useRef(false);
  const { count, setCount } = useCounter(delay, increment, max, running);

  if (count >= max && !ref.current && running) {
    onFinish();
    ref.current = true;
    if (resetOnFinish) {
      setCount(0);
    }
  }

  useEffect(() => {
    ref.current = false;
  }, [delay, max, increment, running]);

  return { time: count };
}
