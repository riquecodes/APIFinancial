const { requiredFields, validateData, verifyCreditModality } = require("../services/creditosService");
const pool = require("../db");

async function processarCredito(req, res) {
  const data = {
    ...req.body,
    age: Number(req.body.age),
    income: Number(req.body.income),
  };

  try {
    requiredFields(data);
    validateData(data);

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

    const loans = verifyCreditModality(data);

    return res.status(200).json({
      customer: data.name,
      loans,
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

module.exports = { processarCredito };
