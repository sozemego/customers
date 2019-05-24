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

export function isPaused(getState) {
  return createSelector(game => game.paused)(getState);
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

export function getCustomerPhase(getState) {
  return createSelector(game => game.customerPhase)(getState);
}

export function getCustomerIds(phase, getState) {
  const customerPhase = getCustomerPhase(getState);
  return Object.entries(customerPhase)
    .map(([id, data]) => {
      data.sort((a, b) => a.time - b.time);
      return [id, data];
    })
    .filter(([id, data]) => data[data.length - 1].phase === phase)
    .sort((a, b) => {
      const aPhases = a[1];
      const bPhases = b[1];
      const aTime = aPhases[aPhases.length - 1].time;
      const bTime = bPhases[bPhases.length - 1].time;
      return aTime - bTime;
    })
    .map(([id, phase]) => id);
}

export function getOrders(getState) {
  return createSelector(game => game.orders)(getState);
}

export function getCooks(getState) {
  return createSelector(game => game.cooks)(getState);
}

/**
 * @returns {Array}
 */
export function getTakenOrderIds(getState) {
  return createSelector(game => game.takenOrderIds)(getState);
}

export function isOrderTaken(orderId, getState) {
  const takenOrderIds = getTakenOrderIds(getState);
  return takenOrderIds.some(id => id === orderId);
}

export function isOrderDone(orderId, getState) {
  const orderIdToResult = getOrderIdToResult(getState);
  return !!orderIdToResult[orderId];
}

export function getOrderIdToResult(getState) {
  return createSelector(game => game.orderIdToResult)(getState);
}

export function getActions(type, getState) {
  const allActions = createSelector(game => game.actions)(getState);
  return allActions.filter(action => action.action.type === type);
}
