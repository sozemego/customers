import React, { useEffect } from "react";
import { Button } from "antd";
import { getLevels, isPaused, isRunning } from "./selectors";
import { gamePaused, levelsLoaded, startGame, stopGame } from "./actions";
import { useDispatch } from "react-redux";

export function GameStart(props) {
  const running = isRunning();
  const paused = isPaused();
  const dispatch = useDispatch();
  const levels = getLevels() || {};

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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {running && (
          <div>
            <Button onClick={() => dispatch(stopGame())} type={"danger"}>
              Stop
            </Button>
            <Button
              onClick={() => dispatch(gamePaused(!paused))}
              type={"danger"}
              data-testid={"pause-game"}
            >
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div>Level select</div>
          <select onChange={e => dispatch(startGame(e.target.value))}>
            {Object.entries(levels).map(([id, level]) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
