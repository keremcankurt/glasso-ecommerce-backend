const CustomError = require("../helpers/error/CustomError");
const Ad = require("../models/Ad");
const Product = require("../models/Product");
const RecommendedProducts = require("../models/RecommendedProducts");

const addProduct = async (req, res, next) => {
  try {
    const information = req.body;

    const product = await Product.create(information);

    res.status(201).json({
      message: "Yeni ürün ekleme işlemi başarılı",
      product: product
    });
  } catch (error) {
    next(error);
  }
};

  const updateProduct = async (req, res, next) => {
    try {
      const information = req.body;
      const id = req.params.id;
  
      const updatedProduct = await Product.findByIdAndUpdate(id, information, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
  
      res.status(200).json({ message: "Ürün güncelleme işlemi başarılı", updatedProduct });
    } catch (error) {
      next(error);
    }
  };
const deleteProduct = (async (req, res, next) => {
  try {
    const id = req.params.id
    await Product.findByIdAndDelete(
      id
    )

    res.status(201).json({message: "Ürün silme işlemi başarılı."})
  } catch (error) {
    next(error)
  }


  });

  const addPromotionalMessage = async (req, res, next) => {
    try {
      const { title } = req.body;
  
      if (!title) {
        return next(
          new CustomError(
            "Mesaj başlığı gerekli.",
            400
          ))
      }
  
      let ad = await Ad.findOne();
  
      if (!ad) {
        ad = new Ad();
      }
  
      ad.messages.push({ title });
  
      await ad.save();
  
      res.status(201).json({ message: "Mesaj başarıyla eklendi.", messages: ad.messages });
    } catch (err) {
      console.log(err)
      return next(
        new CustomError(
          "Mesaj eklenirken hata oluştu.",
          500
        ))
    }
  }
  const deletePromotionalMessage = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      let ad = await Ad.findOne();
  
      if (!ad) {
        return next(
          new CustomError(
            "Reklam bulunamadı.",
            404
          ))
      }
  
      const updatedMessages = ad.messages.filter(message => message.id.toString() !== id);
  
      if (updatedMessages.length === ad.messages.length) {
        return next(
          new CustomError(
            "Mesaj bulunamadı.",
            404
          ))
      }
  
      ad.messages = updatedMessages;
      await ad.save();
  
      res.status(200).json({ message: "Mesaj başarıyla silindi.", messages: ad.messages });
    } catch (err) {
      return next(
        new CustomError(
          "Mesaj silinirken hata oluştu.",
          500
        ))
    }
  }

  const addBanner = async (req, res, next) => {
    try {
      const { title, imageUrl } = req.body;
  
      if (!imageUrl) {
        return next(
          new CustomError(
            "Banner görsel URL'si gerekli.",
            400
          ))
      }
  
      let ad = await Ad.findOne();  
      if (!ad) {
        ad = new Ad();
      }
  
      ad.images.push({ title: title || "Untitled Banner", imageUrl });
  
      await ad.save();
  
      res.status(201).json({ message: "Banner başarıyla eklendi.", banners: ad.images });
    } catch (err) {
      return next(
        new CustomError(
          "Banner eklenirken hata oluştu.",
          500
        ))
    }
  }

  const deleteBanner = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      let ad = await Ad.findOne();
  
      if (!ad) {
        return next(
          new CustomError(
            "Reklam bulunamadı.",
            404
          ))
      }
  
      const updatedImages = ad.images.filter(image => image.id.toString() !== id);
  
      if (updatedImages.length === ad.images.length) {
        return next(
          new CustomError(
            "Banner bulunamadı.",
            404
          ))
      }
  
      ad.images = updatedImages;
      await ad.save();
  
      res.status(200).json({ message: "Banner başarıyla silindi.", banners: ad.images });
    } catch (err) {
      return next(
        new CustomError(
          "Banner silinirken hata oluştu.",
          500
        ))
      
    }
  }


  const addRecommendedProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          new CustomError(
            "Ürün bulunamadı.",
            400
          )
        );
      }
  
      let recommendedProducts = await RecommendedProducts.findOne();
      if (!recommendedProducts) {
        recommendedProducts = new RecommendedProducts();
      }
  
      if (!recommendedProducts.products.includes(productId)) {
        recommendedProducts.products.push(productId);
        await recommendedProducts.save();
        
        res.status(200).json({
          message: "Ürün tavsiyelere eklendi",
        });
      } else {
        return next(
          new CustomError(
            "Ürün zaten tavsiye edilenler arasında",
            400
          )
        );
      }
    } catch (error) {
      return next(error);
    }
  };
  const removeRecommendedProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      
      let recommendedProducts = await RecommendedProducts.findOne();
      if (!recommendedProducts) {
        return next(
          new CustomError(
            "Tavsiye edilen ürünler bulunamadı.",
            400
          )
        );
      }
  
      const productIndex = recommendedProducts.products.indexOf(productId);
      if (productIndex > -1) {
        recommendedProducts.products.splice(productIndex, 1);
        await recommendedProducts.save();
        
        res.status(200).json({
          message: "Ürün tavsiyelerden silindi",
        });
      } else {
        return next(
          new CustomError(
            "Ürün zaten tavsiye edilenler arasında değil",
            400
          )
        );
      }
    } catch (error) {
      return next(error);
    }
  };

  const updateCampaign =  async (req, res) => {
    const { productIds, endDate, discountPercentage } = req.body; 
  
    try {
      const updatePromises = productIds.map(async (productId) => {
        return Product.findByIdAndUpdate(
          productId,
          {
            $set: {
              'campaign.endDate': endDate,
              'campaign.discountPercentage': discountPercentage,
            },
          },
          { new: true, runValidators: true } 
        );
      });
  
      await Promise.all(updatePromises);
  
      res.status(200).json({
        message: 'Kampanya oluşturuldu.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Kampanya güncellenirken bir hata oluştu.',
        error: error.message,
      });
    }
  }
  

module.exports = {
    addBanner,
    addProduct,
    deleteBanner,
    deleteProduct,
    updateProduct,
    updateCampaign,
    addPromotionalMessage,
    addRecommendedProduct,
    removeRecommendedProduct,
    deletePromotionalMessage,
  };
  