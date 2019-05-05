import { useSelector } from "react-redux";

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

export function getActiveCustomerIds(getState) {
  return createSelector(game => game.activeCustomerIds)(getState);
}

export function getOrders(getState) {
  return createSelector(game => game.orders)(getState);
}

export function getCooks(getState) {
  return createSelector(game => game.cooks)(getState);
}
