import React, { useEffect } from "react";
import { InfoCard } from "../../components/InfoCard";
import { Dish } from "../dish/Dish";
import { Button, Row, Col, Progress } from "antd";
import { getOrders, getTakenOrderIds } from '../selectors';
import { useCounter } from "../../hooks/counter";
import { WAITING_TIME_TYPE } from "./business";

export function Customer({ customer, takeOrder, canMake, onTimeChanged }) {
  const { name, orderId, avatar } = customer;

  const orders = getOrders();
  const order = orders[orderId];
  const dish = order.dish;
  const takenOrderIds = getTakenOrderIds();

  const takeOrderEnabled = !takenOrderIds.some(id => id === order.id);
  const maxWaitTime = customer.waitingTimes[WAITING_TIME_TYPE.WAITING].leaveAt(
    dish
  );
  const { count: waitingTime } = useCounter(
    1000,
    1,
    maxWaitTime,
    takeOrderEnabled
  );
  useEffect(() => {
    onTimeChanged(WAITING_TIME_TYPE.WAITING, waitingTime);
  }, [waitingTime]);

  const maxMakeTime = customer.waitingTimes[WAITING_TIME_TYPE.ORDER].leaveAt(
    dish
  );
  const { count: orderTime } = useCounter(
    1000,
    1,
    maxMakeTime,
    !takeOrderEnabled
  );
  useEffect(() => {
    onTimeChanged(WAITING_TIME_TYPE.ORDER, orderTime);
  }, [orderTime]);

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
            disabled={!takeOrderEnabled}
            data-testid={`take-order-${customer.id}`}
          >
            Take order
          </Button>
        </Col>
      </Row>
      <Row type={"flex"} justify={"start"}>
        <Col span={24}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: "12px"
                }}
              >
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
