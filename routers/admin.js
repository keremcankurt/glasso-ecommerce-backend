const express = require("express");
const {
    getAccessToRoute,
    getAdminAccess,
  } = require("../middlewares/authorization/auth");
const { 
  addProduct, 
  addPromotionalMessage, 
  addBanner, 
  deletePromotionalMessage, 
  deleteBanner, 
  banners, 
  promotionalMessages, 
  deleteProduct,
  updateProduct
 } = require("../controllers/admin");
// const imageUpload = require("../middlewares/libraries/imageUpload");

  const router = express.Router();

  router.use([getAccessToRoute, getAdminAccess]);
  router.post("/add-product", addProduct);
  router.delete("/delete-product/:id", deleteProduct);
  router.put("/update-product/:id", updateProduct);

  router.get("/get-messages", promotionalMessages)
  router.post("/add-promotional-message", addPromotionalMessage);
  router.delete("/delete-promotional-message/:id", deletePromotionalMessage);

  router.get("/get-banners",banners)
  router.post("/add-banner", addBanner);
  router.delete("/delete-banner/:id", deleteBanner);

  module.exports = router;