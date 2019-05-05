import faker from "faker";

let id = 0;

export function createCook() {
  const cook = {
    id: ++id,
    name: faker.name.firstName(),
    avatar: faker.image.avatar(24, 24, true),
    orderId: null,
    speed: 1,
    level: 1,
    experience: 0,
    nextLevel: 5
  };
  return cook;
}
