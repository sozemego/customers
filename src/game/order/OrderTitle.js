import React from "react";
import PropTypes from "prop-types";
import { css } from "glamor";
import { getOrderIdToResult, getOrders } from "../selectors";
import { InfoCard } from "../../components/InfoCard";

const containerStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: "36px"
});

const percentStyle = css({
  marginLeft: "4px",
  display: "inline-flex",
  flexDirection: "row",
  alignItems: "center"
});

export function OrderTitle(props) {
  const orderResults = Object.values(getOrderIdToResult());
  const orders = getOrders();
  return (
    <div className={containerStyle}>
      <div>Orders</div>
      <div>
        {orderResults
          .sort((a, b) => b.percent - a.percent)
          .map(result => (
            <span
              key={result.id}
              data-testid={`result-${result.id}`}
              className={percentStyle}
            >
            <InfoCard
              src={orders[result.orderId].dish.avatar}
              name={`${result.percent}%`}
            />
          </span>
          ))}
      </div>
    </div>
  );
}

OrderTitle.propTypes = {};
