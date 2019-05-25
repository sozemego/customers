import React, { useState } from "react";
import { Button, Card, Icon, Input, InputNumber } from "antd";
import { Select } from "antd";
import { redirect } from "../history";
import { css } from "glamor";
import faker from "faker";
import { createDish, DISH } from "../game/dish/business";
import { Dish } from "../game/dish/Dish";
import {
  saveLevelsToLocalStorage,
  saveLevelToLocalStorage,
  validateLevel
} from "./business";
import { getLevels } from "../game/selectors";
import { useDispatch, useStore } from "react-redux";
import { levelsLoaded } from "../game/actions";

const Option = Select.Option;

const buttonContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "500px",
  flexWrap: "wrap",
  alignSelf: "center"
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

let nextCustomerId = 0;

export function LevelEditor(props) {
  const getState = useStore().getState;
  const dispatch = useDispatch();
  const levels = getLevels() || {};
  const [id, setId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [changed, setChanged] = useState(false);

  function onCustomerChange(index, key, value) {
    const customer = customers[index];
    customer[key] = value;
    setCustomers([...customers]);
    setChanged(true);
  }

  const errors = validateLevel({
    id,
    customers
  });

  function errorComponent(error) {
    if (!error) return null;
    return <div className={errorStyle}>{error}</div>;
  }

  const defaultDish = Object.values(DISH)[0].name.toUpperCase();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div className={buttonContainerStyle}>
        <Button type={"danger"} onClick={() => redirect("/")}>
          Back
        </Button>
        <Button
          type={"danger"}
          onClick={() => {
            setCustomers([]);
            setId("");
          }}
        >
          Reset level
        </Button>
        <Button
          type={"danger"}
          onClick={() => {
            customers.sort((a, b) => a.time - b.time);
            setCustomers([...customers]);
          }}
        >
          Sort customers by time
        </Button>
        <select
          onChange={e => {
            const nextLevelId = Object.keys(levels)[e.target.selectedIndex - 1];
            const nextLevel = levels[nextLevelId];
            const nextCustomers = nextLevel.customers.map(customer => {
              const name = customer.name || faker.name.firstName();
              return {
                ...customer,
                name
              };
            });
            setCustomers(nextCustomers);
            setId(nextLevelId);
            setChanged(true);
          }}
          value={id}
        >
          <option value={""}>-</option>
          {Object.entries(levels).map(([id, level]) => (
            <option value={id} key={id}>
              {id}
            </option>
          ))}
        </select>
        <Button
          type={"danger"}
          onClick={() => {
            const errors = validateLevel({ id, customers });
            if (!errors.isValid) {
              console.log("Level invalid, cannot save", errors);
              return;
            }
            saveLevelToLocalStorage(
              {
                id,
                customers
              },
              getState
            );
            setChanged(false);
            const nextLevels = { ...levels };
            nextLevels[id] = { id, customers };
            dispatch(levelsLoaded(nextLevels));
          }}
        >
          Save {changed ? `*` : null}
        </Button>
        <Button
          type={"danger"}
          onClick={() => {
            const nextLevels = { ...levels };
            delete nextLevels[id];
            saveLevelsToLocalStorage(nextLevels);
            dispatch(levelsLoaded(nextLevels));
          }}
        >
          Delete level
        </Button>
      </div>
      <div className={nameContainerStyle}>
        <Input
          placeholder={"Level name"}
          value={id}
          allowClear
          addonBefore={"Level name"}
          onChange={e => {
            setId(e.target.value);
          }}
          style={{ width: "25%" }}
        />
        <div>{errorComponent(errors.id)}</div>
      </div>
      <div className={addCustomerButtonStyle}>
        <Button
          type={"danger"}
          onClick={() => {
            setCustomers([
              ...customers,
              {
                id: ++nextCustomerId,
                name: faker.name.firstName(),
                time: 0,
                dish: defaultDish
              }
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
              style={{ width: "30%" }}
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
                  <div>
                    {errorComponent(errors.customers[customer.id].dish)}
                  </div>
                </div>
                <div>
                  <div>
                    Time {errorComponent(errors.customers[customer.id].time)}
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
