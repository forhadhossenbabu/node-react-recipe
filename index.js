const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/utils/database");
const log = console.log;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));

//Routes
app.use(require("./src/routes/user.routes"));

//Seting up node server with databse
const port = process.env.PORT || 4000;
app.listen(
  port,
  async () =>
    await sequelize
      .sync()
      .then(() => {
        log("\x1b[35m" + "Server is active on", port);
        log("Database has been established.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      })
);
