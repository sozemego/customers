export function validateLevel(level) {
  const { id, customers } = level;

  const errors = {
    customers: {}
  };

  if (!id) {
    errors.id = "Level needs a name";
  }

  customers.forEach(customer => {
    const customerError = {
      name: "",
      dish: "",
      time: ""
    };
    if (!customer.name) {
      customerError.name = "Name cannot be empty";
    }
    if (!customer.dish) {
      customerError.dish = "Dish cannot be empty";
    }
    if (customer.time < 0) {
      customerError.time = "Time cannot be negative";
    }
    errors.customers[customer.id] = customerError;
  });

  return errors;
}
