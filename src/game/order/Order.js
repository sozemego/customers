import React from "react";
import _ from "lodash";
import {
  getPresentParticiple,
  getVerb,
  PREPARATION_PHASE,
  PREPARATION_PHASE_TIME
} from "./business";
import { css } from "glamor";
import { Row, Button, Card } from "antd";
import { InfoCard } from "../../components/InfoCard";
import { capitaliseFirst } from "../../utils";
import { useTimer } from "../../hooks/timer";
import { EmptyTimer } from "../../components/EmptyTimer";
import { getCooks, getCustomers } from "../selectors";
import { finishPhase, orderNextPhaseStarted } from "../actions";
import { useDispatch } from "react-redux";

const titleContainer = css({
  label: "TITLE",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
});

const waitingContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
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
  const { customerId, dish } = order;
  const { phase: dishStatus } = dish;
  const nextDishStatus = _.get(dish, "phases[0]", "");

  const dispatch = useDispatch();
  const customers = getCustomers();
  let cooks = getCooks();
  const customer = customers[customerId];

  const currentCook = cooks[order.cookId];
  const orderTime =
    _.get(currentCook, "speed", 0) * PREPARATION_PHASE_TIME[dishStatus];
  cooks = nextDishStatus ? Object.values(cooks) : [];

  const runTimer = !!currentCook;
  const { time } = useTimer(100, 100, orderTime || 0, !!runTimer, () => {});

  function createButtonText(cook) {
    return `${cook.name} ${Number(
      (cook.speed * PREPARATION_PHASE_TIME[nextDishStatus]) / 1000
    ).toFixed(1)}s`;
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
    <Card title={title()} data-testid={`order-id-${order.id}`}>
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
              <EmptyTimer
                time={orderTime}
                start={true}
                onFinish={() => {
                  dispatch(finishPhase(order.id, currentCook.id));
                }}
              />
            </div>
          )}
        </div>
        <div className={cookButtonsStyle}>
          {cooks.map(cook => (
            <div key={cook.id}>
              <Button
                type={"primary"}
                style={{ margin: "4px" }}
                onClick={() =>
                  dispatch(orderNextPhaseStarted(order.id, cook.id))
                }
                disabled={
                  !!cook.orderId || dish.phase !== PREPARATION_PHASE.WAITING
                }
                data-testid={`next-phase-${order.id}`}
              >
                {createButtonText(cook)}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
