import React, { useState } from "react";
import { Button, Input } from "antd";
import { Select } from "antd";
import { redirect } from "../history";
import { css } from "glamor";
import faker from "faker";

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
  justifyContent: "center"
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
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
});

const customerContainer = css({
  margin: "4px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: "1px dotted gray"
});

let id = 0;

export function LevelEditor(props) {
  const [name, setName] = useState(null);
  const [customers, setCustomers] = useState([]);

  console.log("name", name);
  console.log("customers", customers);

  return (
    <div>
      <div className={buttonContainerStyle}>
        <Button type={"danger"} onClick={() => redirect("/")}>
          Back
        </Button>
        <Button type={"danger"}>Reset level</Button>
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
      </div>
      <div className={addCustomerButtonStyle}>
        <Button
          type={"danger"}
          onClick={() => {
            setCustomers([
              ...customers,
              { id: ++id, name: faker.name.firstName() }
            ]);
          }}
        >
          Add customer
        </Button>
      </div>
      <div className={customersContainerStyle}>
        {customers.map(customer => {
          return (
            <div key={customer.id} className={customerContainer}>
              <div>
                <Input
                  value={customer.name}
                  allowClear
                  onChange={e => {
                    const index = customers.findIndex(
                      c => c.id === customer.id
                    );
                    customers[index].name = e.target.value;
                    setCustomers([...customers]);
                  }}
                />
              </div>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a dish"
                optionFilterProp="children"
                // onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                filterOption={
                  (input, option) => true
                  // option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
              <div>
                <Button
                  type={"danger"}
                  onClick={() => {
                    const index = customers.findIndex(
                      c => c.id === customer.id
                    );
                    customers.splice(index, 1);
                    setCustomers([...customers]);
                  }}
                >
                  Remove customer
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
