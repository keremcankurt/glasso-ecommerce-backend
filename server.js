const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser")

//Server global variable
dotenv.config({
  path: "./config/env/config.env",
});
//Connect Database
connectDatabase();
//App Started
const app = express();
app.use(express.static('public'));
app.use(function(req, res, next) {
  const allowedOrigins = [
    "http://192.168.1.109:3000", 
    "http://localhost:3000", 
    "http://127.0.0.1:3000"
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(cookieParser());
app.use(express.json());
const PORT = process.env.PORT;
app.use("/api", routers);
app.use(customErrorHandler);
// Server init
app.listen(PORT, () => {
  console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});

