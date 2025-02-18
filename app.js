const express = require("express");
const { sequelize, dbConnection } = require("./config/database");
const {router} = require("./routes/user");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"], 
  })
);

app.use(express.json());

app.use("/", router);

app.listen(4000, async () => {
  console.log("Server is listening at port 4000");

  try {
    await dbConnection();
    sequelize
      .sync()
      .then(() => console.log("Database connected successfully!"))
      .catch((err) => {
        console.error("Database cannot be connected", err);
        throw new Error(err);
      });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
