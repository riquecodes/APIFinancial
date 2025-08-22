const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/creditos", (req, resp) => {

  try {
    const data = req.body;

    requiredFields(data);

    validateData(data);

    verifyCreditModality(data);
    const response = {
      customer: data.name,
      loans: verifyCreditModality(data),
    };

    return resp.status(200).send(response);
  } catch (error) {
    const response = {
      msg: error.message,
    };
    return resp.status(400).send(response);
  }

});

function requiredFields(data) {
  const required = ["name", "age", "cpf", "income", "location"];
  const missing = required.filter((field) => !data.hasOwnProperty(field));

  if (missing.length === required.length) {
    throw new Error("Dados não fornecidos.");
  }

  if (missing.length > 0) {
    throw new Error (`Preencha todos os campos obrigatórios. Campos ausentes: ${missing.join(", ")}`);
  }

  return missing.length === 0;
}

function validateData(data) {
  if (data.age < 0) {
    throw new Error("A idade deve ser um número positivo.");
  };

  if (data.cpf.length !== 11) {
    throw new Error("O CPF deve conter 11 dígitos.");
  }

  if (data.income < 2999) {
    throw new Error("A renda deve ser maior que R$ 2999.");
  }
}

function verifyCreditModality(data) {
  const loans = [];
  
  if (personalRules(data)) {
    loans.push({
      type: "PERSONAL",
      interest_rate: 4,
    })
  }

  if (consignmentRules(data)) {
    loans.push({
      type: "CONSIGNMENT",
      interest_rate: 2,
    });
  }

  if (guaranteedRules(data)) {
    loans.push({
      type: "GUARANTEED",
      interest_rate: 3,
    });
  }
  return loans;
}

const personalRules = (data) => {
  if (data.income <= 3000) {
    return true;
  }
  if (data.income > 3000 && data.income <= 5000 && data.age < 30 && data.location === "RS") {
    return true;
  }
  return false;
}

const consignmentRules = (data) => {
  if (data.income >= 5000) {
    return true;
  }
  return false;
}

const guaranteedRules = (data) => {
  if (personalRules(data)) {
    return true;
  }
  return false;
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
