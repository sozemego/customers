import { getLevels } from "../game/selectors";
import { decode64, encode64 } from "../utils";

export function validateLevel(level) {
  const { id, customers } = level;

  const errors = {
    customers: {},
    isValid: true
  };

  if (!id) {
    errors.id = "Level needs a name";
    errors.isValid = false;
  }

  if (customers.length === 0) {
    errors.customerAmount = "Needs at least 1 customer";
    errors.isValid = false;
  }

  customers.forEach(customer => {
    const customerError = {
      name: "",
      dish: "",
      time: ""
    };
    if (!customer.name) {
      customerError.name = "Name cannot be empty";
      errors.isValid = false;
    }
    if (!customer.dish) {
      customerError.dish = "Dish cannot be empty";
      errors.isValid = false;
    }
    if (customer.time < 0) {
      customerError.time = "Time cannot be negative";
      errors.isValid = false;
    }
    errors.customers[customer.id] = customerError;
  });

  return errors;
}

export function saveLevelToLocalStorage(level, getState) {
  if (!level.id) {
    return;
  }
  const levels = getLevels(getState);
  levels[level.id] = level;
  saveLevelsToLocalStorage(levels);
  console.log(`Saved level ${level.id} to localStorage`);
}

export function saveLevelsToLocalStorage(levels) {
  const base64 = encode64(levels);
  localStorage.setItem("levels", base64);
  console.log(`Saved ${Object.values(levels).length} levels to localStorage`);
}

export function getLevelsFromLocalStorage() {
  const base64 = localStorage.getItem("levels");
  if (!base64) {
    return {};
  }
  return decode64(base64, true);
}
