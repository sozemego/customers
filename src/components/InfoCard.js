import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "antd";
import { css } from "glamor";

const containerStyle = css({
  label: "info-card-container",
  display: "flex",
  alignItems: "center"
});

const bodyStyle = css({
  display: "inline-flex",
  flexDirection: "row",
  alignItems: "center",
  overflow: "auto"
});

const nameStyle = {
  marginLeft: "4px"
};

export function InfoCard(props) {
  const { src, name, className, containerClassName } = props;

  return (
    <div className={containerClassName}>
      <div className={className}>
        <Avatar src={src} />
        <span style={nameStyle}>{name}</span>
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string
};

InfoCard.defaultProps = {
  className: bodyStyle.toString(),
  containerClassName: containerStyle.toString()
};
