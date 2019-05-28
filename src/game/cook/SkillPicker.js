import React from "react";
import { Collapse, Icon, Tag } from "antd";
import { Skill } from "./Skill";
import { SKILL } from "./business";
import { useDispatch } from "react-redux";
import { cookLearnedSkill } from "../actions";

const Panel = Collapse.Panel;

export function SkillPicker({ cook }) {
  const { id, skillsToTake } = cook;
  const dispatch = useDispatch();

  if (!skillsToTake) {
    return null;
  }

  return (
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
        <Panel key={1} header={<span>Learn new skill <Tag color="geekblue">{skillsToTake}</Tag></span>}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            {Object.values(SKILL).map(skill => (
              <Skill
                key={skill.id}
                skill={skill}
                onClick={() => dispatch(cookLearnedSkill(id, skill.id))}
              />
            ))}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
}
