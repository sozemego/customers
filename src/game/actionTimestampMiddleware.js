import { ACTION_REGISTERED, actionRegistered } from "./actions";

export const actionTimestampMiddleware = store => next => action => {
  const nextAction = next(action);
  if (nextAction.type !== ACTION_REGISTERED) {
    store.dispatch(actionRegistered(action, Date.now()));
  }
  return nextAction;
};
