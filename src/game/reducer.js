import { createReducer } from "../store/utils";
import {
  COOK_ADDED,
  COOK_GAINED_EXPERIENCE,
  CUSTOMER_ADDED,
  CUSTOMER_PHASE_CHANGED,
  ACTION_REGISTERED,
  GAME_STARTED,
  GAME_STOPPED,
  LEVELS_LOADED,
  ORDER_ADDED,
  ORDER_ATTACHED_TO_CUSTOMER,
  ORDER_DONE,
  ORDER_NEXT_PHASE_STARTED,
  ORDER_PHASE_FINISHED,
  ORDER_TAKEN,
  LEVEL_FINISHED,
  COOKS_RESET,
  GAME_PAUSED,
  COOK_LEARNED_SKILL
} from "./actions";
import { CUSTOMER_PHASE } from "./customer/business";
import { getSkill, saveToLocalStorage, SKILL_PLEASER } from "./cook/business";
import { PREPARATION_PHASE } from "./dish/business";

const initialState = {
  running: false,
  paused: false,
  customers: {},
  cooks: {},
  orders: {},
  customerPhase: {},
  takenOrderIds: [],
  orderIdToResult: {},
  actions: [],
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
  const cook = { ...cooks[cookId] };
  const { experience: cookExperience, nextLevel } = cook;
  const nextExperience = cookExperience + experience;
  if (nextExperience >= nextLevel) {
    cook.level += 1;
    cook.experience = 0;
    cook.speed -= 0.01;
    cook.nextLevel = nextLevel * 2;
    cook.skillsToTake += 1;
  } else {
    cook.experience = nextExperience;
  }
  cooks[cookId] = cook;
  return { ...state, cooks };
}

function cookLearnedSkill(state, action) {
  const { cookId, skillId } = action;
  const cooks = { ...state.cooks };
  const cook = { ...cooks[cookId] };
  cook.skillsToTake -= 1;
  const learnedSkill = cook.skills[skillId];
  if (learnedSkill) {
    learnedSkill.level += 1;
    cook.skills[skillId] = learnedSkill;
  } else {
    cook.skills[skillId] = getSkill(skillId);
  }
  cooks[cookId] = cook;
  const orderCount = Object.values(state.orders).length;
  const resultCount = Object.values(state.orderIdToResult).length;

  if (orderCount === resultCount) {
    saveToLocalStorage(state.cooks);
  }
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

  const skillPleaser = cook.skills[SKILL_PLEASER];
  if (skillPleaser) {
    const level = skillPleaser.level;
    order.timeIncrease += level * 0.02;
  }
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
  const actions = [...state.actions];
  actions.push({ action: registeredAction, timestamp });
  return { ...state, actions };
}

export const reducer = createReducer(initialState, {
  [LEVELS_LOADED]: function levelsLoaded(state, { payload }) {
    return { ...state, levels: payload };
  },
  [LEVEL_FINISHED]: function levelFinished(state, action) {
    saveToLocalStorage(state.cooks);
    return { ...state, paused: true };
  },
  [GAME_STARTED]: function gameStarted(state, { payload }) {
    return { ...state, running: true, levelId: payload };
  },
  [GAME_STOPPED]: function gameStopped(state) {
    const levels = { ...state.levels };
    return {
      ...initialState,
      levels
    };
  },
  [GAME_PAUSED]: function gamePaused(state, action) {
    return { ...state, paused: action.payload };
  },
  [CUSTOMER_ADDED]: customerAdded,
  [CUSTOMER_PHASE_CHANGED]: customerPhaseChanged,
  [COOK_ADDED]: cookAdded,
  [COOKS_RESET]: function cooksReset(state, action) {
    return { ...state, cooks: {} };
  },
  [COOK_GAINED_EXPERIENCE]: cookGainedExperience,
  [COOK_LEARNED_SKILL]: cookLearnedSkill,
  [ORDER_ADDED]: orderAdded,
  [ORDER_ATTACHED_TO_CUSTOMER]: orderAttachedToCustomer,
  [ORDER_TAKEN]: orderTaken,
  [ORDER_DONE]: orderDone,
  [ORDER_NEXT_PHASE_STARTED]: orderNextPhaseStarted,
  [ORDER_PHASE_FINISHED]: orderPhaseFinished,
  [ACTION_REGISTERED]: actionRegistered
});
