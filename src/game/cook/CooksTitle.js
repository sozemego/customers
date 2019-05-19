import React from "react";
import { Button } from "antd";
import { saveToLocalStorage } from "./business";
import { useDispatch } from "react-redux";
import { loadCooks } from "../actions";

export function CooksTitle(props) {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        minHeight: "36px",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <div>Cooks</div>
      <Button
        onClick={() => {
          saveToLocalStorage({});
          dispatch(loadCooks());
        }}
      >
        Reset
      </Button>
    </div>
  );
}
