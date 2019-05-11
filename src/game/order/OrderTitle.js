import React from "react";
import PropTypes from "prop-types";
import { css } from "glamor";

const containerStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
});

const percentStyle = css({
  marginLeft: "4px"
});

export function OrderTitle(props) {
  const { orderResults } = props;
  return (
    <div className={containerStyle}>
      <div>Orders</div>
      {orderResults
        .sort((a, b) => b.percent - a.percent)
        .map(result => (
          <span
            key={result.id}
            data-testid={`result-${result.id}`}
            className={percentStyle}
          >
            {result.percent}%
          </span>
        ))}
    </div>
  );
}

OrderTitle.propTypes = {
  orderResults: PropTypes.array.isRequired
};
