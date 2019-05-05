import React from "react";

const containerStyle = {
  maxWidth: "24px",
  maxHeight: "24px",
  borderRadius: "12px"
};

const imgStyle = {
  maxWidth: "24px",
  maxHeight: "24px"
};

export function Avatar(props) {
  const { src } = props;
  return (
    <div style={containerStyle}>
      <img style={imgStyle} src={src} alt={"avatar"} />
    </div>
  );
}
