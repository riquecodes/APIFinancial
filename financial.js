const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const pool = require("./db"); 

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/creditos", async (req, resp) => {
  console.log("rota chamada");

  const data = {
    ...req.body,
    age: Number(req.body.age),
    income: Number(req.body.income),
  };

  try {
    requiredFields(data); 
    validateData(data);

    console.log("Executando SELECT");

    const [rows] = await pool.query(`SELECT * FROM clientes WHERE cpf = ?`, [
      data.cpf,
    ]);

    if (rows.length > 0) {
      await pool.query(
        `UPDATE clientes
         SET name = ?, age = ?, income = ?, location = ?
         WHERE cpf = ?`,
        [data.name, data.age, data.income, data.location, data.cpf]
      );
    } else {
      await pool.query(
        `INSERT INTO clientes (name, age, cpf, income, location)
         VALUES (?, ?, ?, ?, ?)`,
        [data.name, data.age, data.cpf, data.income, data.location]
      );
    }

    console.log("final banco");

    console.log("Dados recebidos:", data);
    console.log("Empréstimos liberados:", verifyCreditModality(data));

    const loans = verifyCreditModality(data);

    const response = {
      customer: data.name,
      loans,
    };

    return resp.status(200).send(response);
  } catch (error) {
    console.error("Erro capturado:", error);
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
    throw new Error(
      `Preencha todos os campos obrigatórios. Campos ausentes: ${missing.join(
        ", "
      )}`
    );
  }

  return missing.length === 0;
}

function validateData(data) {
  if (data.age < 0) {
    throw new Error("A idade deve ser um número positivo.");
  }

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
    });
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
  if (
    data.income > 3000 &&
    data.income <= 5000 &&
    data.age < 30 &&
    data.location.toUpperCase() === "RS"
  ) {
    return true;
  }
  return false;
};

const consignmentRules = (data) => {
  if (data.income >= 5000) {
    return true;
  }
  return false;
};

const guaranteedRules = (data) => {
  if (personalRules(data)) {
    return true;
  }
  return false;
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/result", (req, res) => {
  res.render("result");
});

// rota de teste de conexão com o banco
app.get("/db-ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "up", result: rows[0] });
  } catch (e) {
    res.status(500).json({ db: "down", error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
