const Product = require("../models/Product");

const products = (async (req, res, next) => {
  try {
    const products = await Product.find()

    res.status(201).json(products)
  } catch (error) {
    next(error)
  }


  });

module.exports = {
    products
  }