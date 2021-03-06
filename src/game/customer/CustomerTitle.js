import React from "react";
import { css } from "glamor";
import PropTypes from "prop-types";

const containerStyle = css({
  display: "flex",
  justifyContent: "space-between",
  minHeight: "36px",
  alignItems: "center"
});

const sectionStyle = css({
  margin: "4px"
});

const arrivingCustomersStyle = css({});

const doneCustomersStyle = css({
  color: "green"
});

const angryCustomersStyle = css({
  color: "red"
});

export function CustomerTitle(props) {
  const {
    arrivingCustomers,
    doneCustomers,
    angryCustomers,
    totalCustomers
  } = props;

  return (
    <div className={containerStyle}>
      <div>
        <span className={sectionStyle}>Customers</span>
        <span
          className={`${sectionStyle} ${arrivingCustomersStyle}`}
          data-testid={"arriving-customers"}
        >
          <span role={"img"} aria-label={"not done customers"}>
            🤔 {arrivingCustomers}
          </span>
        </span>
        /
        <span
          className={`${sectionStyle} ${doneCustomersStyle}`}
          data-testid={"done-customers"}
        >
          <span role={"img"} aria-label={"done customers"}>
            😀 {doneCustomers}
          </span>
        </span>
        /
        <span
          className={`${sectionStyle} ${angryCustomersStyle}`}
          data-testid={"angry-customers"}
        >
          <span role={"img"} aria-label={"angry customers"}>
            🤬 {angryCustomers}
          </span>
        </span>
      </div>
      <span data-testid={"total-customers"}>{totalCustomers}</span>
    </div>
  );
}

CustomerTitle.propTypes = {
  arrivingCustomers: PropTypes.number.isRequired,
  doneCustomers: PropTypes.number.isRequired,
  angryCustomers: PropTypes.number.isRequired,
  totalCustomers: PropTypes.number.isRequired
};
