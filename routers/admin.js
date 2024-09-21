const express = require("express");
const {
    getAccessToRoute,
    getAdminAccess,
  } = require("../middlewares/authorization/auth");
const { 
  addBanner, 
  addProduct, 
  deleteBanner, 
  updateProduct,
  deleteProduct, 
  addRecommendedProduct,
  addPromotionalMessage, 
  deletePromotionalMessage,
  removeRecommendedProduct,
  updateCampaign,
  getDashboardDatas,
  deliverOrder,
  shipOrder, 
 } = require("../controllers/admin");
// const imageUpload = require("../middlewares/libraries/imageUpload");

  const router = express.Router();

  router.use([getAccessToRoute, getAdminAccess]);
  router.post("/add-product", addProduct);
  router.delete("/delete-product/:id", deleteProduct);
  router.put("/update-product/:id", updateProduct);
  
  router.post("/add-recommended-product/:id", addRecommendedProduct);
  router.delete("/delete-recommended-product/:id", removeRecommendedProduct);
  
  
  router.post("/add-promotional-message", addPromotionalMessage);
  router.delete("/delete-promotional-message/:id", deletePromotionalMessage);
  
  router.post("/add-banner", addBanner);
  router.delete("/delete-banner/:id", deleteBanner);
  
  router.put("/update-campaign", updateCampaign);

  router.get("/dashboard", getDashboardDatas)

  router.put("/deliver-order/:orderId", deliverOrder)
  router.put("/ship-order", shipOrder)

  module.exports = router;