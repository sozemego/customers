import faker from "faker";

export const CUSTOMER_PHASE = {
  ARRIVING: "ARRIVING",
  ACTIVE: "ACTIVE",
  DONE: "DONE"
};

export const WAITING_TIME_TYPE = {
  WAITING: "WAITING",
  ORDER: "ORDER"
};

export function createCustomer(id) {
  const random = Math.floor(Math.random() * 9);
  const customer = {
    id: id || ++id,
    name: faker.name.firstName(),
    orderId: null,
    avatar: `avatars/avatar_${random}.png`,
    waitingTimes: {
      [WAITING_TIME_TYPE.WAITING]: {
        time: 0,
        leaveAt: dish => (dish.maxTime * 2) / 1000
      },
      [WAITING_TIME_TYPE.ORDER]: {
        time: 0,
        leaveAt: dish => (dish.maxTime * 2) / 1000
      }
    }
  };
  return customer;
}

export function isDone(customer) {
  return customer.phase === CUSTOMER_PHASE.DONE;
}
