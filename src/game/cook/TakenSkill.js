import { Button, Tooltip } from "antd";
import React from "react";

export function TakenSkill({ skill, ...rest }) {
  const { name, level, icon, takenDescription } = skill;

  return (
    <Tooltip title={takenDescription(level)} placement={"bottom"} mouseLeaveDelay={0}>
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
        {`${name} (${level})`}
      </Button>
    </Tooltip>
  );
}
