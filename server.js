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
  origin: 'https://dsk-ticaret.netlify.app/', // İzin verilen kök URL
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // İzin verilen HTTP metodları
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // İzin verilen başlıklar
  credentials: true, // Kimlik doğrulama bilgilerini (örneğin, çerezler) paylaşma izni
  exposedHeaders: ['Authorization'] // İzin verilen gösterilen başlık (opsiyonel)
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

