import React from "react";
import fs from "fs";
import path from "path";
import util from "util";
import { render, act, cleanup, fireEvent } from "react-testing-library";
// this adds custom jest matchers from jest-dom
import "jest-dom/extend-expect";
import { Game } from "./Game";
import { Provider } from "react-redux";
import { cookAdded, levelsLoaded, startGame } from "./actions";
import { createNewStore } from "../store/store";
import { getCustomers, getOrderIdToResult, getOrders } from "./selectors";
import { createCook } from "./cook/business";
import { leaveAt } from "./business";

let store = null;
let logFile = "test.txt";

function setLog(file) {
  logFile = `./test/${file}.txt`;
}

beforeAll(() => {
  const { log: consoleLog } = console;
  console.log = (...args) => {
    log(args, "LOG");
    // consoleLog(...args);
  };
  const err = console.err;
  console.err = (...args) => {
    log(args, "ERROR");
    err(...args);
  };
  const logFiles = fs.readdirSync("./test");
  logFiles.forEach(file => {
    fs.unlinkSync(path.join("./test", file));
  });
});

beforeEach(() => {
  store = createNewStore();
});
afterEach(cleanup);

function log(object, prefix = "") {
  if (prefix) {
    fs.appendFileSync(logFile, `\n${prefix}\n`);
  }
  fs.appendFileSync(logFile, util.inspect(object, { depth: null }));
}

function startLevel(levelId) {
  const { dispatch } = store;
  dispatch(levelsLoaded(getLevels()));
  dispatch(startGame(levelId));
  advanceTimers(100);
}

function addCook() {
  const { dispatch } = store;
  dispatch(cookAdded(createCook()));
}

function renderWithProvider(children) {
  return render(<Provider store={store}>{children}</Provider>);
}

function rerenderWithProvider(rerender, children) {
  return rerender(<Provider store={store}>{children}</Provider>);
}

function testWithLog(name, callback) {
  test(name, () => {
    setLog(name);
    return callback();
  });
}

function advanceTimers(ms) {
  const increment = 250;
  for (let i = 0; i < ms; i += increment) {
    act(() => jest.advanceTimersByTime(increment));
  }
}

function getLevels() {
  const levels = {
    1: {
      customers: [
        {
          id: 1,
          time: 1000,
          dish: "SALAD"
        }
      ]
    },
    2: {
      customers: [
        {
          id: 1,
          time: 1000,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 2000,
          dish: "SALAD"
        },
        {
          id: 3,
          time: 5000,
          dish: "SALAD"
        },
        {
          id: 4,
          time: 20000,
          dish: "SALAD"
        }
      ]
    },
    3: {
      customers: [
        {
          id: 1,
          time: 1000,
          dish: "SALAD"
        }
      ]
    },
    4: {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 0,
          dish: "PIZZA"
        }
      ]
    },
    5: {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "PIZZA"
        }
      ]
    },
    6: {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        }
      ]
    },
    "customer order": {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 1000,
          dish: "SALAD"
        },
        {
          id: 3,
          time: 5000,
          dish: "SALAD"
        },
        {
          id: 4,
          time: 2500,
          dish: "SALAD"
        },
        {
          id: 5,
          time: 10000,
          dish: "SALAD"
        },
        {
          id: 6,
          time: 7500,
          dish: "SALAD"
        }
      ]
    },
    "customer order 2": {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 1000,
          dish: "SALAD"
        },
        {
          id: 3,
          time: 5000,
          dish: "SALAD"
        },
        {
          id: 4,
          time: 2500,
          dish: "SALAD"
        },
        {
          id: 5,
          time: 10000,
          dish: "SALAD"
        },
        {
          id: 6,
          time: 7500,
          dish: "SALAD"
        },
        {
          id: 7,
          time: 0,
          dish: "PIZZA"
        },
        {
          id: 8,
          time: 10000,
          dish: "PIZZA"
        }
      ]
    },
    "customer order 3": {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 3,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 4,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 5,
          time: 0,
          dish: "SALAD"
        }
      ]
    },
    "customer order 4": {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 0,
          dish: "PIZZA"
        },
        {
          id: 3,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 4,
          time: 0,
          dish: "PIZZA"
        },
        {
          id: 5,
          time: 0,
          dish: "SALAD"
        }
      ]
    },
    "order result 1": {
      customers: [
        {
          id: 1,
          time: 0,
          dish: "SALAD"
        },
        {
          id: 2,
          time: 0,
          dish: "PIZZA"
        },
        {
          id: 3,
          time: 0,
          dish: "SALAD"
        }
      ]
    }
  };
  return levels;
}

testWithLog("1 game should render one customer", () => {
  jest.useFakeTimers();
  const { getByTestId } = renderWithProvider(<Game />);

  startLevel(1);

  act(() => jest.advanceTimersByTime(1000));
  const element = getByTestId("customer-id-1");
  expect(element).not.toBeNull();
  expect(getByTestId("arriving-customers").textContent).toBe("🤔 1");
  expect(getByTestId("done-customers").textContent).toBe("😀 0");
  expect(getByTestId("angry-customers").textContent).toBe("🤬 0");
  expect(getByTestId("total-customers").textContent).toBe("1");
});

testWithLog("2 game should not render a customer", () => {
  jest.useFakeTimers();
  const { queryAllByTestId, getByTestId } = renderWithProvider(<Game />);

  startLevel(1);

  act(() => jest.advanceTimersByTime(500));
  const element = queryAllByTestId("customer-id-1");
  expect(element).toEqual([]);
  expect(getByTestId("arriving-customers").textContent).toBe("🤔 1");
  expect(getByTestId("done-customers").textContent).toBe("😀 0");
  expect(getByTestId("angry-customers").textContent).toBe("🤬 0");
  expect(getByTestId("total-customers").textContent).toBe("1");
});

testWithLog("3 game should render 3 out of 4 customers", () => {
  jest.useFakeTimers();
  const { queryAllByTestId, container, getByTestId } = renderWithProvider(
    <Game />
  );
  startLevel(2);
  advanceTimers(6000);
  const customers = queryAllByTestId(/customer-id/i, { container });
  expect(customers.length).toEqual(3);
  expect(getByTestId("arriving-customers").textContent).toBe("🤔 4");
  expect(getByTestId("done-customers").textContent).toBe("😀 0");
  expect(getByTestId("angry-customers").textContent).toBe("🤬 0");
  expect(getByTestId("total-customers").textContent).toBe("4");
});

testWithLog("4 customer should leave after not being taken care of", () => {
  jest.useFakeTimers();
  const { queryAllByTestId, getByTestId } = renderWithProvider(<Game />);
  startLevel(3);

  const orders = getOrders(store.getState);
  const customers = Object.values(getCustomers(store.getState));
  console.log(customers);
  const customer = customers[0];
  const order = orders[customer.orderId];
  const leaveAtTime = leaveAt(order);
  for (let i = 0; i < leaveAtTime; i++) {
    act(() => jest.advanceTimersByTime(i * 1000));
  }
  const customerElements = queryAllByTestId(/customer-id/i);
  expect(customerElements.length).toBe(0);
  expect(getByTestId("arriving-customers").textContent).toBe("🤔 0");
  expect(getByTestId("done-customers").textContent).toBe("😀 0");
  expect(getByTestId("angry-customers").textContent).toBe("🤬 1");
  expect(getByTestId("total-customers").textContent).toBe("1");
});

testWithLog("5 taking order should render the order in order list", () => {
  jest.useFakeTimers();
  const { queryByTestId } = renderWithProvider(<Game />);
  startLevel(4);
  act(() => jest.advanceTimersByTime(1000));
  const customer = Object.values(getCustomers(store.getState))[0];
  const takeOrderButton = queryByTestId(`take-order-${customer.id}`);
  fireEvent.click(takeOrderButton);
  const orderElement = queryByTestId(`order-id-${customer.orderId}`);
  expect(orderElement).not.toBeNull();
});

testWithLog("6 taking 2 orders should render the orders in order list", () => {
  jest.useFakeTimers();
  const { queryByTestId } = renderWithProvider(<Game />);
  startLevel(4);
  act(() => jest.advanceTimersByTime(1000));
  const customer1 = Object.values(getCustomers(store.getState))[0];
  const customer2 = Object.values(getCustomers(store.getState))[1];
  fireEvent.click(queryByTestId(`take-order-${customer1.id}`));
  fireEvent.click(queryByTestId(`take-order-${customer2.id}`));
  const order1 = Object.values(getOrders(store.getState))[0];
  const order2 = Object.values(getOrders(store.getState))[0];
  const orderElement1 = queryByTestId(`order-id-${order1.id}`);
  const orderElement2 = queryByTestId(`order-id-${order2.id}`);
  expect(orderElement1).not.toBeNull();
  expect(orderElement2).not.toBeNull();
});

testWithLog(
  "7 taking order and then waiting till customer gets angry should remove the customer",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId, getByTestId } = renderWithProvider(
      <Game />
    );
    startLevel(5);
    act(() => jest.advanceTimersByTime(1000));
    const customer1 = Object.values(getCustomers(store.getState))[0];
    fireEvent.click(queryByTestId(`take-order-${customer1.id}`));

    const orders = getOrders(store.getState);
    const customers = Object.values(getCustomers(store.getState));
    const customer = customers[0];
    const order = orders[customer.orderId];
    const leaveAtTime = leaveAt(order);
    for (let i = 0; i < leaveAtTime; i++) {
      act(() => jest.advanceTimersByTime(i * 1000));
    }
    const customerElements = queryAllByTestId(/customer-id/i);
    expect(customerElements.length).toBe(0);
    expect(getByTestId("arriving-customers").textContent).toBe("🤔 0");
    expect(getByTestId("done-customers").textContent).toBe("😀 0");
    expect(getByTestId("angry-customers").textContent).toBe("🤬 1");
    expect(getByTestId("total-customers").textContent).toBe("1");
  }
);

testWithLog("8 completing the order should remove order", () => {
  jest.useFakeTimers();
  const { queryByTestId, getByTestId } = renderWithProvider(<Game />);
  startLevel(6);
  addCook();
  act(() => jest.advanceTimersByTime(1000));
  fireEvent.click(queryByTestId(`take-order-1`));
  expect(queryByTestId(/order-id/g)).not.toBeNull();

  fireEvent.click(queryByTestId(/next-phase/g));
  advanceTimers(10000);
  fireEvent.click(queryByTestId(/next-phase/g));
  act(() => jest.advanceTimersByTime(12000));
  fireEvent.click(queryByTestId(/next-phase/g));
  act(() => jest.advanceTimersByTime(10000));
  expect(queryByTestId(/order-id/g)).toBeNull();
  expect(getByTestId("arriving-customers").textContent).toBe("🤔 0");
  expect(getByTestId("done-customers").textContent).toBe("😀 1");
  expect(getByTestId("angry-customers").textContent).toBe("🤬 0");
  expect(getByTestId("total-customers").textContent).toBe("1");
});

testWithLog("9 completing phases should add experience to the cook", () => {
  jest.useFakeTimers();
  const { queryByTestId, queryByText } = renderWithProvider(<Game />);
  startLevel(6);
  addCook();
  act(() => jest.advanceTimersByTime(1000));
  fireEvent.click(queryByTestId(`take-order-1`));
  expect(queryByTestId(/order-id/g)).not.toBeNull();

  fireEvent.click(queryByTestId(/next-phase/g));
  act(() => jest.advanceTimersByTime(10000));
  expect(
    queryByText("Level 1. Experience: 1 / ", { exact: false })
  ).not.toBeNull();
  fireEvent.click(queryByTestId(/next-phase/g));
  act(() => jest.advanceTimersByTime(12000));
  expect(
    queryByText("Level 1. Experience: 2 / ", { exact: false })
  ).not.toBeNull();
  fireEvent.click(queryByTestId(/next-phase/g));
  act(() => jest.advanceTimersByTime(10000));
  expect(
    queryByText("Level 1. Experience: 3 / ", { exact: false })
  ).not.toBeNull();
  expect(queryByTestId(/order-id/g)).toBeNull();
});

testWithLog(
  "10 Customers should be displayed in the order they arrived in",
  () => {
    jest.useFakeTimers();
    const { queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("customer order");
    addCook();
    advanceTimers(15000);
    expect(Object.values(getCustomers(store.getState)).length).toBe(6);

    const customerIds = [1, 2, 4, 3, 6, 5];

    const elements = queryAllByTestId(/customer-id-/g);
    customerIds.forEach((customerId, index) => {
      const expectedId = `customer-id-${customerId}`;
      const currentId = elements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });
  }
);

testWithLog(
  "11 Customers should be displayed in the order they arrived in after they leave from anger",
  () => {
    jest.useFakeTimers();
    const { queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("customer order 2");
    addCook();
    advanceTimers(15000);
    expect(Object.values(getCustomers(store.getState)).length).toBe(8);

    const customers = [1, 7, 2, 4, 3, 6, 5, 8];

    const elements = queryAllByTestId(/customer-id-/g);
    customers.forEach((element, index) => {
      const expectedId = `customer-id-${element}`;
      const currentId = elements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });

    advanceTimers(35000);
    expect(Object.values(getCustomers(store.getState)).length).toBe(8);

    const leftCustomers = [7, 3, 6, 5, 8];

    const leftElements = queryAllByTestId(/customer-id-/g);
    leftCustomers.forEach((element, index) => {
      const expectedId = `customer-id-${element}`;
      const currentId = leftElements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });
  }
);

testWithLog(
  "12 Orders should be displayed in the order they were taken",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("customer order 3");
    addCook();
    advanceTimers(1000);

    let orders = Object.values(getOrders(store.getState));
    const orderIndicesToTake = [3, 4, 0, 2, 1];
    orderIndicesToTake.forEach(orderIndex => {
      const order = orders[orderIndex];
      fireEvent.click(queryByTestId(`take-order-${order.customerId}`));
    });

    orders = Object.values(getOrders(store.getState));
    const elements = queryAllByTestId(/order-id-/g);
    elements.forEach((element, index) => {
      const order = orders[orderIndicesToTake[index]];
      const expectedId = `order-id-${order.id}`;
      const currentId = element.getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });
  }
);

testWithLog(
  "13 Orders should be displayed in the order they were taken after one is finished",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("customer order 3");
    addCook();
    advanceTimers(1000);

    let orders = Object.values(getOrders(store.getState));
    const orderIndicesToTake = [3, 4, 0, 2, 1];
    orderIndicesToTake.forEach(orderIndex => {
      const order = orders[orderIndex];
      fireEvent.click(queryByTestId(`take-order-${order.customerId}`));
    });

    orders = Object.values(getOrders(store.getState));
    const elements = queryAllByTestId(/order-id-/g);
    elements.forEach((element, index) => {
      const order = orders[orderIndicesToTake[index]];
      const expectedId = `order-id-${order.id}`;
      const currentId = elements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });

    const orderToComplete = orders[orderIndicesToTake[0]];
    fireEvent.click(queryByTestId(`next-phase-${orderToComplete.id}`));
    advanceTimers(10000);
    fireEvent.click(queryByTestId(`next-phase-${orderToComplete.id}`));
    advanceTimers(12000);
    fireEvent.click(queryByTestId(`next-phase-${orderToComplete.id}`));

    const leftOrders = Object.values(getOrders(store.getState));
    const leftOrderElements = queryAllByTestId(/order-id-/g);
    const leftOrderIndicesToTake = [3, 0, 2, 1];
    leftOrderElements.forEach((element, index) => {
      const order = leftOrders[leftOrderIndicesToTake[index]];
      const expectedId = `order-id-${order.id}`;
      const currentId = leftOrderElements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });
  }
);

testWithLog(
  "14 Orders should be displayed in the order they were taken after customer leaves from anger",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("customer order 4");
    addCook();
    advanceTimers(1000);

    let orders = Object.values(getOrders(store.getState));
    const orderIndicesToTake = [3, 4, 0, 2, 1];
    orderIndicesToTake.forEach(orderIndex => {
      const order = orders[orderIndex];
      fireEvent.click(queryByTestId(`take-order-${order.customerId}`));
    });

    advanceTimers(46000);

    orders = Object.values(getOrders(store.getState));
    const leftOrderIndices = [3, 1];
    const elements = queryAllByTestId(/order-id-/g);
    elements.forEach((element, index) => {
      const order = orders[leftOrderIndices[index]];
      const expectedId = `order-id-${order.id}`;
      const currentId = elements[index].getAttribute("data-testid");
      expect(expectedId).toBe(currentId);
    });
  }
);

testWithLog(
  "15 Customer leaving from anger should also make the order from that customer disappear",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel(4);
    addCook();
    advanceTimers(1000);

    const customer1 = Object.values(getCustomers(store.getState))[0];
    const customer2 = Object.values(getCustomers(store.getState))[1];
    fireEvent.click(queryByTestId(`take-order-${customer1.id}`));
    fireEvent.click(queryByTestId(`take-order-${customer2.id}`));
    expect(queryAllByTestId(/order-id-/g).length).toBe(2);
    expect(queryAllByTestId(/take-order-/).length).toBe(2);

    advanceTimers(46000);
    expect(queryAllByTestId(/order-id-/g).length).toBe(1);
    expect(queryAllByTestId(/take-order-/).length).toBe(1);
  }
);

testWithLog(
  "16 Starting the game again should not render the previous orders_customers",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel(4);
    addCook();
    advanceTimers(1000);
    const customer1 = Object.values(getCustomers(store.getState))[0];
    fireEvent.click(queryByTestId(`take-order-${customer1.id}`));
    expect(queryAllByTestId(/order-id-/g).length).toBe(1);
    expect(queryAllByTestId(/take-order-/).length).toBe(2);

    startLevel(4);
    advanceTimers(1000);
    expect(queryAllByTestId(/order-id-/g).length).toBe(0);
    expect(queryAllByTestId(/take-order-/).length).toBe(2);
  }
);

testWithLog(
  "17 There should be no finished order results if no orders are finished",
  () => {
    jest.useFakeTimers();
    const { queryAllByTestId } = renderWithProvider(<Game />);
    startLevel("order result 1");
    addCook();
    advanceTimers(1000);
    expect(Object.values(getOrderIdToResult(store.getState)).length).toBe(0);
    expect(queryAllByTestId(/result-/g).length).toBe(0);
  }
);

testWithLog(
  "18 There is one order result after order is finished successfully",
  () => {
    jest.useFakeTimers();
    const { queryByTestId, queryAllByTestId } = renderWithProvider(<Game />);
    startLevel(1);
    addCook();
    advanceTimers(1000);

    fireEvent.click(queryByTestId(`take-order-1`));
    expect(queryByTestId(/order-id/g)).not.toBeNull();
    expect(queryAllByTestId(/order-id-/g).length).toBe(1);
    fireEvent.click(queryByTestId(/next-phase/g));
    advanceTimers(10000);
    fireEvent.click(queryByTestId(/next-phase/g));
    advanceTimers(12000);
    fireEvent.click(queryByTestId(/next-phase/g));
    advanceTimers(6000);
    expect(queryAllByTestId(/order-id-/g).length).toBe(0);
    expect(Object.values(getOrderIdToResult(store.getState)).length).toBe(1);
    expect(queryAllByTestId(/result-/g).length).toBe(1);
  }
);

testWithLog(
  "19 There should be one order result after customer leaves without order taken",
  () => {
    jest.useFakeTimers();
    const { queryAllByTestId, getByTestId } = renderWithProvider(<Game />);
    startLevel(1);
    addCook();
    advanceTimers(460000);
    expect(queryAllByTestId(/order-id-/g).length).toBe(0);
    expect(getByTestId("arriving-customers").textContent).toBe("🤔 0");
    expect(getByTestId("done-customers").textContent).toBe("😀 0");
    expect(getByTestId("angry-customers").textContent).toBe("🤬 1");
    expect(getByTestId("total-customers").textContent).toBe("1");
    console.log(getOrderIdToResult(store.getState));
    expect(Object.values(getOrderIdToResult(store.getState)).length).toBe(1);
    expect(queryAllByTestId(/result-/g).length).toBe(1);
  }
);

testWithLog(
  "20 There should be one order result after customer leaves after taking order and not finishing it",
  () => {
    jest.useFakeTimers();
    const { queryAllByTestId, getByTestId, queryByTestId } = renderWithProvider(
      <Game />
    );
    startLevel(1);
    addCook();
    advanceTimers(1000);
    fireEvent.click(queryByTestId(`take-order-1`));
    advanceTimers(460000);
    expect(queryAllByTestId(/order-id-/g).length).toBe(0);
    expect(getByTestId("arriving-customers").textContent).toBe("🤔 0");
    expect(getByTestId("done-customers").textContent).toBe("😀 0");
    expect(getByTestId("angry-customers").textContent).toBe("🤬 1");
    expect(getByTestId("total-customers").textContent).toBe("1");
    expect(Object.values(getOrderIdToResult(store.getState)).length).toBe(1);
    expect(queryAllByTestId(/result-/g).length).toBe(1);
  }
);
