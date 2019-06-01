import faker from "faker";
import _ from "lodash";
import { decode64, encode64 } from "../../utils";

let id = 0;

export function createCook() {
  return {
    id: ++id,
    name: faker.name.firstName(),
    avatar: faker.image.avatar(24, 24, true),
    orderId: null,
    speed: 1,
    level: 1,
    experience: 0,
    nextLevel: 4,
    skills: {},
    skillsToTake: 0
  };
}

export function getFromLocalStorage() {
  const cooks64 = localStorage.getItem("cooks");
  if (!cooks64) {
    return [];
  }

  const cooks = Object.values(decode64(cooks64, true));
  cooks.forEach(cook => {
    const { skills } = cook;
    const nextSkills = {};
    Object.values(skills).forEach(skill => {
      const realSkill = getSkill(skill.id);
      realSkill.level = skill.level;
      nextSkills[skill.id] = realSkill;
    });
    cook.skills = nextSkills;
  });
  console.log(`Loaded ${cooks.length} cooks from localStorage`);
  return cooks;
}

export function saveToLocalStorage(cooks) {
  //1. cooks need to be stripped of skills first, because they contain emojis which cannot be base64'ed
  const cooksCopy = _.cloneDeep(cooks);
  Object.values(cooksCopy).forEach(cook => {
    const { skills } = cook;
    const nextSkills = {};
    Object.values(skills).forEach(skill => {
      nextSkills[skill.id] = {
        id: skill.id,
        level: skill.level
      };
    });
    cook.skills = nextSkills;
  });
  const cooks64 = encode64(cooksCopy);
  localStorage.setItem("cooks", cooks64);
  console.log(`Saved ${Object.values(cooks).length} cooks to localStorage`);
}

export const SKILL_SERVER = "SKILL_SERVER";
export const SKILL_BAKER = "SKILL_BAKER";
export const SKILL_PLEASER = "SKILL_PLEASER";
export const SKILL_MIXER = "SKILL_MIXER";
export const SKILL_COOK = "SKILL_COOK";
export const SKILL_GATHERER = "SKILL_GATHERER";

export const SKILL = {
  [SKILL_SERVER]: {
    id: SKILL_SERVER,
    name: "Master server",
    description: "Decreases serving time by 5% per skill level",
    takenDescription: level => `Decreases serving time by ${level * 5}%`,
    level: 1,
    icon: "🤹🏿‍♂️"
  },
  [SKILL_BAKER]: {
    id: SKILL_BAKER,
    name: "Master baker",
    description: "Decrease baking time by 5% per skill level",
    takenDescription: level => `Decreases baking time by ${level * 5}%`,
    level: 1,
    icon: "🔥"
  },
  [SKILL_PLEASER]: {
    id: SKILL_PLEASER,
    name: "People pleaser",
    description:
      "When order phase is done, increases time the customer can wait by 2% per skill level",
    takenDescription: level =>
      `When order phase is done, increases time the customer can wait by ${level *
        2}%`,
    level: 1,
    icon: "😎"
  },
  [SKILL_MIXER]: {
    id: SKILL_MIXER,
    name: "Master mixer",
    description: "Decrease mixing time by 5% per skill level",
    takenDescription: level => `Decreases mixing time by ${level * 5}%`,
    level: 1,
    icon: "👩🏼‍🔬"
  },
  [SKILL_COOK]: {
    id: SKILL_COOK,
    name: "Master cook",
    description: "Decrease time of all actions by 1% per skill level",
    takenDescription: level => `Decreases time of all actions by ${level * 1}%`,
    level: 1,
    icon: "👩‍🍳"
  },
  [SKILL_GATHERER]: {
    id: SKILL_GATHERER,
    name: "Master gatherer",
    description: "Decrease gathering ingredients time by 5% per skill level",
    takenDescription: level =>
      `Decreases gathering ingredients time by ${level * 5}%`,
    level: 1,
    icon: "👨‍🌾"
  }
};

export function getSkill(id) {
  const skill = SKILL[id];
  if (!skill) {
    throw new Error(`${id} skill does not exist`);
  }
  return _.cloneDeep(skill);
}
