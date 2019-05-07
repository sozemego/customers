import { useSelector } from "react-redux";
import { CUSTOMER_PHASE } from "./customer/business";

function baseSelector(callback) {
  return function(state) {
    return callback(state.game);
  };
}

export function createSelector(callback) {
  return function selector(getState) {
    if (getState) {
      return baseSelector(callback)(
        typeof getState === "function" ? getState() : getState
      );
    }
    return useSelector(baseSelector(callback), []);
  };
}

export function isRunning(getState) {
  return createSelector(game => game.running)(getState);
}

export function getLevels(getState) {
  return createSelector(game => game.levels)(getState);
}

export function getLevelId(getState) {
  return createSelector(game => game.levelId)(getState);
}

export function getCustomers(getState) {
  return createSelector(game => game.customers)(getState);
}

export function getCustomerIds(phase, getState) {
  const customerPhase = createSelector(game => game.customerPhase)(getState);
  return Object.entries(customerPhase)
    .filter(([id, data]) => data.phase === phase)
    .sort((a, b) => a[1].time - b[1].time)
    .map(([id, phase]) => id);
}

export function getOrders(getState) {
  return createSelector(game => game.orders)(getState);
}

export function getCooks(getState) {
  return createSelector(game => game.cooks)(getState);
}

export function getTakenOrderIds(getState) {
  return createSelector(game => game.takenOrderIds)(getState);
}
