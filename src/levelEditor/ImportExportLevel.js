import { Button, Input } from "antd";
import { loadLevel, saveLevelToLocalStorage } from "./business";
import { levelsLoaded } from "../game/actions";
import React, { useState } from "react";
import { useDispatch, useStore } from "react-redux";

export function ImportExportLevel(props) {
  const { id, setId, customers, levels, setCustomers } = props;
  const dispatch = useDispatch();
  const getState = useStore().getState;
  const [levelInput, setLevelInput] = useState("");

  return (
    <>
      <Input
        addonBefore={"Load level"}
        placeholder={
          "Paste exported level or pastebin link with exported level"
        }
        onChange={e => setLevelInput(e.target.value)}
      />
      <Button
        type={"danger"}
        onClick={() => {
          try {
            setId(null);
            const level = loadLevel(levelInput);
            const nextLevels = { ...levels };
            nextLevels[level.id] = level;
            dispatch(levelsLoaded(nextLevels));
            saveLevelToLocalStorage(level, getState);
            setId(level.id);
            setCustomers(level.customers);
          } catch (e) {}
        }}
      >
        Load
      </Button>
      <Button
        type={"danger"}
        onClick={() => {
          const str = JSON.stringify({ id, customers });
          const input = document.createElement("input");
          input.value = str;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }}
      >
        Export
      </Button>
    </>
  );
}
