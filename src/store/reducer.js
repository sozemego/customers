import { combineReducers } from "redux";
import { reducer as game } from "../game/reducer";

export const reducer = combineReducers({
  game
});
