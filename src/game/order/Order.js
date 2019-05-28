import React from "react";
import _ from "lodash";
import { getOrderPhaseTime, getPresentParticiple, getVerb } from "./business";
import { css } from "glamor";
import { Button, Card } from "antd";
import { InfoCard } from "../../components/InfoCard";
import { capitaliseFirst } from "../../utils";
import { useTimer } from "../../hooks/timer";
import { getCooks, getCustomers, isOrderDone, isPaused } from "../selectors";
import { finishPhase, orderNextPhaseStarted } from "../actions";
import { useDispatch } from "react-redux";
import { PREPARATION_PHASE, PREPARATION_PHASE_TIME } from "../dish/business";

const titleContainer = css({
  label: "TITLE",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
});

const cookButtonsStyle = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap"
});

const orderInProgressContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
});

const rowContainer = css({
  minHeight: "68px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
});

export function Order({ order }) {
  const { customerId, dish, id } = order;
  const isDone = isOrderDone(id);
  const { phase: dishStatus } = dish;
  const nextDishStatus = _.get(dish, "phases[0]", "");

  const paused = isPaused();
  const dispatch = useDispatch();
  const customers = getCustomers();
  let cooks = getCooks();
  const customer = customers[customerId];

  const currentCook = cooks[order.cookId];
  const orderTime = getOrderPhaseTime(currentCook, order, dishStatus);
  cooks = nextDishStatus ? Object.values(cooks) : [];

  const runTimer = !!currentCook;
  const { time } = useTimer(
    100,
    100,
    orderTime || 0,
    paused ? false : !!runTimer,
    () => dispatch(finishPhase(order.id, currentCook.id)),
    true
  );

  function createButtonText(cook) {
    return `${cook.name} ${Number(
      getOrderPhaseTime(cook, order, nextDishStatus) / 1000
    ).toFixed(2)}s`;
  }

  function title() {
    return (
      <div className={titleContainer}>
        <InfoCard src={dish.avatar} name={`Ordered by ${customer.name}`} />
        <div>{capitaliseFirst(getPresentParticiple(dishStatus))}</div>
      </div>
    );
  }

  return (
    <Card title={title()} data-testid={isDone ? null : `order-id-${order.id}`}>
      <div className={rowContainer}>
        <div>
          {dish.phase === PREPARATION_PHASE.WAITING && (
            <div>{capitaliseFirst(getVerb(nextDishStatus))}</div>
          )}
          {dish.phase !== PREPARATION_PHASE.WAITING && (
            <div className={orderInProgressContainerStyle}>
              <InfoCard
                src={currentCook.avatar}
                name={`${currentCook.name} is ${getPresentParticiple(
                  dishStatus
                )} ${Number(time / 1000).toFixed(1)} / ${orderTime / 1000}s`}
              />
            </div>
          )}
        </div>
        <div className={cookButtonsStyle}>
          {cooks.map(cook => (
            <div key={cook.id}>
              <Button
                type={"primary"}
                style={{ margin: "4px", height: "100%" }}
                onClick={() =>
                  dispatch(orderNextPhaseStarted(order.id, cook.id))
                }
                disabled={
                  paused ||
                  !!cook.orderId ||
                  dish.phase !== PREPARATION_PHASE.WAITING
                }
                data-testid={`next-phase-${order.id}`}
              >
                <InfoCard src={cook.avatar} name={createButtonText(cook)} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
