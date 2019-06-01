import faker from "faker";

export const CUSTOMER_PHASE = {
  ARRIVING: "ARRIVING",
  ACTIVE: "ACTIVE",
  DONE: "DONE",
  ANGRY: "ANGRY"
};

export function createCustomer(customerData) {
  const random = Math.floor(Math.random() * 9);
  const customer = {
    id: customerData.id,
    name: faker.name.firstName(),
    orderId: null,
    avatar: faker.image.avatar(24, 24, true),
    time: customerData.time
  };
  return customer;
}
