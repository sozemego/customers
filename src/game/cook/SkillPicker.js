import React from "react";
import { Collapse, Icon } from "antd";
import { SKILL } from "./skill";
import { Skill } from "./Skill";

const Panel = Collapse.Panel;

export function SkillPicker({cook}) {
  const { skillsToTake } = cook;

  if (!skillsToTake) {
  	return null;
	}

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <Icon type="read" theme={isActive ? "filled" : "outlined"} />
          )}
        >
          <Panel key={1} header={<span>Learn new skill</span>}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {Object.values(SKILL).map(skill => (
                <Skill skill={skill} />
              ))}
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}
