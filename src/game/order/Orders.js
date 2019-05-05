import React from "react";
import { Order } from "./Order";
import { ORDER_PHASE } from "./business";
import { getOrders } from "../selectors";

export function Orders(props) {
  const orders = getOrders();

  const takenOrders = Object.values(orders).filter(
    order => order.phase === ORDER_PHASE.TAKEN
  );

  console.log(takenOrders.map(order => order.id));

  return (
    <div>
      {takenOrders.map((order, index) => (
        <Order order={order} key={order.id} />
      ))}
    </div>
  );
}
