import React from "react";
import PropTypes from "prop-types";

export function OrderTitle(props) {
  const { orderResults } = props;
  return (
    <>
      <div>Orders</div>
      {orderResults.map(result => (
        <span key={result.id} data-testid={`result-${result.id}`}>
          {result.percent}
        </span>
      ))}
    </>
  );
}

OrderTitle.propTypes = {
  orderResults: PropTypes.array.isRequired
};
