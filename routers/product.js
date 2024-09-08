const express = require("express");
const { products } = require("../controllers/product");

  const router = express.Router();

  router.get("/", products);

  module.exports = router;