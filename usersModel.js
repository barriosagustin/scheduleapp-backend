const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  cellphone: Number,
  email: String,
  country: String,
  current_country: String,
  start_date: String,
  password: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
