import React from "react";

const defaultStyle = { textAlign: "center" };

export function H1({ children, style: propsStyle }) {
  const style = { ...defaultStyle, ...propsStyle };
  return <h1 style={style}>{children}</h1>;
}
