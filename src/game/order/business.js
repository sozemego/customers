import _ from "lodash";
import {
  createDish,
  PREPARATION_PHASE,
  PREPARATION_PHASE_TIME
} from "../dish/business";
import { SKILL_BAKER, SKILL_COOK, SKILL_MIXER } from "../cook/business";

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

export function getOrderPhaseTime(cook, order, phase) {
  if (!cook) {
    return null;
  }
  const speed = _.get(cook, "speed", 0);
  const speedPercent = speed * 100;
  const basePhaseTime = PREPARATION_PHASE_TIME[phase];
  const decreaseFromSkill = getTimeDecreaseFromSkill(cook, phase);
  const speedDecrease = 100 - speedPercent + decreaseFromSkill;
  const speedMultiplier = (100 - speedDecrease) / 100;

  return speedMultiplier * basePhaseTime;
}

export function getTimeDecreaseFromSkill(cook, phase) {
  const { skills } = cook;
  let decrease = 0;
  if (phase === PREPARATION_PHASE.BAKE) {
    const baker = skills[SKILL_BAKER];
    if (baker) {
      decrease += baker.level * 5;
    }
  }
  if (phase === PREPARATION_PHASE.GATHER_INGREDIENTS) {
  }
  if (phase === PREPARATION_PHASE.MIX) {
    const mixer = skills[SKILL_MIXER];
    if (mixer) {
      decrease = mixer.level * 5;
    }
  }
  if (phase === PREPARATION_PHASE.SERVE) {
  }
  const cookSkill = skills[SKILL_COOK];
  if (cookSkill) {
    decrease += cookSkill.level;
  }

  return decrease;
}
