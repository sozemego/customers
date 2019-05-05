import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { reducer } from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const logger = store => next => action => {
  // console.log(action);
  return next(action);
};

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

export function createNewStore() {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk, logger)));
}
