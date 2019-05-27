import _ from "lodash";

export const SKILL_SERVER = "SKILL_SERVER";
export const SKILL_BAKER = "SKILL_BAKER";
export const SKILL_PLEASER = "SKILL_PLEASER";
export const SKILL_MIXER = "SKILL_MIXER";
export const SKILL_COOK = "SKILL_COOK";

export const SKILL = {
  [SKILL_SERVER]: {
    id: SKILL_SERVER,
    name: "Master server",
    description: "Decreases serving time by 5% per level",
    level: 1,
		icon: "🤹🏿‍♂️"
  },
  [SKILL_BAKER]: {
    id: SKILL_BAKER,
    name: "Master baker",
    description: "Decrease baking time by 5% per level",
    level: 1,
		icon: "🔥"
  },
  [SKILL_PLEASER]: {
    id: SKILL_PLEASER,
    name: "People pleaser",
    description:
      "When order phase is done, increases waiting time by 2% per level",
    level: 1,
		icon: "😎"
  },
  [SKILL_MIXER]: {
    id: SKILL_MIXER,
    name: "Master mixer",
    description: "Decrease mixing time by 5% per level",
    level: 1,
		icon: "👩🏼‍🔬"
  },
	[SKILL_COOK]: {
  	id: SKILL_COOK,
		name: "Master cook",
		description: "Decrease time of all actions by 1% per level",
		level: 1,
		icon: "👩‍🍳"
	}
};

export function getSkill(name) {
  const skill = SKILL[name];
  if (!skill) {
    throw new Error(`${name} skill does not exist`);
  }
  return _.cloneDeep(skill);
}
