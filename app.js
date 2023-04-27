require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
// helps you secure your Express apps by setting various HTTP headers
const cors = require("cors");
// enable cors
const xss = require("xss-clean");
// sanitize user inputs
const rateLimiter = require("express-rate-limit");
// limit repeated requests

const express = require("express");
const app = express();
// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// HERE WE CAN CREATE SIMPLE "/" route to see if the app is deployed
app.get("/", (req, res) => {
  res.send("jobs api");
});
// we need to add engines in package.json
// we also need to change nodemon to node

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
// we need authentication for all the routes thats why we add middleware here

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
