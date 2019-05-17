import { PREPARATION_PHASE } from "./order/business";
import { createReducer } from "../store/utils";
import {
  COOK_ADDED,
  COOK_GAINED_EXPERIENCE,
  CUSTOMER_ADDED,
  CUSTOMER_PHASE_CHANGED, ACTION_REGISTERED,
  GAME_STARTED,
  GAME_STOPPED,
  LEVELS_LOADED,
  ORDER_ADDED,
  ORDER_ATTACHED_TO_CUSTOMER,
  ORDER_DONE,
  ORDER_NEXT_PHASE_STARTED,
  ORDER_PHASE_FINISHED,
  ORDER_TAKEN
} from "./actions";
import { CUSTOMER_PHASE } from "./customer/business";

const initialState = {
  running: false,
  customers: {},
  cooks: {},
  orders: {},
  customerPhase: {},
  takenOrderIds: [],
  orderIdToResult: {},
  events: [],
  levelId: null,
  levels: null
};

let orderResultId = 0;

function customerAdded(state, { payload: customer }) {
  const customers = { ...state.customers };
  customers[customer.id] = customer;
  const customerPhase = { ...state.customerPhase };
  customerPhase[customer.id] = [
    {
      phase: CUSTOMER_PHASE.ARRIVING,
      time: Date.now()
    }
  ];
  return { ...state, customers, customerPhase };
}

function customerPhaseChanged(state, action) {
  const { customerId, phase, time } = action;
  const customerPhase = { ...state.customerPhase };
  const customerPhases = [...customerPhase[customerId]];
  customerPhases.push({
    phase,
    time
  });
  customerPhase[customerId] = customerPhases;

  const orderIdToResult = { ...state.orderIdToResult };
  const orderId = state.customers[customerId].orderId;
  if (phase === CUSTOMER_PHASE.ANGRY) {
    orderIdToResult[orderId] = { percent: 0, orderId, id: ++orderResultId };
  }

  return { ...state, customerPhase, orderIdToResult };
}

function cookAdded(state, { payload: cook }) {
  const cooks = { ...state.cooks };
  cooks[cook.id] = cook;
  return { ...state, cooks };
}

function cookGainedExperience(state, action) {
  const { cookId, experience } = action;
  const cooks = { ...state.cooks };
  const cook = cooks[cookId];
  const { experience: cookExperience, nextLevel } = cook;
  const nextExperience = cookExperience + experience;
  if (nextExperience >= nextLevel) {
    cook.level += 1;
    cook.experience = 0;
    cook.speed = Number(Number(cook.speed * 0.9).toFixed(1));
    cook.nextLevel = nextLevel * 2;
  } else {
    cook.experience = nextExperience;
  }
  cooks[cookId] = cook;
  return { ...state, cooks };
}

function orderAdded(state, { payload: order }) {
  const orders = { ...state.orders };
  orders[order.id] = order;
  return { ...state, orders };
}

function orderAttachedToCustomer(state, action) {
  const { customerId, orderId } = action;
  const orders = { ...state.orders };
  const order = { ...orders[orderId] };
  order.customerId = customerId;
  orders[orderId] = order;

  const customers = { ...state.customers };
  const customer = { ...customers[customerId] };
  customer.orderId = orderId;
  customers[customerId] = customer;
  return { ...state, orders, customers };
}

function orderTaken(state, { payload: orderId }) {
  const takenOrderIds = [...state.takenOrderIds];
  takenOrderIds.push(orderId);
  return { ...state, takenOrderIds };
}

function orderNextPhaseStarted(state, action) {
  const { orderId, cookId } = action;
  const cooks = { ...state.cooks };
  const cook = { ...cooks[cookId] };
  cook.orderId = orderId;
  cooks[cookId] = cook;

  const orders = { ...state.orders };
  const order = { ...orders[orderId] };
  const dish = { ...order.dish };
  dish.phase = dish.phases[0];
  dish.phases = dish.phases.slice(1);
  order.dish = dish;
  order.cookId = cookId;
  orders[orderId] = order;

  return { ...state, cooks, orders };
}

function orderPhaseFinished(state, action) {
  const { orderId, cookId } = action;

  const cooks = { ...state.cooks };
  const cook = { ...cooks[cookId] };
  cook.orderId = null;
  cooks[cookId] = cook;

  const orders = { ...state.orders };
  const order = { ...orders[orderId] };
  const dish = { ...order.dish };
  dish.phase = PREPARATION_PHASE.WAITING;
  order.dish = dish;
  order.cookId = null;
  orders[orderId] = order;

  return {
    ...state,
    cooks,
    orders
  };
}

function orderDone(state, action) {
  const { orderId, cookId, result } = action;
  const takenOrderIds = [...state.takenOrderIds];
  const index = takenOrderIds.findIndex(id => id === orderId);
  if (index > -1) {
    takenOrderIds.splice(index, 1);
  }

  const cooks = { ...state.cooks };
  const cook = cooks[cookId];
  if (cook) {
    cook.orderId = null;
    cooks[cookId] = cook;
  }

  const orderIdToResult = { ...state.orderIdToResult };
  orderIdToResult[orderId] = {
    ...result,
    orderId,
    id: ++orderResultId
  };

  return { ...state, takenOrderIds, orderIdToResult };
}

export function actionRegistered(state, action) {
  const { action: registeredAction, timestamp } = action;
  const events = [...state.events];
  events.push({ action: registeredAction, timestamp });
  state[events] = events;
  return { ...state, events };
}

export const reducer = createReducer(initialState, {
  [LEVELS_LOADED]: function levelsLoaded(state, { payload }) {
    return { ...state, levels: payload };
  },
  [GAME_STARTED]: function gameStarted(state, { payload }) {
    return { ...state, running: true, levelId: payload };
  },
  [GAME_STOPPED]: function gameStopped(state) {
    const cooks = { ...state.cooks };
    const levels = { ...state.levels };
    return {
      ...initialState,
      levels,
      cooks
    };
  },
  [CUSTOMER_ADDED]: customerAdded,
  [CUSTOMER_PHASE_CHANGED]: customerPhaseChanged,
  [COOK_ADDED]: cookAdded,
  [COOK_GAINED_EXPERIENCE]: cookGainedExperience,
  [ORDER_ADDED]: orderAdded,
  [ORDER_ATTACHED_TO_CUSTOMER]: orderAttachedToCustomer,
  [ORDER_TAKEN]: orderTaken,
  [ORDER_DONE]: orderDone,
  [ORDER_NEXT_PHASE_STARTED]: orderNextPhaseStarted,
  [ORDER_PHASE_FINISHED]: orderPhaseFinished,
  [ACTION_REGISTERED]: actionRegistered,
});
