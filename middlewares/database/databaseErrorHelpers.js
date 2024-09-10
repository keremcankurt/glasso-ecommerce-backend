const CustomError = require("../../helpers/error/CustomError");
const Product = require("../../models/Product");
const User = require("../../models/User");

const checkUserExists = (async (req, res, next) => {
  const id = req.params.id || req.query.id;
  const user = await User.findById({ _id: id });
  if (!user) {
    return next(new CustomError("There is no user with that id", 500));
  }
  next();
});
const checkIsUserConfirmed = (async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user.isAccountConfirmed) {
    return next(
      new CustomError("Your account is inactive, please check your email", 403)
    );
  }
  next();
});
const checkEmailExists = (async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user)
    return next(new CustomError("Bu mail adresine ait hesap bulunmamaktadır.", 400));
    
  next();
});

const checkProductExist = (async (req, res, next) => {
  const id = req.params.productId;
  const product = await Product.findById(id);
  if (!product) {
    return next(new CustomError("Ürün bulunamadı.", 400));
  }
  next();
});
module.exports = {
  checkUserExists,
  checkEmailExists,
  checkIsUserConfirmed,
  checkProductExist,
};
