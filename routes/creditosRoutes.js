const express = require("express");
const { processarCredito } = require("../controllers/creditosController");

const router = express.Router();

router.post("/creditos", processarCredito);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/result", (req, res) => {
  res.render("result");
});

module.exports = router;