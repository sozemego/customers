import React from "react";
import { Button, Tooltip } from "antd";

export function Skill({ skill, ...rest }) {
  const { name, icon, description } = skill;

  return (
    <Tooltip title={description} placement={"bottom"} mouseLeaveDelay={0}>
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "4px",
          height: "auto"
        }}
        {...rest}
      >
        <span role={"img"} style={{ fontSize: "2rem", marginRight: "4px" }}>
          {icon}
        </span>
        {name}
      </Button>
    </Tooltip>
  );
}
