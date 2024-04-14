const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./usersModel");
const Course = require("./coursesModel");
const moment = require("moment");
const { ObjectId } = require("mongodb");

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});

app.get("/", async (req, res) => {
  res.json("Backend scheduleapp ");
});

//Users
app.get("/api/users", async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ mensaje: "Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const {
      name,
      lastname,
      cellphone,
      email,
      country,
      current_country,
      start_date,
    } = req.body;
    const newUser = new User({
      name,
      lastname,
      cellphone,
      email,
      country,
      current_country,
      start_date,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ mensaje: "Error" });
  }
});

//SignUp user
app.post("/api/signup", async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //TODO... JWT

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ mensaje: "Error" });
  }
});

app.get("/api/course/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    const idConverted = new ObjectId(courseId);
    const course = await Course.findById(idConverted);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ mensaje: "Error trying to get the course" });
  }
});

app.get("/api/courses/filterByDate", async (req, res) => {
  try {
    const startDateString = req.query.startDate;

    if (!startDateString) {
      return res
        .status(400)
        .json({ message: "La fecha de inicio es requerida" });
    }

    const startDate = moment(startDateString, "DD/MM/YYYY").toDate();

    const courses = await Course.find({ startDate });

    res.json(courses);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ message: "Error al obtener cursos" });
  }
});
