import { ORDER_PHASE, PREPARATION_PHASE } from "./order/business";
import { CUSTOMER_PHASE } from "./customer/business";
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
  ORDER_TAKEN,
  WAITING_TIME_CHANGED
} from "./actions";

const initialState = {
  running: false,
  customers: {},
  activeCustomerIds: [],
  takenOrderIds: [],
  cooks: {},
  orders: {},
  levelId: null,
  levels: null
};

function customerAdded(state, { payload: customer }) {
  const customers = { ...state.customers };
  customers[customer.id] = customer;
  return { ...state, customers };
}

function customerPhaseChanged(state, action) {
  const { customerId, phase } = action;
  const customers = { ...state.customers };
  const customer = { ...customers[action.customerId] };
  customer.phase = phase;
  customers[customerId] = customer;

  let activeCustomerIds = [...state.activeCustomerIds];
  if (phase === CUSTOMER_PHASE.ACTIVE) {
    activeCustomerIds.push(customerId);
  } else {
    const index = activeCustomerIds.findIndex(id => id === customerId);
    if (index > -1) {
      activeCustomerIds.splice(index, 1);
    }
  }

  activeCustomerIds = [...new Set([...activeCustomerIds])];
  return { ...state, customers, activeCustomerIds };
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
  const orders = { ...state.orders };
  const order = { ...orders[orderId] };
  order.phase = ORDER_PHASE.TAKEN;
  orders[orderId] = order;

  return { ...state, orders };
}

function orderDone(state, action) {
  const { orderId, customerId, cookId } = action;
  const orders = { ...state.orders };
  const nextOrders = removeId(orders, orderId);

  const customers = { ...state.customers };
  const nextCustomers = removeId(customers, customerId);

  const cooks = { ...state.cooks };
  const cook = cooks[cookId];
  if (cook) {
    cook.orderId = null;
    cooks[cookId] = cook;
  }

  return { ...state, orders: nextOrders, customers: nextCustomers };
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

  let customers = { ...state.customers };

  if (dish.phases.length === 0) {
    const customer = { ...customers[order.customerId] };
    customer.phase = CUSTOMER_PHASE.DONE;
    customers[order.customerId] = customer;
    orders = removeId(orders, order.id);
  }

  return { ...state, cooks, orders, customers };
}

function waitingTimeChanged(state, action) {
  const { customerId, time, waitingTimeType } = action;
  const customers = { ...state.customers };
  const customer = { ...customers[customerId] };
  const waitingTime = { ...customer.waitingTimes[waitingTimeType] };
  waitingTime.time = time;
  customer.waitingTimes[waitingTimeType] = waitingTime;
  customers[customerId] = customer;
  return { ...state, customers };
}

export const reducer = createReducer(initialState, {
  [LEVELS_LOADED]: function levelsLoaded(state, { payload }) {
    return { ...state, levels: payload };
  },
  [GAME_STARTED]: function gameStarted(state, { payload }) {
    return { ...state, running: true, levelId: payload };
  },
  [GAME_STOPPED]: function gameStopped(state) {
    return {
      ...state,
      level: null,
      running: false,
      customers: {},
      orders: {}
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
  [ORDER_PHASE_FINISHED]: orderPhaseFinished,
  [WAITING_TIME_CHANGED]: waitingTimeChanged
});
