const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecommendedProductsSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RecommendedProducts", RecommendedProductsSchema);
