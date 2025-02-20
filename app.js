const express = require("express");
const { sequelize, dbConnection } = require("./config/database");
const {router} = require("./routes/user");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require("cookie-parser");



dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"], 
    credentials: true,
  })
);

app.use(express.json());

const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 1000 * 60 * 60, 
    },
  })
);

sessionStore.sync();

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
