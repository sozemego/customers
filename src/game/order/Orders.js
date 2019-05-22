import React from "react";
import { useTransition, animated } from "react-spring";
import { Order } from "./Order";
import { getOrders, getTakenOrderIds } from "../selectors";
import { Card } from "antd";
import { OrderTitle } from "./OrderTitle";

export function Orders(props) {
  const orders = getOrders();
  const takenOrderIds = getTakenOrderIds();

  const takenOrders = takenOrderIds.map(id => orders[id]);

  const transitions = useTransition(takenOrders, order => order.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <Card title={<OrderTitle />} style={{ minHeight: "90vh" }}>
      {transitions.map(({ item, key, props }) => (
        <animated.div key={key} style={props}>
          <Order order={item} />
        </animated.div>
      ))}
    </Card>
  );
}
