import React from "react";
import PropTypes from "prop-types";
import { useTimer } from "../hooks/timer";

export function Timer(props) {
  const { delay, time, start, onFinish } = props;

  const { time: timePassed } = useTimer(delay, delay, time, start, onFinish);

  function toSeconds(ms) {
    return Number(ms / 1000).toFixed(1);
  }

  return (
    <div data-testid={"timer"}>
      {toSeconds(timePassed >= time ? time : timePassed)} / {toSeconds(time)}{" "}
    </div>
  );
}

Timer.propTypes = {
  time: PropTypes.number.isRequired,
  delay: PropTypes.number,
  start: PropTypes.bool,
  onFinish: PropTypes.func
};

Timer.defaultProps = {
  start: false,
  delay: 100,
  onFinish: () => {}
};
