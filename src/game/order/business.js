import _ from "lodash";
import {
  DISH,
  PREPARATION_PHASE,
  PREPARATION_PHASE_TIME
} from "../dish/business";

let id = 0;

export function createOrder(dish = createDish()) {
  const order = {
    id: ++id,
    dish,
    cookId: null,
    customerId: null
  };
  return order;
}

export function createDish(name) {
  if (!name) {
    const index = _.random(0, Object.keys(DISH).length - 1, false);
    name = Object.keys(DISH)[index];
  }
  const dishPrototype = DISH[name];
  const dish = _.cloneDeep(dishPrototype);
  dish.phase = PREPARATION_PHASE.WAITING;
  dish.maxTime = calculateMaxTime(dish);
  return dish;
}

function calculateMaxTime(dish) {
  const { phases } = dish;
  let time = 0;
  phases.forEach(phase => {
    time += PREPARATION_PHASE_TIME[phase];
  });
  return time;
}

const PHASE_PRESENT_PARTICIPLE_MAP = {
  [PREPARATION_PHASE.WAITING]: "waiting",
  [PREPARATION_PHASE.GATHER_INGREDIENTS]: "gathering ingredients",
  [PREPARATION_PHASE.MIX]: "mixing",
  [PREPARATION_PHASE.BAKE]: "baking",
  [PREPARATION_PHASE.SERVE]: "serving"
};

export function getPresentParticiple(phase) {
  return PHASE_PRESENT_PARTICIPLE_MAP[phase] || phase;
}

const PHASE_VERB_MAP = {
  [PREPARATION_PHASE.WAITING]: "wait",
  [PREPARATION_PHASE.GATHER_INGREDIENTS]: "gather ingredients",
  [PREPARATION_PHASE.MIX]: "mix",
  [PREPARATION_PHASE.BAKE]: "bake",
  [PREPARATION_PHASE.SERVE]: "serve"
};

export function getVerb(phase) {
  return PHASE_VERB_MAP[phase] || phase;
}
