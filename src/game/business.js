export function leaveAt(order, type) {
  const { dish, timeIncrease } = order;
  const baseTime = (dish.maxTime * 2) / 1000;
  let additionalTime = 0;
  if (type === WAITING_TIME_TYPE.ORDER) {
    additionalTime = timeIncrease * baseTime;
  }
  return baseTime + additionalTime;
}

export const WAITING_TIME_TYPE = {
  WAITING: "WAITING",
  ORDER: "ORDER"
};
