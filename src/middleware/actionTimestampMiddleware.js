import {
  ACTION_REGISTERED,
  actionRegistered,
  GAME_STARTED
} from "../game/actions";

export const actionTimestampMiddleware = store => next => action => {
  const nextAction = next(action);
  if (nextAction.type !== ACTION_REGISTERED) {
    let timestamp = Date.now();
    if (nextAction.type !== GAME_STARTED) {
      const gameStartedTime = store
        .getState()
        .game.actions.filter(({ action }) => action.type === GAME_STARTED)[0]
        .timestamp;
      timestamp = Date.now() - gameStartedTime;
    }
    store.dispatch(actionRegistered(action, timestamp));
  }
  return nextAction;
};
