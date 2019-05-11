import React from "react";
import { Order } from "./Order";
import { getOrderIdToResult, getOrders, getTakenOrderIds } from "../selectors";
import { Card } from "antd";
import { OrderTitle } from "./OrderTitle";

export function Orders(props) {
  const orders = getOrders();
  const takenOrderIds = getTakenOrderIds();

  const takenOrders = takenOrderIds.map(id => orders[id]);
  const orderResults = Object.values(getOrderIdToResult());

  return (
    <Card
      title={<OrderTitle orderResults={orderResults} />}
      style={{ minHeight: "90vh" }}
    >
      {takenOrders.map((order, index) => (
        <Order order={order} key={order.id} />
      ))}
    </Card>
  );
}
