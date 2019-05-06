import React from "react";
import { Order } from "./Order";
import { getOrders, getTakenOrderIds } from "../selectors";

export function Orders(props) {
  const orders = getOrders();
  const takenOrderIds = getTakenOrderIds();

  const takenOrders = takenOrderIds.map(id => orders[id]);

  return (
    <div>
      {takenOrders.map((order, index) => (
        <Order order={order} key={order.id} />
      ))}
    </div>
  );
}
