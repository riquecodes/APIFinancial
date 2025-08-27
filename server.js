const express = require("express");
const path = require("path");
const creditosRoutes = require("./routes/creditosRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", creditosRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});