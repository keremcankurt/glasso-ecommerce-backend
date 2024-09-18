const express = require("express");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const { payment, paymentCallback } = require("../controllers/payment");

const router = express.Router();

router.use(getAccessToRoute)
router.post("/", payment);
router.post("/paymentCallback", paymentCallback);
module.exports = router;
