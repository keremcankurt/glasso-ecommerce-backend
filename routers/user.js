const express = require("express");
const {
    getAccessToRoute,
  } = require("../middlewares/authorization/auth");
const { getProfile, favProduct, getCart, getOrders } = require("../controllers/user");
const { checkProductExist } = require("../middlewares/database/databaseErrorHelpers");


  const router = express.Router();

  router.post("/cart", getCart);

  router.use([getAccessToRoute]);
  router.get("/profile", getProfile);
  router.get("/orders", getOrders);
  router.put("/:productId/fav",[checkProductExist],favProduct);
  module.exports = router;