import {
  ACTION_REGISTERED,
  actionRegistered,
  GAME_STARTED
} from "../game/actions";

/**
 * The purpose of this middleware is to store all actions as they happen
 * and add a timestamp to them.
 * GAME_STARTED action gets a Date.now() value as timestamp.
 * Other actions have timestamp values relative to GAME_STARTED,
 * in milliseconds since GAME_STARTED happened.
 */
export const actionTimestampMiddleware = store => next => action => {
  const nextAction = next(action);
  if (nextAction.type !== ACTION_REGISTERED) {
    let timestamp = Date.now();
    if (nextAction.type !== GAME_STARTED) {
      const state = store.getState();
      const actions = state.game.actions;
      const gameStartedActions = actions.filter(
        ({ action }) => action.type === GAME_STARTED
      );
      if (gameStartedActions.length > 0) {
        timestamp = Date.now() - gameStartedActions[0].timestamp;
      }
    }
    store.dispatch(actionRegistered(action, timestamp));
  }
  return nextAction;
};
