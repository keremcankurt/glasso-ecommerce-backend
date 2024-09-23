# Glasso E-commerce - Backend

Bu proje, gözlük satış işlemlerini yönetmek için bir backend API'si oluşturmak amacıyla geliştirilmiştir. Projede Node.js ve Express.js kullanılarak RESTful bir API kurulmuştur.

## Proje Özellikleri

- **Node.js**: Sunucu tarafı için asenkron ve olay tabanlı bir JavaScript çalışma zamanı.
- **Express.js**: Web uygulamaları için minimalist bir framework.
- **MongoDB**: Veritabanı yönetimi için NoSQL çözümü.
- **JWT (JSON Web Token)**: Kullanıcı kimlik doğrulama ve yetkilendirme.
- **Mongoose**: MongoDB ile etkileşim için kullanılan bir ODM (Object Data Modeling) kütüphanesi.
- **Iyzico**: Güvenli ödeme işlemleri için entegre ödeme sistemi.

## Kurulum

### Kurulum Adımları

1. Bu repoyu klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/goruk-satis-sitesi-backend.git
   cd goruk-satis-sitesi-backend

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
3. **.env** dosyasını oluşturun ve gerekli ortam değişikenlerini ayarlayın
   ```bash
   #Server
   PORT = 4000
   NODE_ENV = development
   CLIENT_URL = http://localhost:3000
   SERVER_URL = http://localhost:4000

   #MongoDb
   MONGO_URI = your_mongo_uri

   #Token
   JWT_SECRET_KEY = kerem
   JWT_EXPIRE = 10d

   JWT_REFRESH_SECRET_KEY = kerem
   JWT_REFRESH_EXPIRE = 1d

   #Cookie
   JWT_COOKIE = 1000000

   #temp_token_expire
   TEMP_TOKEN_EXPIRE = 36000000

   #NodeMailer

   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_ADMIN = your_mail
   SMTP_PASS = password

   #Payment

   PAYMENT_API_KEY = key
   PAYMENT_SECRET_KEY = key
   
## API Kullanımı

### Auth

- **POST /api/auth/register**: kayıt işlemi
- **POST /api/auth/login**: giriş işlemi
- **PUT /api/auth/confirmaccount**: hesap onay işlemi
- **POST /api/auth/forgotpassword**: şifre değişiklik isteği
- **PUT /api/auth/changepassword**: şifre değiştirme işlemi

### User

- **POST /api/user/cart**: kullanıcının sepet bilgilerinin döndürür
- **GET /api/user/profile**: kullanıcı bilgilerini döndürür
- **GET /api/user/orders**: Kullanıcının geçmiş siparişlerini döndürür
- **PUT /:productId/fav**: Ürünü kullanıcının favorilerine ekler veya çıkartır

### Product

- **GET /api/product/**: Ürünleri döndürür

### Payment

- **POST /api/payment/**: Ödeme işlemini gerçekleştirir
- **POST /api/payment/paymentIyzico**: Ödeme işlemini Iyzico üzerinden gerçekleştirir
- **POST /api/payment/paymentCallback**: Ödeme işleminin sonucunu döndürür

  ### Admin

  - **POST /api/admin/add-product**: Ürün ekleme işlemi
  - **DELETE /api/admin/delete-product/:id**: Ürin silme işlemi
  - **PUT /api/admin/update-product/:id**: Ürün güncelleme işlemi
 
  - **POST /api/admin/add-recommended-product/:id**: Ürünü önerilenlere ekler
  - **DELETE /api/admin/delete-recommended-product/:id**: Ürünü önerilenlerden çıkartır
 
  - **POST /api/admin/add-promotional-message**: Promosyon mesajı ekler
  - **DELETE /api/admin/delete-promotional-message/:id**: Promosyon mesajı kaldırır
    
  - **POST /api/admin/add-banner**: Banner reklam ekler
  - **DELETE /api/admin/delete-banner/:id**: Banner reklam kaldırır
 
  - **PUT /api/admin/update-campaign**: Kampanya başlatır
 
  - **GET /api/admin/dashboard**: Admin dasboard verilerini döndürür
    
  - **PUT /api/admin/deliver-order/:orderId**: Siparişi teslim durumuna alır
  - **PUT /api/admin/ship-order**: Siparişi kargoya verildi durumuna alır
