import { useState, useEffect } from "react";

export function useCounter(
  delay,
  increment,
  max = Number.MAX_SAFE_INTEGER,
  running
) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (running) {
      const intervalId = setInterval(() => {
        setCount(count => {
          const nextCount = count + increment;
          if (nextCount < max) {
            return nextCount;
          }
          return max;
        });
      }, delay);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [delay, increment, max, running]);

  return {
    count
  };
}
