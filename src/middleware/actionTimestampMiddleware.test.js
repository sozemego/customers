import { createNewStore } from "../store/store";
import { gameStarted, gameStopped, levelsLoaded, stopGame } from "../game/actions";
const { describe, it, expect } = global;

let store = null;
let dispatch = null;
let getState = null;

beforeEach(() => {
  store = createNewStore();
  dispatch = store.dispatch;
  getState = store.getState;
});

it("emitting GAME_STARTED action should store a ACTION_REGISTERED action in the store", () => {
  dispatch(gameStarted("level id"));
  const state = getState();
	expect(state.game.actions.length).toBe(1);
});

it('emitting 5 actions should store 5 ACTION_REGISTERED actions in the store', () => {
	dispatch(gameStarted("level id"));
	dispatch(gameStarted("level id"));
	dispatch(gameStarted("level id"));
	dispatch(gameStarted("level id"));
	dispatch(gameStarted("level id"));
	const state = getState();
	expect(state.game.actions.length).toBe(5);
});

it('emitting random number of actions should store the same amount of ACTION_REGISTERED actions in the store', () => {
	const number = Math.floor(Math.random() * 5000);
	for(let i = 0; i < number; i++) {
		dispatch(gameStarted("level id"));
	}
	const state = getState();
	expect(state.game.actions.length).toBe(number);
});

it('actions after GAME_STARTED should have timestamp in the form of seconds after GAME_STARTED action', () => {
	dispatch(gameStarted('level 5'));
	dispatch(levelsLoaded({}));
	const state = getState();
	const levelsLoadedAction = state.game.actions[1];
	expect(levelsLoadedAction.timestamp).toBeGreaterThanOrEqual(0);
	expect(levelsLoadedAction.timestamp).toBeLessThanOrEqual(1000);
});

it('2. actions after GAME_STARTED should have timestamp in the form of seconds after GAME_STARTED action', () => {
	dispatch(gameStarted('level 5'));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	dispatch(levelsLoaded({}));
	const state = getState();
	console.log(state.game.actions);
	const levelsLoadedAction = state.game.actions[1];
	expect(levelsLoadedAction.timestamp).toBeGreaterThanOrEqual(0);
	expect(levelsLoadedAction.timestamp).toBeLessThanOrEqual(1000);
});
