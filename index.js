const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());

// create schema

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  department:String,
  password:String,
  createdTime: Date,
  updatedTime: Date

});
// create model
const AllUser = mongoose.model("AllUser", userSchema);

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

// User
// as a buyer or as a seller sign up create:
/* app.post("/users", async (req, res) => {
  const user = req.body;
  // console.log(user);
  const result = await AllUser.insertOne(user);
  res.send(result);
});
 */
app.post("/users", async (req, res) => {
  try {
    const newUsers = new AllUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      password: req.body.password,
      createdTime: req.body.createdTime,
      updatedTime: req.body.updatedTime,
     
    });
    const userData = await newUsers.save();
    res.status(201).send(userData);
    console.log(userData);
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



app.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await AllUser.findOne(query);
  res.send({ isAdmin: user?.role === "admin" });
});


/* --------Delete------------- */
    // ----delete user----
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: (id) };
      const result = await AllUser.deleteOne(query);
      res.send(result);
    });



app.get("/", (req, res) => {
  res.send("Hello From nafisa!");
});

app.listen(port, () => {
  console.log(`nafisa's App listening on port ${port}`);
});
