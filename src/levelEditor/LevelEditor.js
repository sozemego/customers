import React, { useState } from "react";
import { Button, Input } from "antd";
import { redirect } from "../history";
import { css } from "glamor";
import faker from "faker";
import { DISH } from "../game/dish/business";
import {
  saveLevelsToLocalStorage,
  saveLevelToLocalStorage,
  validateLevel
} from "./business";
import { getLevels } from "../game/selectors";
import { useDispatch, useStore } from "react-redux";
import { levelsLoaded } from "../game/actions";
import { ImportExportLevel } from "./ImportExportLevel";
import { CustomerEditor } from "./CustomerEditor";

const buttonContainerStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  maxWidth: "1000px",
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

  function onCustomerChange(customer, key, value) {
    customer[key] = value;
    setCustomers([...customers]);
    setChanged(true);
  }

  const errors = validateLevel({
    id,
    customers
  });

  function removeCustomer(customer) {
    const index = customers.findIndex(c => c.id === customer.id);
    if (index > -1) {
      customers.splice(index, 1);
      setCustomers([...customers]);
    }
  }

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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ImportExportLevel
            id={id}
            setId={setId}
            levels={levels}
            customers={customers}
            setCustomers={setCustomers}
          />
        </div>
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
            <CustomerEditor
              key={customer.id}
              customer={customer}
              errors={errors}
              onCustomerChange={onCustomerChange}
              removeCustomer={removeCustomer}
            />
          );
        })}
      </div>
    </div>
  );
}
