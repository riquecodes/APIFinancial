function requiredFields(data) {
  const required = ["name", "age", "cpf", "income", "location"];
  const missing = required.filter((field) => !data.hasOwnProperty(field));

  if (missing.length === required.length) throw new Error("Dados não fornecidos.");
  if (missing.length > 0)
    throw new Error(`Preencha todos os campos: ${missing.join(", ")}`);

  return true;
}

function validateData(data) {
  if (data.age < 18) throw new Error("O cliente deve ser maior de idade.");
  if (data.cpf.length !== 11) throw new Error("O CPF deve conter 11 dígitos.");
  if (data.income < 2999) throw new Error("A renda deve ser maior que R$ 2999.");
}

function verifyCreditModality(data) {
  const loans = [];
  if (personalRules(data)) loans.push({ type: "PERSONAL", interest_rate: 4 });
  if (consignmentRules(data)) loans.push({ type: "CONSIGNMENT", interest_rate: 2 });
  if (guaranteedRules(data)) loans.push({ type: "GUARANTEED", interest_rate: 3 });
  return loans;
}

function personalRules(data) {
  if (data.income <= 3000) return true;
  if (data.income > 3000 && data.income <= 5000 && data.age < 30 && data.location.toUpperCase() === "RS") {
    return true;
  }
  return false;
}

function consignmentRules(data) {
  return data.income >= 5000;
}

function guaranteedRules(data) {
  return personalRules(data);
}

module.exports = { requiredFields, validateData, verifyCreditModality };
