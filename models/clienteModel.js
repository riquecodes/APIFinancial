const pool = require("../db");

async function buscarClientePorCPF(cpf) {
  const [rows] = await pool.query("SELECT * FROM clientes WHERE cpf = ?", [cpf]);
  return rows;
}

async function atualizarCliente(cliente) {
  await pool.query(
    "UPDATE clientes SET name = ?, age = ?, income = ?, location = ? WHERE cpf = ?",
    [cliente.name, cliente.age, cliente.income, cliente.location, cliente.cpf]
  );
}

async function inserirCliente(cliente) {
  await pool.query(
    "INSERT INTO clientes (name, age, cpf, income, location) VALUES (?, ?, ?, ?, ?)",
    [cliente.name, cliente.age, cliente.cpf, cliente.income, cliente.location]
  );
}

module.exports = { buscarClientePorCPF, atualizarCliente, inserirCliente };