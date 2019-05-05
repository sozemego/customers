import React from "react";
import { Customer } from "./Customer";
import { Card } from "antd";
import { CUSTOMER_PHASE } from "./business";
import { getActiveCustomerIds, getCustomers } from "../selectors";
import { changeWaitingTime, orderTaken } from "../actions";
import { useDispatch } from "react-redux";

export function Customers(props) {
  const customers = getCustomers();
  const activeCustomerIds = getActiveCustomerIds();
  const dispatch = useDispatch();

  const isDone = customer => customer.phase === CUSTOMER_PHASE.DONE;
  const isActive = customer => customer.phase === CUSTOMER_PHASE.ACTIVE;

  const totalCustomers = Object.values(customers).length;
  const doneCustomers = Object.values(customers).filter(isDone).length;

  const activeCustomers = activeCustomerIds
    .map(id => customers[id])
    .filter(isActive);

  return (
    <Card
      title={`Customers ${doneCustomers} / ${totalCustomers}`}
      style={{ minHeight: "90vh" }}
    >
      {activeCustomers.map(customer => (
        <Customer
          customer={customer}
          takeOrder={() => dispatch(orderTaken(customer.orderId))}
          onTimeChanged={(type, time) =>
            dispatch(changeWaitingTime(customer, type, time))
          }
          key={customer.id}
        />
      ))}
    </Card>
  );
}
