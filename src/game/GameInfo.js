import React from "react";
import { isRunning } from "./selectors";

export function GameInfo(props) {
  const running = isRunning();

  if (running) {
    return null;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ borderBottom: "1px solid gray", margin: 12 }} />
      <div>Hello!</div>
      <div>Welcome to my 'restaurant' simulator game.</div>
      <div>
        Customers will come to your restaurant, you will get their orders and
        serve them food.
      </div>
      <div style={{ borderBottom: "1px solid gray", margin: 12 }} />
    </div>
  );
}
