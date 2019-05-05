import _ from "lodash";

let id = 0;

export function createOrder(dish = createDish()) {
  const order = {
    id: ++id,
    dish,
    cookId: null,
    customerId: null,
  };
  return order;
}

export const PREPARATION_PHASE = {
  WAITING: "WAITING",
  GATHER_INGREDIENTS: "GATHER_INGREDIENTS",
  MIX: "MIX",
  BAKE: "BAKE",
  SERVE: "SERVE"
};

const DISH = {
  SALAD: {
    name: "Salad",
    avatar:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/whatsapp/186/green-salad_1f957.png",
    phases: [
      PREPARATION_PHASE.GATHER_INGREDIENTS,
      PREPARATION_PHASE.MIX,
      PREPARATION_PHASE.SERVE
    ]
  },
  PIZZA: {
    name: "Pizza",
    avatar:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/whatsapp/116/slice-of-pizza_1f355.png",
    phases: [
      PREPARATION_PHASE.GATHER_INGREDIENTS,
      PREPARATION_PHASE.MIX,
      PREPARATION_PHASE.BAKE,
      PREPARATION_PHASE.SERVE
    ]
  }
};

export const PREPARATION_PHASE_TIME = new Proxy(
  {
    [PREPARATION_PHASE.GATHER_INGREDIENTS]: 6000,
    [PREPARATION_PHASE.MIX]: 12000,
    [PREPARATION_PHASE.BAKE]: 20000,
    [PREPARATION_PHASE.SERVE]: 5000
  },
  {
    get: (target, p, receiver) => {
      return target[p] / 1;
    }
  }
);

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
