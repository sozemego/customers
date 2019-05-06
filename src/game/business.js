export function leaveAt(order) {
  const { dish } = order;
  return (dish.maxTime * 2) / 1000;
}

export const WAITING_TIME_TYPE = {
  WAITING: "WAITING",
  ORDER: "ORDER"
};
