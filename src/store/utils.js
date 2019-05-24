export function makeActionCreator(type, ...argNames) {
  return function actionCreator(...args) {
    const action = { type };
    argNames.forEach((name, index) => {
      action[name] = args[index];
    });
    return action;
  };
}

export function makePayloadActionCreator(type) {
  return function payloadActionCreator(payload) {
    return {
      type,
      payload
    };
  };
}

export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
