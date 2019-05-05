import React, { useEffect } from "react";
import { Button } from "antd";
import { isRunning } from "./selectors";
import { cookAdded, levelsLoaded, startGame, stopGame } from './actions';
import { useDispatch } from "react-redux";
import { createCook } from "./cook/business";

export function GameStart(props) {
  const running = isRunning();
  const dispatch = useDispatch();

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
    </div>
  );
}
