import React, { useState } from "react";
import { Button, Card, Icon, Input, InputNumber } from "antd";
import { Select } from "antd";
import { redirect } from "../history";
import { css } from "glamor";
import faker from "faker";
import { createDish, DISH } from "../game/dish/business";
import { Dish } from "../game/dish/Dish";
import { validateLevel } from "./business";

const Option = Select.Option;

const buttonContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center"
});

const nameContainerStyle = css({
  margin: "4px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
});

const addCustomerButtonStyle = css({
  margin: "4px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center"
});

const customersContainerStyle = css({
  margin: "4px",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center"
});

const customerContainer = css({
  margin: "4px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
});

const customerCardTitleStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
});

const errorStyle = css({
  color: "red"
});

let id = 0;

export function LevelEditor(props) {
  const [name, setName] = useState(null);
  const [customers, setCustomers] = useState([]);

  console.log("name", name);
  console.log("customers", customers);

  function onCustomerChange(index, key, value) {
    const customer = customers[index];
    customer[key] = value;
    setCustomers([...customers]);
  }

  const errors = validateLevel({
    name,
    customers
  });

  function errorComponent(error) {
    if (!error) return null;
    return <div className={errorStyle}>{error}</div>;
  }

  return (
    <div>
      <div className={buttonContainerStyle}>
        <Button type={"danger"} onClick={() => redirect("/")}>
          Back
        </Button>
        <Button
          type={"danger"}
          onClick={() => {
            setCustomers([]);
            setName(null);
          }}
        >
          Reset level
        </Button>
      </div>
      <div className={nameContainerStyle}>
        <Input
          placeholder={"Level name"}
          value={name}
          allowClear
          addonBefore={"Level name"}
          onChange={e => {
            setName(e.target.value);
          }}
          style={{ width: "25%" }}
        />
        <div>{errorComponent(errors.name)}</div>
      </div>
      <div className={addCustomerButtonStyle}>
        <Button
          type={"danger"}
          onClick={() => {
            setCustomers([
              ...customers,
              { id: ++id, name: faker.name.firstName(), time: 0 }
            ]);
          }}
        >
          Add customer
        </Button>
      </div>
      <div className={customersContainerStyle}>
        {customers.map((customer, index) => {
          return (
            <Card
              key={customer.id}
              style={{ width: "40%" }}
              title={
                <div className={customerCardTitleStyle}>
                  <Icon type="smile" theme="outlined" />
                  <Input
                    addonBefore={"Customer name"}
                    value={customer.name}
                    allowClear
                    onChange={e => {
                      onCustomerChange(index, "name", e.target.value);
                    }}
                    style={{ width: "200" }}
                  />
                  <Icon
                    type="delete"
                    theme={"filled"}
                    onClick={() => {
                      customers.splice(index, 1);
                      setCustomers([...customers]);
                    }}
                  />
                  <div>
                    {errorComponent(errors.customers[customer.id].name)}
                  </div>
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
                      onCustomerChange(index, "dish", value);
                    }}
                    filterOption={(input, option) =>
                      option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    value={customer.dish}
                  >
                    {Object.values(DISH)
                      .map(dish => dish.name.toUpperCase())
                      .map(name => createDish(name))
                      .map(dish => (
                        <Option value={dish.name} key={dish.name}>
                          <Dish dish={dish} />
                        </Option>
                      ))}
                  </Select>
                  <div>
                    {errorComponent(errors.customers[customer.id].dish)}
                  </div>
                </div>
                <div>
                  <div>
                    Time{" "}
                    {errorComponent(
                      errorComponent(errors.customers[customer.id].time)
                    )}
                  </div>
                  <InputNumber
                    value={customer.time}
                    onChange={value => onCustomerChange(index, "time", value)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
