const express = require("express");
const { products, promotionalMessages, banners, recommendedProducts } = require("../controllers/product");

  const router = express.Router();

  router.get("/", products);

  router.get("/messages", promotionalMessages)
  router.get("/banners",banners)

  router.get("/recommended-products",recommendedProducts)
  
  module.exports = router;