const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");


const getProfile = (async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id).select("-email -orders -isAccountConfirmed -tempToken -tempTokenExpire")
        res.status(200).json({
          user
        }); 
    } catch (error) {
        next(error)
    }
    
  });

  const favProduct = (async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.productId);
  
      if (product.favs.includes(req.user.id)) {
        await product.updateOne({
          $pull: {
            favs: req.user.id,
          },
        });
        await User.findByIdAndUpdate(
          req.user.id,
          {
            $pull: {
              favProducts: req.params.productId,
            },
          },
          {
            new: true,
          }
        )
        res.status(200).json({
          success: true
        });
      } else {
        await product.updateOne({
          $push: {
            favs: req.user.id,
          },
        });
         await User.findByIdAndUpdate(
          req.user.id,
          {
            $push: {
              favProducts: req.params.productId,
            },
          },
          {
            new: true,
          }
        )
        res.status(200).json({
          success: true
        });
      }
    } catch (error) {
      next(error)
    }
  });
 
const getCart = async (req, res, next) => {
  try {
    const cartItems = req.body;
    const selectedProducts = [];

    for (const item of cartItems) {
      const productId = Object.keys(item)[0];
      const quantity = item[productId];
      const product = await Product.findById(productId);

      if (!product) {
        continue;
      }

      if (product.stock === 0) {
        continue;
      }

      const selectedProduct = {
        ...product.toObject(),
        quantity: product.stock < quantity ? product.stock : quantity
      };

      selectedProducts.push(selectedProduct);
    }
    res.json(selectedProducts);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
      status: { $nin: ["Ödeme Beklemede", "Ödeme Başarısız"] }
    }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getProfile,
    favProduct,
    getCart,
    getOrders
}