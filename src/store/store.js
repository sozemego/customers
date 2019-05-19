import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { reducer } from "./reducer";
import { actionTimestampMiddleware } from "../middleware/actionTimestampMiddleware";
import { ACTION_REGISTERED } from "../game/actions";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const logger = store => next => action => {
  if(process.env.LOG && action.type !== ACTION_REGISTERED) {
    console.log(action);
  }
  return next(action);
};

export const store = createNewStore();

export function createNewStore() {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk, actionTimestampMiddleware, logger)));
}
