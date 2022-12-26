/* const express = require("express");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:tomar mongo compass id/test");
    consol.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    process.exit(1);
  }
};
app.get("/", (req, res) => {
  res.send("Hello From nafisa!");
});

app.listen(port, async () => {
  console.log(`nafisa App listening on port ${port}`);
  await connectDb();
});
 */