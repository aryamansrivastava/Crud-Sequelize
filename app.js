const { sequelize } = require("./config/database");
const express = require("express");
const { dbConnection } = require("./config/database");
const { router } = require("./routes/user");
const cors = require("cors");

const app = express();

// Enable CORS with specific settings
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"], 
  })
);

// Parse JSON requests
app.use(express.json());

// Use routes
app.use("/", router);

// Start the server
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
