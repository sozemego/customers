import React from "react";
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

const resultsContainer = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap"
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
  let averageResult = null;
  if (orderResults.length > 0) {
    const sum = orderResults
      .map(result => result.percent)
      .reduce((prev, current) => {
        return prev + current;
      }, 0);
    averageResult = (sum / orderResults.length).toFixed(1);
  }

  return (
    <div className={containerStyle}>
      <div>Orders {averageResult ? `[Avg: ${averageResult}%]` : null}</div>
      <div className={resultsContainer}>
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
