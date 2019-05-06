import React from "react";
import { Customer } from "./Customer";
import { Card } from "antd";
import { getActiveCustomerIds, getCustomers, getDoneCustomerIds } from '../selectors';
import { changeWaitingTime, orderTaken } from "../actions";
import { useDispatch } from "react-redux";

export function Customers(props) {
  const customers = getCustomers();
  const activeCustomerIds = getActiveCustomerIds();
  const doneCustomerIds = getDoneCustomerIds();
  const dispatch = useDispatch();

  const totalCustomers = Object.values(customers).length;
  const doneCustomers = doneCustomerIds.length;

  const activeCustomers = activeCustomerIds
    .map(id => customers[id]);

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
