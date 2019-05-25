import { createDish, PREPARATION_PHASE } from "../dish/business";

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
