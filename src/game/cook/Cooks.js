import React from "react";
import { Cook } from "./Cook";
import { getCooks } from "../selectors";

export function Cooks(props) {
  const cooks = getCooks();

  return (
    <div>
      {Object.values(cooks).map(cook => (
        <Cook cook={cook} key={cook.id} />
      ))}
    </div>
  );
}
