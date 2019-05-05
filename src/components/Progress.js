import React from "react";
import PropTypes from "prop-types";
import { Progress as VendorProgress } from "antd";
import { useTimer } from "../hooks/timer";

export function Progress(props) {
  const { delay, time, start, onFinish, ...rest } = props;
  const { time: timePassed } = useTimer(delay, time, start, onFinish);
  const percentTimePassed = timePassed / time;
  const percent = Number(Number(percentTimePassed * 100).toFixed(0));

  return (
    <VendorProgress
      percent={percent}
      size="small"
      default={"default"}
      {...rest}
    />
  );
}

Progress.propTypes = {
  delay: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  start: PropTypes.bool.isRequired,
  onFinish: PropTypes.func,
  type: PropTypes.oneOf(["line", "circle"]),
  showInfo: PropTypes.bool,
  width: PropTypes.number
};

Progress.defaultProps = {
  onFinish: () => {},
  type: "line",
  showInfo: true,
  width: 100
};
