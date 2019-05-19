import React, { useEffect } from "react";
import { Button } from "antd";
import { getLevels, isRunning } from "./selectors";
import { cookAdded, levelsLoaded, startGame, stopGame } from "./actions";
import { useDispatch } from "react-redux";
import { createCook } from "./cook/business";

export function GameStart(props) {
  const running = isRunning();
  const dispatch = useDispatch();
  const levels = getLevels() || {};

  const startGameCallback = () => dispatch(startGame(1));
  const stopGameCallback = () => dispatch(stopGame());

  useEffect(() => {
    fetch(`/levels.json`)
      .then(res => res.json())
      .then(res => dispatch(levelsLoaded(res)))
      .then(() => {
        dispatch(cookAdded(createCook()));
        dispatch(cookAdded(createCook()));
      })
      .then(() => {
        dispatch(startGame(1));
      });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ textAlign: "center" }}>Game options</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        {!running && (
          <Button onClick={startGameCallback} type={"danger"}>
            Start
          </Button>
        )}
        {running && (
          <Button onClick={stopGameCallback} type={"danger"}>
            Stop
          </Button>
        )}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div>Level select</div>
          <select onChange={e => dispatch(startGame(e.target.value))}>
            {Object.entries(levels).map(([id, level]) => (
              <option value={id} key={id}>{id}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
