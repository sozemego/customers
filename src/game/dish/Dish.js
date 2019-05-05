import React from "react";
import { InfoCard } from "../../components/InfoCard";

export function Dish({ dish }) {
  const { name, avatar } = dish;

  return <InfoCard src={avatar} name={name} />;
}
