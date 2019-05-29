import { Tag, Tooltip } from "antd";
import React from "react";

export function TakenSkill({ skill, ...rest }) {
  const { level, icon, takenDescription } = skill;

  const color = {
    1: "lime",
    2: "green",
    3: "cyan",
    4: "blue",
    5: "purple",
    6: "magenta",
    7: "red",
    8: "volcano",
    9: "orange",
    10: "gold"
  };

  return (
    <Tooltip
      title={takenDescription(level)}
      placement={"bottom"}
      mouseLeaveDelay={0}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Tag color={color[level]} style={{marginTop: "8px"}}>{level}</Tag>
        <span role={"img"} style={{ fontSize: "2rem", marginRight: "4px" }}>
          {icon}
        </span>
      </div>
    </Tooltip>
  );
}
