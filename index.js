const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");

const port = process.env.PORT || 5000;
const app = express();
const jwt = require("jsonwebtoken");
//middleware

app.use(cors());
app.use(express.json());

/* Jwt token */

// Jwt Token
function verifyJWT(req, res, next) {
  console.log("token inside verifyJWT", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  // bearer  eta split(" ") kora hoilo
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

// create schema

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  password: String,
  createdTime: Date,
  updatedTime: Date,
});
// create model
const AllUser = mongoose.model("AllUser", userSchema);
// const UpdatedUser = mongoose.model("UpdatedUser", userSchema);

// Mongodb connected
mongoose.set("strictQuery", false);

const db = (module.export = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.grwbbr0.mongodb.net/Profile-Management?retryWrites=true&w=majority`,
      connectionParams
    );
    console.log("connect");
  } catch (error) {
    console.log(error);
    console.log("not connect");
  }
});
db();

app.get("/jwt", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const user = await AllUser.findOne(query);
  console.log(user);
  if (user) {
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {});
    return res.send({ token: token });
  }
  res.status(403).send({ token: "" });
});

app.post("/users",verifyJWT, async (req, res) => {
  console.log(req.body);
  try {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    console.log(req.body.password);
    console.log(hashedPassword);
    const newUsers = new AllUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
      createdTime: req.body.createdTime,
      updatedTime: req.body.updatedTime,
    });
    const userData = await newUsers.save();
    res.status(201).send(userData);
  } catch (error) {
    console.log(error);
  }
});

/* ------Update----User---------- */
// get All User
app.get("/users", async (req, res) => {
  const query = {};
  const users = await AllUser.find(query);
  res.send(users);
  console.log(users);
});

//---------- check admin-------
app.put("/users/admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      role: "admin",
    },
  };
  const result = await AllUser.updateOne(filter, updatedDoc, options);
  res.send(result);
});
// Edit User
app.put("/users/edit/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      Edit: "edit",
    },
  };
  const result = await AllUser.updateOne(filter, updatedDoc, options);
  res.send(result);
});

app.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await AllUser.findOne(query);
  res.send({ isAdmin: user?.role === "admin" });
});
app.get("/users/user/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await AllUser.findOne(query);
  res.send({ isUser: user?.role === "user" });
});

/* --------Delete------------- */
// ----delete user----
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const result = await AllUser.deleteOne(query);
  res.send(result);
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const result = await AllUser.findOne(query);
  res.send(result);
});

app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const user = req.body;
  const options = { upsert: true };
  const updateUser = {
    $set: {
      firstName: user.firstName,
      lastName: user.lastName,

      email: user.email,
    },
  };

  const result = await AllUser.updateMany(query, updateUser, options);
  res.send(result);
});

app.get("/users/user", async (req, res) => {
  const query = { role: "user" };
  const users = await AllUser.find(query);
  res.send(users);
});
app.get("/users/admin", async (req, res) => {
  const query = { role: "admin" };
  const admins = await AllUser.find(query);
  res.send(admins);
});

app.get("/", (req, res) => {
  res.send("Hello From nafisa!");
});

app.listen(port, () => {
  console.log(`nafisa's App listening on port ${port}`);
});
