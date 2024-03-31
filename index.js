const express = require("express");
const connectDB = require("./db");
const User = require("./usersModel");

function setCommonHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

const app = express();
app.use(express.json());
app.use(setCommonHeaders);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});

app.get("/users", async (req, res) => {
    try {
      const usuarios = await User.find();
      res.json(usuarios);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ mensaje: "Error" });
    }
  });