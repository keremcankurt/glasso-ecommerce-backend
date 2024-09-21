const express = require("express");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const { payment, paymentCallback, paymentIyzico } = require("../controllers/payment");

const router = express.Router();

router.use(getAccessToRoute)
router.post("/", payment);
router.post("/paymentIyzico", paymentIyzico);
router.post("/paymentCallback", paymentCallback);
module.exports = router;
