import { useTimer } from "../hooks/timer";
import PropTypes from "prop-types";

/**
 * A component that returns null, but gives us ability to do
 * conditional hooks.
 */
export function EmptyTimer(props) {
  const { delay, time, start, onFinish } = props;

  useTimer(delay, 100, time, start, onFinish, "empty timer");

  return null;
}

EmptyTimer.propTypes = {
  time: PropTypes.number.isRequired,
  delay: PropTypes.number,
  start: PropTypes.bool,
  onFinish: PropTypes.func
};

EmptyTimer.defaultProps = {
  start: false,
  delay: 100,
  onFinish: () => {}
};
