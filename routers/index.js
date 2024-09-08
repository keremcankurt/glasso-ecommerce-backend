const express = require("express");
const auth = require("./auth");
const admin = require("./admin");
const product = require("./product");

const router = express.Router();
router.use("/auth",auth);
router.use("/admin",admin);
router.use("/product",product);
module.exports = router;