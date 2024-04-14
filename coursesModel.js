const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  startDate: String,
  course: String,
});

const Course = mongoose.model("courses", coursesSchema);

module.exports = Course;
