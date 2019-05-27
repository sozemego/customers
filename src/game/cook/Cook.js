import React from "react";
import { InfoCard } from "../../components/InfoCard";
import { Progress } from "antd";
import { css } from "glamor";
import { SkillPicker } from "./SkillPicker";
import { Skill } from "./Skill";
import { TakenSkill } from "./TakenSkill";

const containerStyle = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start"
  // height: "96px"
});

const cookCardContainerStyle = css({
  width: "148px",
  display: "flex",
  alignItems: "center",
  height: "100%"
});

const cookInfoStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
});

export function Cook({ cook }) {
  const { name, avatar, nextLevel, experience, skills } = cook;

  const experienceProgress = Number(
    Number((experience / nextLevel) * 100).toFixed(0)
  );

  return (
    <div className={containerStyle}>
      <div className={cookInfoStyle}>
        <InfoCard
          src={avatar}
          name={name}
          containerClassName={cookCardContainerStyle.toString()}
        />
        <div>
          <div>
            {`Level ${cook.level}. Experience: ${cook.experience} / ${
              cook.nextLevel
            }.`}
          </div>
          <div>{`Speed modifier: ${cook.speed}`}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
					{Object.values(skills).map(skill => (
						<TakenSkill key={skill.id} skill={skill} />
					))}
				</div>
        <SkillPicker cook={cook} />
      </div>
      <Progress
        default={"default"}
        type={"line"}
        percent={experienceProgress}
        status={"active"}
      />
    </div>
  );
}
