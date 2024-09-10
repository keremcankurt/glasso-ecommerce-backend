const express = require("express");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const product = require("./product");

const router = express.Router();
router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);
router.use("/product",product);
module.exports = router;