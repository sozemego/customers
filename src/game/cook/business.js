import faker from "faker";
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
    nextLevel: 5
  };
}

export function getFromLocalStorage() {
  const cooks64 = localStorage.getItem("cooks");
  if (!cooks64) {
    return [];
  }

  const cooks = Object.values(decode64(cooks64, true));
  console.log(`Loaded ${cooks.length} cooks from localStorage`);
  return cooks;
}

export function saveToLocalStorage(cooks) {
  const cooks64 = encode64(cooks);
  localStorage.setItem("cooks", cooks64);
  console.log(`Saved ${Object.values(cooks).length} cooks to localStorage`);
}
