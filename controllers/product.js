const Ad = require("../models/Ad");
const Product = require("../models/Product");
const RecommendedProducts = require("../models/RecommendedProducts");

const products = (async (req, res, next) => {
  try {
    const products = await Product.find()

    res.status(201).json(products)
  } catch (error) {
    next(error)
  }


  });

  const promotionalMessages = async (req, res, next) => {
    try {
      const ad = await Ad.findOne();
  
      if (!ad || ad.messages.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(ad.messages);
    } catch (err) {
      return next(
        new CustomError(
          "Mesajlar getirilirken hata oluştu.",
          500
        ))
      
    }
  }

  const banners = async (req, res, next) => {
    try {
      const ad = await Ad.findOne();
  
      if (!ad || ad.images.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(ad.images);
    } catch (err) {
      return next(
        new CustomError(
          "Bannerlar getirilirken hata oluştu.",
          500
        ))
    }
  }

  const recommendedProducts = async (req, res, next) => {
    try {
      const recommendedProducts = await RecommendedProducts.find();
      res.status(200).json({products: recommendedProducts[0].products});
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
    banners,
    products,
    promotionalMessages,
    recommendedProducts,
  }