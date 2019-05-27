import React from "react";
import { css } from "glamor";
import { Col, Row } from "antd";
import { getCooks, getLevelId, isRunning } from "./selectors";
import { GameClock } from "../components/GameClock";
import { Customers } from "./customer/Customers";
import { Orders } from "./order/Orders";
import { Cooks } from "./cook/Cooks";

const containerStyle = css({
  display: "flex",
  flexDirection: "column"
});

const gamePanelsContainer = css({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between"
});

export function Game(props) {
  const running = isRunning();
  const levelId = getLevelId();
  const cooks = getCooks();

  if (!running) {
    return null;
  }

  return (
    <div className={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div>{`Level: ${levelId}`}</div>
        <GameClock />
      </div>
      <div className={gamePanelsContainer}>
        <div style={{ flex: 1 }}>
          <Customers />
        </div>
        <Row style={{ flex: 3, display: "flex", flexDirection: "row" }}>
          <Col span={16}>
            <Orders />
          </Col>
          <Col span={8}>
            <Cooks />
          </Col>
        </Row>
      </div>
    </div>
  );
}
