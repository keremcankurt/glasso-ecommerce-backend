const Iyzipay = require('iyzipay');
const Product = require('../models/Product'); // MongoDB Product modeli
const Order = require('../models/Order'); // MongoDB Order modeli
const CustomError = require('../helpers/error/CustomError');

const paymentIyzico = async (req, res, next) => {
  try {
    const info = req.body;
    const cart = info.cart;
    let totalPrice = 0;
    let basketItems = [];
    let productsInOrder = [];

    for (const item of cart) {
      const productId = Object.keys(item)[0]; 
      const quantity = item[productId]; 

      const product = await Product.findById(productId);

      if (!product) {
        return next(new CustomError(`Ürün bulunamadı: ${productId}`, 404));
      }

      if (product.stock < quantity) {
        return next(new CustomError(`${product.name} ürünü için yeterli stok yok.`, 400));
      }

      let price;
      const now = new Date();
      if (product.campaign && product.campaign.endDate > now) {
        price = product.price * (1 - product.campaign.discountPercentage / 100);
      } else {
        price = product.price;
      }

      totalPrice += price * quantity;

      for (let i = 0; i < quantity; i++) {
        basketItems.push({
          id: product._id.toString(),
          name: product.name,
          category1: 'Gözlük', 
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: price.toFixed(2),
        });
      }

      productsInOrder.push({
        id: product._id.toString(),
        name: product.name,
        price: price,
        image: product.images[0], 
        quantity
      });
    }

    const newOrder = new Order({
      userId: req.user.id,
      products: productsInOrder, 
      status: "Ödeme Beklemede",
      address: info.address,
      cargo: {
        shippingCompany: '',
        trackingNumber: '',
      },
      price: (totalPrice > 1000 ? totalPrice : totalPrice + 59).toFixed(2)
    });

    await newOrder.save();

    const iyzipay = new Iyzipay({
      apiKey: process.env.PAYMENT_API_KEY,
      secretKey: process.env.PAYMENT_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com',
    });

    const request = {
      locale: Iyzipay.LOCALE.TR,
      price: totalPrice.toFixed(2),
      paidPrice: (totalPrice > 1000 ? totalPrice : totalPrice + 59).toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.SERVER_URL}/api/payment/paymentCallback`, 
      basketId: newOrder._id.toString(),
      buyer: {
        id: req.user.id,
        name: info.address.name,
        surname: info.address.surname,
        email: req.user.email,
        identityNumber: '11111111111',
        registrationAddress: info.address.addressDesc,
        ip: req.ip,
        city: info.address.city,
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: info.address.name,
        city: info.address.city,
        country: 'Turkey',
        address: info.address.addressDesc,
      },
      billingAddress: {
        contactName: info.address.name,
        city: info.address.city,
        country: 'Turkey',
        address: info.address.addressDesc,
      },
      basketItems: basketItems,
    };

    iyzipay.checkoutFormInitialize.create(request, function (err, result) {
      if (result.status !== 'success') {
        return next(new CustomError(result.errorMessage, 400));
      }

      return res.status(200).json({ ...result });
    });
  } catch (error) {
    next(error);
  }
};
const payment = async (req, res, next) => {
  try {
    const info = req.body;
    const cart = info.cart;
    let totalPrice = 0;
    let basketItems = [];
    let productsInOrder = [];

    for (const item of cart) {
      const productId = Object.keys(item)[0]; 
      const quantity = item[productId]; 

      const product = await Product.findById(productId);

      if (!product) {
        return next(new CustomError(`Ürün bulunamadı: ${productId}`, 404));
      }

      if (product.stock < quantity) {
        return next(new CustomError(`${product.name} ürünü için yeterli stok yok.`, 400));
      }

      let price;
      const now = new Date();
      if (product.campaign && product.campaign.endDate > now) {
        price = product.price * (1 - product.campaign.discountPercentage / 100);
      } else {
        price = product.price;
      }

      totalPrice += price * quantity;

      for (let i = 0; i < quantity; i++) {
        basketItems.push({
          id: product._id.toString(),
          name: product.name,
          category1: 'Gözlük', 
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: price.toFixed(2),
        });
      }

      productsInOrder.push({
        id: product._id.toString(),
        name: product.name,
        price: price,
        image: product.images[0], 
        quantity
      });
    }

    const iyzipay = new Iyzipay({
      apiKey: process.env.PAYMENT_API_KEY,
      secretKey: process.env.PAYMENT_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com',
    });

    const request = {
      locale: Iyzipay.LOCALE.TR,
      price: totalPrice.toFixed(2),
      paidPrice: (totalPrice > 1000 ? totalPrice : totalPrice + 59).toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: info.cardInfo.cardHolderName,
        cardNumber: info.cardInfo.cardNumber,
        expireMonth: info.cardInfo.expirationMonth,
        expireYear: info.cardInfo.expirationYear,
        cvc: info.cardInfo.cvv,
      },
      buyer: {
        id: req.user.id,
        name: info.address.name,
        surname: info.address.surname,
        email: req.user.email,
        identityNumber: '11111111111',
        registrationAddress: info.address.addressDesc,
        ip: req.ip,
        city: info.address.city,
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: info.address.name,
        city: info.address.city,
        country: 'Turkey',
        address: info.address.addressDesc,
      },
      billingAddress: {
        contactName: info.address.name,
        city: info.address.city,
        country: 'Turkey',
        address: info.address.addressDesc,
      },
      basketItems: basketItems,
    };

    iyzipay.payment.create(request, async function (err, result) {
      if (result.status !== 'success') {
        return next(new CustomError(result.errorMessage, 400));
      }
      
      // Stok güncelleme
      for (const item of cart) {
        const productId = Object.keys(item)[0];
        const quantity = item[productId];

        await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
      }

      try {
        const newOrder = new Order({
          userId: req.user.id,
          products: productsInOrder, 
          status: "Sipariş Hazırlanıyor",
          address: info.address,
          cargo: {
            shippingCompany: '',
            trackingNumber: '',
          },
          price: (totalPrice > 1000 ? totalPrice : totalPrice + 59).toFixed(2)
        });

        await newOrder.save();
        return res.status(200).json({ message: "Siparişiniz alındı." });
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};


const paymentCallback = async (req, res, next) => {
  try {
    const iyzipay = new Iyzipay({
      apiKey: process.env.PAYMENT_API_KEY,
      secretKey: process.env.PAYMENT_SECRET_KEY,
      uri: 'https://sandbox-api.iyzipay.com',
    });

    const token = req.body.token;

    iyzipay.checkoutForm.retrieve({ token }, async (err, result) => {
      const order = await Order.findById(result.basketId);

      if (!order) {
        return next(new CustomError('Sipariş bulunamadı', 404));
      }

      if (result.paymentStatus === 'SUCCESS') {
        order.status = "Sipariş Hazırlanıyor";
        await order.save();

        // Stok güncelleme
        for (const product of order.products) {
          await Product.findByIdAndUpdate(product.id, { $inc: { stock: -product.quantity } });
        }

        return res.redirect(`${process.env.CLIENT_URL}/order?status=SUCCESS`);
      } else {
        order.status = "Ödeme Başarısız";
        await order.save();

        return res.redirect(`${process.env.CLIENT_URL}/order?status=FAILURE`);
      }
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { payment, paymentCallback, paymentIyzico };
