import React from "react";
import { Card, Icon, Input, InputNumber, Select } from "antd";
import { createDish, DISH } from "../game/dish/business";
import { Dish } from "../game/dish/Dish";
import { css } from "glamor";

const Option = Select.Option;

const customerCardTitleStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
});

const errorStyle = css({
  color: "red"
});

const customerContainer = css({
  margin: "4px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
});

export function CustomerEditor(props) {
  const { customer, onCustomerChange, errors, removeCustomer } = props;

  function errorComponent(error) {
    if (!error) return null;
    return <div className={errorStyle}>{error}</div>;
  }

  return (
    <Card
      key={customer.id}
      style={{ width: "30%" }}
      title={
        <div className={customerCardTitleStyle}>
          <Icon type="smile" theme="outlined" />
          <Input
            addonBefore={"Customer name"}
            value={customer.name}
            allowClear
            onChange={e => {
              onCustomerChange(customer, "name", e.target.value);
            }}
            style={{ width: "200" }}
          />
          <Icon
            type="delete"
            theme={"filled"}
            onClick={() => {
              removeCustomer(customer);
            }}
          />
          <div>{errorComponent(errors.customers[customer.id].name)}</div>
        </div>
      }
    >
      <div className={customerContainer}>
        <div>
          <div>Dish</div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a dish"
            optionFilterProp="children"
            onChange={value => {
              onCustomerChange(customer, "dish", value);
            }}
            filterOption={(input, option) =>
              option.key.toUpperCase().indexOf(input.toUpperCase()) >= 0
            }
            value={customer.dish.toUpperCase()}
          >
            {Object.values(DISH)
              .map(dish => dish.name.toUpperCase())
              .map(name => createDish(name))
              .map(dish => (
                <Option value={dish.name.toUpperCase()} key={dish.name}>
                  <Dish dish={dish} />
                </Option>
              ))}
          </Select>
          <div>{errorComponent(errors.customers[customer.id].dish)}</div>
        </div>
        <div>
          <div>Time {errorComponent(errors.customers[customer.id].time)}</div>
          <InputNumber
            value={customer.time}
            onChange={value => onCustomerChange(customer, "time", value)}
          />
        </div>
      </div>
    </Card>
  );
}
