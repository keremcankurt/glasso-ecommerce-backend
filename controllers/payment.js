const Iyzipay = require('iyzipay');
const Product = require('../models/Product'); // MongoDB Product modeli
const CustomError = require('../helpers/error/CustomError');

const payment = async(req, res, next) => {
    try {
        const info = req.body;
        const cart = info.cart;
        let totalPrice = 0;
        let basketItems = [];
        // Sepet içeriğini işleme
        for (const item of cart) {
            // Cart içerisindeki her item bir nesne olup, ID'yi anahtar olarak kullanır.
            const productId = Object.keys(item)[0];
            const quantity = item[productId];

            const product = await Product.findById(productId);

            // Ürün bulunamazsa hata döndür
            if (!product) {
                return next(new CustomError(`Ürün bulunamadı: ${productId}`, 404));
            }

            // Stok kontrolü
            if (product.stock < quantity) {
                return next(new CustomError(`${product.name} ürünü için yeterli stok yok.`, 400));
            }

            // Fiyat hesaplama
            let price;
            const now = new Date();
            if (product.campaign && product.campaign.endDate > now) {
                // Kampanya varsa indirimli fiyat
                price = product.price * (1 - (product.campaign.discountPercentage / 100));
            } else {
                // Kampanya yoksa normal fiyat
                price = product.price;
            }

            // Sepet için toplam fiyatı güncelle
            totalPrice += price * quantity;

            // Ürün adet miktarına göre basketItems'e ekle
            for (let i = 0; i < quantity; i++) {
                basketItems.push({
                    id: product._id.toString(),
                    name: product.name,
                    category1: 'Gözlük',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: price.toFixed(2) // Ürünün fiyatı
                });
            }
        }


        // Ödeme isteği için gerekli bilgileri oluştur
        const iyzipay = new Iyzipay({
            apiKey: process.env.PAYMENT_API_KEY,
            secretKey: process.env.PAYMENT_SECRET_KEY,
            uri: 'https://sandbox-api.iyzipay.com'
        });

        const request = {
            locale: Iyzipay.LOCALE.TR,
            price: totalPrice.toFixed(2),
            paidPrice: (totalPrice > 1000 ? totalPrice : totalPrice + 59).toFixed(2), // Ödeme ücretiyle fiyat farkı olabilir
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: 'http://localhost:4000/api/payment/paymentCallback',
            buyer: {
                id: req.user.id,
                name: info.address.name,
                surname: info.address.surname,
                email: req.user.email,
                identityNumber: '11111111111',
                registrationAddress: info.address.addressDesc,
                ip: '192.168.1.1',
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
            basketItems: basketItems 
        };
        iyzipay.checkoutFormInitialize.create(request, function (err, result) {
            if (result.status !== 'success') {
                return next(new CustomError(result.errorMessage,400))
            }
            
            return res.status(200).json({ ...result });
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
        uri: 'https://sandbox-api.iyzipay.com'
      });
  
      const token = req.body.token;
  
      iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
        console.log(result)
        return res.redirect(`http://localhost:3000/order?status=${result.paymentStatus}`);
      });
  
    } catch (error) {
      next(error);
    }
  };
  

module.exports = { payment, paymentCallback };
