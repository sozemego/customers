import React from "react";
import { Button, Row, Col, Progress } from "antd";
import { css } from "glamor";
import { InfoCard } from "../../components/InfoCard";
import { Dish } from "../dish/Dish";
import { getOrders, isOrderTaken, isPaused } from "../selectors";
import { leaveAt, WAITING_TIME_TYPE } from "../business";
import { useTimer } from "../../hooks/timer";

const progressContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start"
});

const takeOrderProgressContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

const makeOrderProgressContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginLeft: "12px"
});

export function Customer({ customer, takeOrder, canMake, onTimeExceeded }) {
  const { name, orderId, avatar } = customer;

  const paused = isPaused();
  const orders = getOrders();
  const order = orders[orderId];
  const orderTaken = isOrderTaken(order.id);

  const takeOrderEnabled = !orderTaken;
  const maxWaitTime = leaveAt(order);
  const { time: waitingTime } = useTimer(
    1000,
    1,
    maxWaitTime,
    paused ? false : takeOrderEnabled,
    () => onTimeExceeded(WAITING_TIME_TYPE.WAITING, maxWaitTime)
  );

  const maxMakeTime = leaveAt(order);
  const { time: orderTime } = useTimer(
    1000,
    1,
    maxMakeTime,
    paused ? false : !takeOrderEnabled,
    () => onTimeExceeded(WAITING_TIME_TYPE.ORDER, maxMakeTime)
  );

  return (
    <div data-testid={`customer-id-${customer.id}`}>
      <Row type={"flex"} justify={"start"}>
        <Col span={8}>
          <InfoCard src={avatar} name={name} />
        </Col>
        <Col span={8}>{order && <Dish dish={order.dish} />}</Col>
        <Col span={8}>
          <Button
            onClick={takeOrder}
            type="primary"
            disabled={paused || !takeOrderEnabled}
            data-testid={`take-order-${customer.id}`}
          >
            Take order
          </Button>
        </Col>
      </Row>
      <Row type={"flex"} justify={"start"}>
        <Col span={24}>
          <div className={progressContainerStyle}>
            <div className={takeOrderProgressContainerStyle}>
              <div>Take order {`${waitingTime} / ${maxWaitTime}s`}</div>
              <Progress
                default={"default"}
                type={"line"}
                percent={100 - (waitingTime / maxWaitTime) * 100}
                width={35}
                status={!takeOrderEnabled ? "active" : "normal"}
                strokeColor={{
                  "0%": "#e90e00",
                  "100%": "#00d002"
                }}
                format={percent => ``}
              />
            </div>
            {!takeOrderEnabled && (
              <div className={makeOrderProgressContainerStyle}>
                <div>Make order {`${orderTime} / ${maxMakeTime}s`}</div>
                <Progress
                  default={"default"}
                  type={"line"}
                  percent={100 - (orderTime / maxMakeTime) * 100}
                  width={35}
                  status={"active"}
                  strokeColor={{
                    "0%": "#e90e00",
                    "100%": "#00d002"
                  }}
                  format={percent => ``}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
