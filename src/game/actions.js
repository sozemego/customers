import { createCustomer, CUSTOMER_PHASE, isDone } from "./customer/business";
import { createDish, createOrder } from "./order/business";
import { getCooks, getCustomers, getLevels, getOrders } from "./selectors";
import { makeActionCreator, makePayloadActionCreator } from "../store/utils";
import { leaveAt, WAITING_TIME_TYPE } from "./business";

export const GAME_STARTED = "GAME_STARTED";
export const gameStarted = makePayloadActionCreator(GAME_STARTED);

export const LEVELS_LOADED = "LEVELS_LOADED";
export const levelsLoaded = makePayloadActionCreator(LEVELS_LOADED);

export const GAME_STOPPED = "GAME_STOPPED";
export const gameStopped = makeActionCreator(GAME_STOPPED);

export const CUSTOMER_ADDED = "CUSTOMER_ADDED";
export const customerAdded = makePayloadActionCreator(CUSTOMER_ADDED);

export const CUSTOMER_PHASE_CHANGED = "CUSTOMER_PHASE_CHANGED";
export const customerPhaseChanged = makeActionCreator(
  CUSTOMER_PHASE_CHANGED,
  "customerId",
  "phase",
  "time"
);

export const COOK_ADDED = "COOK_ADDED";
export const cookAdded = makePayloadActionCreator(COOK_ADDED);

export const ORDER_ADDED = "ORDER_ADDED";
export const orderAdded = makePayloadActionCreator(ORDER_ADDED);

export const ORDER_ATTACHED_TO_CUSTOMER = "ORDER_ATTACHED_TO_CUSTOMER";
export const orderAttachedToCustomer = makeActionCreator(
  ORDER_ATTACHED_TO_CUSTOMER,
  "orderId",
  "customerId"
);

export const ORDER_TAKEN = "ORDER_TAKEN";
export const orderTaken = makePayloadActionCreator(ORDER_TAKEN);

export const ORDER_DONE = "ORDER_DONE";
export const orderDone = makeActionCreator(
  ORDER_DONE,
  "orderId",
  "customerId",
  "cookId"
);

export const ORDER_NEXT_PHASE_STARTED = "ORDER_NEXT_PHASE_STARTED";
export const orderNextPhaseStarted = makeActionCreator(
  ORDER_NEXT_PHASE_STARTED,
  "orderId",
  "cookId"
);

export const ORDER_PHASE_FINISHED = "ORDER_PHASE_FINISHED";
export const orderPhaseFinished = makeActionCreator(
  ORDER_PHASE_FINISHED,
  "orderId",
  "cookId"
);

export function startGame(levelId = 1) {
  return function startGame(dispatch, getState) {
    dispatch(stopGame());
    dispatch(startLevel(levelId));
  };
}

const customerTimeouts = [];

export function startLevel(levelId = 1) {
  return function startLevel(dispatch, getState) {
    const levels = getLevels(getState);
    const level = levels[levelId];

    const { customers } = level;

    customers.forEach(customerData => {
      const customer = createCustomer(customerData.id);
      dispatch(customerAdded(customer));
      const order = createOrder(createDish(customerData.dish));
      dispatch(orderAdded(order));
      dispatch(orderAttachedToCustomer(order.id, customer.id));
      const timeoutId = setTimeout(() => {
        dispatch(
          customerPhaseChanged(
            customerData.id,
            CUSTOMER_PHASE.ACTIVE,
            Date.now()
          )
        );
      }, customerData.time);
      customerTimeouts.push(timeoutId);
    });

    dispatch(gameStarted(levelId));
  };
}

export function stopGame() {
  return function stopGame(dispatch, getState) {
    dispatch(gameStopped());
    customerTimeouts.forEach(clearTimeout);
  };
}

export function exceedWaitingTime(customer, type, time) {
  return function exceedWaitingTime(dispatch, getState) {
    const order = getOrders(getState)[customer.orderId];
    if (!order) {
      return;
    }
    const maxTime = leaveAt(order);
    if (time >= maxTime) {
      dispatch(
        customerPhaseChanged(customer.id, CUSTOMER_PHASE.ANGRY, Date.now())
      );
      //need to remove order as well
      const cook = getCooks(getState)[order.cookId];
      if (type === WAITING_TIME_TYPE.ORDER) {
        dispatch(orderDone(order.id, customer.id, cook ? cook.id : null));
      }
    }
  };
}

export function finishPhase(order, cook) {
  return (dispatch, getState) => {
    dispatch(orderPhaseFinished(order.id, cook.id));

    //1 check if all customers are done!
    const customers = Object.values(getCustomers(getState));
    const doneCustomers = customers.filter(isDone);
    if (doneCustomers.length === customers.length) {
      // const level = getLevelId(getState);
      // const levels = getLevels(getState);
      // const nextLevelNumber = level + 1;
      // const nextLevel = levels[nextLevelNumber];
      // // dispatch(stopGame());
      // if (nextLevel) {
      //   // dispatch(startLevel(nextLevelNumber));
      // } else {
      //   // dispatch(startLevel(1));
      // }
    }
  };
}
