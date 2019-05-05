import React from "react";
import { render, act, cleanup } from "react-testing-library";
// this adds custom jest matchers from jest-dom
import "jest-dom/extend-expect";
import { Timer } from "./Timer";

afterEach(cleanup);

test("Timer should render", () => {
  const { getByTestId } = render(<Timer start={false} time={2000} />);
  expect(getByTestId("timer")).toHaveTextContent("0.0 / 2.0");
});
//
// test("Timer should advance with time passed", async () => {
//   jest.useFakeTimers();
//   const { getByTestId } = render(<Timer start={true} time={2000} />);
//
//   act(() => jest.advanceTimersByTime(2000));
//   expect(getByTestId("timer")).toHaveTextContent("2.0 / 2.0");
// });
//
// test("Timer should be resistant to time changes (increase)", async () => {
//   jest.useFakeTimers();
//   const { getByTestId, rerender } = render(<Timer start={true} time={2000} />);
//
//   act(() => jest.advanceTimersByTime(1000));
//   expect(getByTestId("timer")).toHaveTextContent("1.0 / 2.0");
//   rerender(<Timer start={true} time={3000} />);
//
//   expect(getByTestId("timer")).toHaveTextContent("1.0 / 3.0");
// });
//
// test("Timer should be resistant to time changes (decrease)", async () => {
//   jest.useFakeTimers();
//   const { getByTestId, rerender } = render(<Timer start={true} time={4000} />);
//
//   act(() => jest.advanceTimersByTime(3000));
//   expect(getByTestId("timer")).toHaveTextContent("3.0 / 4.0");
//   rerender(<Timer start={true} time={2000} />);
//   expect(getByTestId("timer")).toHaveTextContent("2.0 / 2.0");
// });
