import React, { useEffect } from "react";
import { Button } from "antd";
import { getLevels, isRunning } from "./selectors";
import { levelsLoaded, startGame, stopGame } from "./actions";
import { useDispatch } from "react-redux";

export function GameStart(props) {
  const running = isRunning();
  const dispatch = useDispatch();
  const levels = getLevels() || {};

  const stopGameCallback = () => dispatch(stopGame());

  useEffect(() => {
    fetch(`/levels.json`)
      .then(res => res.json())
      .then(res => dispatch(levelsLoaded(res)))
      .then(() => {
        dispatch(startGame());
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
