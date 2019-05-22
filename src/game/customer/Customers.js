import React from "react";
import { Customer } from "./Customer";
import { Card } from "antd";
import { getCustomerIds, getCustomers, isPaused } from "../selectors";
import {
  customerPhaseChanged,
  exceedWaitingTime,
  orderTaken
} from "../actions";
import { useDispatch } from "react-redux";
import { CustomerTitle } from "./CustomerTitle";
import { CUSTOMER_PHASE } from "./business";
import { EmptyTimer } from "../../components/EmptyTimer";
import { useTransition, animated } from "react-spring";
import { InfoCard } from "../../components/InfoCard";

export function Customers(props) {
  const customers = getCustomers();
  const activeCustomerIds = getCustomerIds(CUSTOMER_PHASE.ACTIVE);
  const doneCustomerIds = getCustomerIds(CUSTOMER_PHASE.DONE);
  const arrivingCustomerIds = getCustomerIds(CUSTOMER_PHASE.ARRIVING);
  const angryCustomerIds = getCustomerIds(CUSTOMER_PHASE.ANGRY);
  const dispatch = useDispatch();
  const paused = isPaused();

  const activeCustomers = activeCustomerIds.map(id => customers[id]);
  const arrivingCustomers = arrivingCustomerIds.map(id => customers[id]);

  const transitions = useTransition(
    arrivingCustomers,
    function keyTransform(customer) {
      return customer.id;
    },
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config(customer, phase) {
        if (phase === "leave") {
          return { duration: 0 };
        }
        return { duration: customer.time };
      }
    }
  );

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
      {arrivingCustomers.map(customer => (
        <EmptyTimer
          key={customer.id}
          time={customer.time}
          start={!paused}
          onFinish={() => {
            dispatch(
              customerPhaseChanged(
                customer.id,
                CUSTOMER_PHASE.ACTIVE,
                Date.now()
              )
            );
          }}
        />
      ))}
      {transitions.map(({ item, key, props }) => (
        <animated.div key={key} style={props}>
          <InfoCard src={item.avatar} name={item.name} />
        </animated.div>
      ))}
    </Card>
  );
}
