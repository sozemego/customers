import React from "react";
import { Customer } from "./Customer";
import { Card } from "antd";
import { getCustomerIds, getCustomers } from "../selectors";
import { exceedWaitingTime, orderTaken } from "../actions";
import { useDispatch } from "react-redux";
import { CustomerTitle } from "./CustomerTitle";
import { CUSTOMER_PHASE } from "./business";

export function Customers(props) {
  const customers = getCustomers();
  const activeCustomerIds = getCustomerIds(CUSTOMER_PHASE.ACTIVE);
  const doneCustomerIds = getCustomerIds(CUSTOMER_PHASE.DONE);
  const arrivingCustomerIds = getCustomerIds(CUSTOMER_PHASE.ARRIVING);
  const angryCustomerIds = getCustomerIds(CUSTOMER_PHASE.ANGRY);
  const dispatch = useDispatch();

  const activeCustomers = activeCustomerIds.map(id => customers[id]);

  return (
    <Card
      title={
        <CustomerTitle
          arrivingCustomers={
            arrivingCustomerIds.length + activeCustomers.length
          }
          doneCustomers={doneCustomerIds.length}
          angryCustomers={angryCustomerIds.length}
          totalCustomers={Object.values(customers).length}
        />
      }
      style={{ minHeight: "90vh" }}
    >
      {activeCustomers.map(customer => (
        <Customer
          customer={customer}
          takeOrder={() => dispatch(orderTaken(customer.orderId))}
          onTimeExceeded={(type, time) =>
            dispatch(exceedWaitingTime(customer, type, time))
          }
          key={customer.id}
        />
      ))}
    </Card>
  );
}
