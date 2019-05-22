import React from "react";
import { Button } from "antd";
import { css } from "glamor";
import { saveToLocalStorage } from "./business";
import { useDispatch } from "react-redux";
import { loadCooks } from "../actions";

const containerStyle = css({
  minHeight: "36px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

export function CooksTitle(props) {
  const dispatch = useDispatch();
  return (
    <div className={containerStyle}>
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
