const express = require("express");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const product = require("./product");
const payment = require("./payment");

const router = express.Router();
router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);
router.use("/product",product);
router.use("/payment",payment);
module.exports = router;