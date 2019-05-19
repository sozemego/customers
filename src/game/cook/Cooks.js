import React from "react";
import { Cook } from "./Cook";
import { getCooks } from "../selectors";
import { Card } from "antd";
import { CooksTitle } from "./CooksTitle";

export function Cooks(props) {
  const cooks = getCooks();

  return (
    <Card title={<CooksTitle />} style={{ minHeight: "90vh" }}>
      {Object.values(cooks).map(cook => (
        <Cook cook={cook} key={cook.id} />
      ))}
    </Card>
  );
}
