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
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true, 
  exposedHeaders: ['Authorization'] 
}));

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

