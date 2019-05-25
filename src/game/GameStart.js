import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { getLevels, isPaused, isRunning } from "./selectors";
import { gamePaused, levelsLoaded, startGame, stopGame } from "./actions";
import { useDispatch } from "react-redux";
import { redirect } from "../history";

export function GameStart(props) {
  const running = isRunning();
  const paused = isPaused();
  const dispatch = useDispatch();
  const levels = getLevels() || {};

  const [level, setLevel] = useState(0);

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
          <Button
            onClick={() => {
              dispatch(startGame(level));
            }}
          >
            Start level
          </Button>
          <select
            onChange={e =>
              setLevel(Object.keys(levels)[e.target.selectedIndex])
            }
          >
            {Object.entries(levels).map(([id, level]) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>
          <Button
            type={"danger"}
            data-testid={"level-editor"}
            onClick={() => {
              redirect("/leveleditor");
            }}
          >
            Level editor
          </Button>
        </div>
      </div>
    </div>
  );
}
