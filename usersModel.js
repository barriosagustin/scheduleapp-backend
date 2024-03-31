const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: Number,
  email: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;