import { createCustomer, CUSTOMER_PHASE } from "./customer/business";
import { createOrder } from "./order/business";
import {
  getActions,
  getCooks,
  getCustomers,
  getLevels,
  getOrderIdToResult,
  getOrders
} from "./selectors";
import { makeActionCreator, makePayloadActionCreator } from "../store/utils";
import { leaveAt, WAITING_TIME_TYPE } from "./business";
import { createCook, getFromLocalStorage } from "./cook/business";
import { createDish } from "./dish/business";

export const GAME_STARTED = "GAME_STARTED";
export const gameStarted = makePayloadActionCreator(GAME_STARTED);

export const GAME_PAUSED = "GAME_PAUSED";
export const gamePaused = makePayloadActionCreator(GAME_PAUSED);

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

export const COOKS_RESET = "COOKS_RESET";
export const cooksReset = makeActionCreator(COOKS_RESET);

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
  "cookId",
  "result"
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

export const COOK_GAINED_EXPERIENCE = "COOK_GAINED_EXPERIENCE";
export const cookGainedExperience = makeActionCreator(
  COOK_GAINED_EXPERIENCE,
  "cookId",
  "experience"
);

export const COOK_LEARNED_SKILL = "COOK_LEARNED_SKILL";
export const cookLearnedSkill = makeActionCreator(
  COOK_LEARNED_SKILL,
  "cookId",
  "skillId"
);

export const ACTION_REGISTERED = "ACTION_REGISTERED";
export const actionRegistered = makeActionCreator(
  ACTION_REGISTERED,
  "action",
  "timestamp"
);

export const LEVEL_FINISHED = "LEVEL_FINISHED";
export const levelFinished = makeActionCreator(LEVEL_FINISHED);

export function startGame(levelId) {
  return function startGame(dispatch, getState) {
    if (!levelId) {
      levelId = Object.keys(getLevels(getState))[0];
    }

    dispatch(stopGame());
    dispatch(loadCooks());

    setTimeout(() => {
      dispatch(startLevel(levelId));
    }, 0);
  };
}

export function loadCooks() {
  return function loadCooks(dispatch, getState) {
    dispatch(cooksReset());
    const cooks = getFromLocalStorage();
    if (cooks.length === 0) {
      dispatch(cookAdded(createCook()));
      dispatch(cookAdded(createCook()));
    } else {
      cooks.forEach(cook => dispatch(cookAdded(cook)));
    }
  };
}

export function startLevel(levelId = 1) {
  return function startLevel(dispatch, getState) {
    const levels = getLevels(getState);
    const level = levels[levelId];

    const { customers } = level;

    customers.forEach(customerData => {
      const customer = createCustomer(customerData);
      dispatch(customerAdded(customer));
      const order = createOrder(createDish(customerData.dish));
      dispatch(orderAdded(order));
      dispatch(orderAttachedToCustomer(order.id, customer.id));
    });

    dispatch(gameStarted(levelId));
  };
}

export function stopGame() {
  return function stopGame(dispatch, getState) {
    dispatch(gameStopped());
  };
}

export function exceedWaitingTime(customer, type, time) {
  return function exceedWaitingTime(dispatch, getState) {
    const order = getOrders(getState)[customer.orderId];
    if (!order) {
      return;
    }
    const maxTime = leaveAt(order, type);
    if (time >= maxTime) {
      dispatch(
        customerPhaseChanged(customer.id, CUSTOMER_PHASE.ANGRY, Date.now())
      );
      //need to remove order as well
      const cook = getCooks(getState)[order.cookId];
      if (type === WAITING_TIME_TYPE.ORDER) {
        dispatch(
          finishOrder(order.id, customer.id, cook ? cook.id : null, {
            percent: 0
          })
        );
      }
    }
  };
}

export function finishPhase(orderId, cookId) {
  return (dispatch, getState) => {
    dispatch(orderPhaseFinished(orderId, cookId));

    const order = getOrders(getState)[orderId];
    const customers = getCustomers(getState);
    const customer = customers[order.customerId];

    //The following needs to happen after order phase is finished
    //1. Assigned cook gets experience
    dispatch(cookGainedExperience(cookId, 1));
    //2. If dish has no more phases, it means it's done
    if (order.dish.phases.length === 0) {
      dispatch(
        customerPhaseChanged(order.customerId, CUSTOMER_PHASE.DONE, Date.now())
      );

      const customerActions = getActions(
        CUSTOMER_PHASE_CHANGED,
        getState
      ).filter(({ action }) => action.customerId === customer.id);
      const orderActions = getActions(ORDER_TAKEN, getState).filter(
        ({ action }) => action.payload === orderId
      );
      const arrivedAtTime = arrivedAt(customerActions);
      const orderTakenAtTime = orderTakenAt(orderActions);
      const timeUntilTaken = orderTakenAtTime - arrivedAtTime;
      const maxWaitTime = leaveAt(order, WAITING_TIME_TYPE.WAITING) * 1000;
      const maxOrderTime = leaveAt(order, WAITING_TIME_TYPE.ORDER) * 1000;
      const timeOfResultReductionWait = maxWaitTime * 0.65;
      const timeOfResultReductionOrder = maxOrderTime * 0.65;
      const waitReductionInterval = maxWaitTime - timeOfResultReductionWait;
      const orderReductionInterval = maxOrderTime - timeOfResultReductionOrder;

      //3. calculate penalty based on time until order was taken
      let takingOrderPart = 50;
      const takenTimeOver = timeUntilTaken - timeOfResultReductionWait;
      if (takenTimeOver > 0) {
        const reduction = takenTimeOver / waitReductionInterval;
        takingOrderPart = round(takingOrderPart - takingOrderPart * reduction);
      }

      //4. calculate penalty based on time until order was done
      let makingOrderPart = 50;
      const orderDoneTimeOver =
        doneAt(customerActions) - orderTakenAtTime - timeOfResultReductionOrder;
      if (orderDoneTimeOver > 0) {
        const reduction = orderDoneTimeOver / orderReductionInterval;
        makingOrderPart = round(makingOrderPart - makingOrderPart * reduction);
      }
      //4. find out how much time has passed since order was taken and order was served
      dispatch(
        finishOrder(orderId, order.customerId, cookId, {
          percent: takingOrderPart + makingOrderPart
        })
      );
    }
  };
}

function arrivedAt(actions) {
  const activeAction = actions.filter(
    ({ action }) => action.phase === CUSTOMER_PHASE.ACTIVE
  )[0];
  return activeAction.timestamp;
}

function doneAt(actions) {
  const doneActions = actions.filter(
    ({ action }) => action.phase === CUSTOMER_PHASE.DONE
  );
  if (doneActions.length === 0) {
    throw new Error("Customer needs to have a DONE phase");
  }
  return doneActions[0].timestamp;
}

function orderTakenAt(actions) {
  return actions[0].timestamp;
}

function round(percentage) {
  return Number(percentage.toFixed(0));
}

export function finishOrder(orderId, customerId, cookId, result) {
  return function finishOrder(dispatch, getState) {
    dispatch(orderDone(orderId, customerId, cookId, result));

    const orderCount = Object.values(getOrders(getState)).length;
    const resultCount = Object.values(getOrderIdToResult(getState)).length;

    if (orderCount === resultCount) {
      dispatch(levelFinished());
    }
  };
}
