const express = require("express");
const {
    getAccessToRoute,
  } = require("../middlewares/authorization/auth");
const { getProfile, favProduct } = require("../controllers/user");
const { checkProductExist } = require("../middlewares/database/databaseErrorHelpers");


  const router = express.Router();

  router.use([getAccessToRoute]);
  router.get("/profile", getProfile);
  router.put("/:productId/fav",[checkProductExist],favProduct);
  module.exports = router;