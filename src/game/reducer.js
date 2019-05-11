import { PREPARATION_PHASE } from "./order/business";
import { removeId } from "../utils";
import { createReducer } from "../store/utils";
import {
  COOK_ADDED,
  CUSTOMER_ADDED,
  CUSTOMER_PHASE_CHANGED,
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
  levelId: null,
  levels: null
};

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
  if (phase === CUSTOMER_PHASE.DONE) {
    orderIdToResult[state.customers[customerId].orderId] = { percent: 100 };
  }
  if (phase === CUSTOMER_PHASE.ANGRY) {
    orderIdToResult[state.customers[customerId].orderId] = { percent: 0 };
  }

  return { ...state, customerPhase, orderIdToResult };
}

function cookAdded(state, { payload: cook }) {
  const cooks = { ...state.cooks };
  cooks[cook.id] = cook;
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

function orderDone(state, action) {
  const { orderId, customerId, cookId } = action;
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
    percent: 100
  };

  return { ...state, takenOrderIds, orderIdToResult };
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

// TODO move a lot of logic for this to a thunk
function orderPhaseFinished(state, action) {
  const { orderId, cookId } = action;
  const cooks = { ...state.cooks };
  const cook = { ...cooks[cookId] };
  cook.orderId = null;

  const { experience, nextLevel } = cook;
  const nextExperience = experience + 1;
  if (nextExperience >= nextLevel) {
    cook.level += 1;
    cook.experience = 0;
    cook.speed = Number(Number(cook.speed * 0.9).toFixed(1));
    cook.nextLevel = nextLevel * 2;
  } else {
    cook.experience = nextExperience;
  }

  cooks[cookId] = cook;

  let orders = { ...state.orders };
  const order = { ...orders[orderId] };
  const dish = { ...order.dish };
  dish.phase = PREPARATION_PHASE.WAITING;
  order.dish = dish;
  order.cookId = null;
  orders[orderId] = order;

  const customerPhase = { ...state.customerPhase };
  const takenOrderIds = [...state.takenOrderIds];
  const orderIdToResult = { ...state.orderIdToResult };
  if (dish.phases.length === 0) {
    const index = takenOrderIds.findIndex(id => id === orderId);
    if (index > -1) {
      takenOrderIds.splice(index, 1);
    }
    orders = removeId(orders, order.id);
    const customerPhases = [...customerPhase[order.customerId]];
    customerPhases.push({
      phase: CUSTOMER_PHASE.DONE,
      time: Date.now()
    });
    customerPhase[order.customerId] = customerPhases;
    orderIdToResult[order.id] = {
      percent: 100
    };
  }

  return {
    ...state,
    cooks,
    orders,
    takenOrderIds,
    customerPhase,
    orderIdToResult
  };
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
  [ORDER_ADDED]: orderAdded,
  [ORDER_ATTACHED_TO_CUSTOMER]: orderAttachedToCustomer,
  [ORDER_TAKEN]: orderTaken,
  [ORDER_DONE]: orderDone,
  [ORDER_NEXT_PHASE_STARTED]: orderNextPhaseStarted,
  [ORDER_PHASE_FINISHED]: orderPhaseFinished
});
