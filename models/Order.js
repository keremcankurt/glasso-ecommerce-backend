const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
},{_id: false});

const AddressSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    addressDesc: {
        type: String,
        required: true
    }
},{_id: false});

const CargoSchema = new Schema({
    shippingCompany: {
        type: String,
    },
    trackingNumber: {
        type: String,
    }
},{_id: false});

const OrderSchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    products: [ProductSchema],
    status: {
        type: String,
        enum: ["Ödeme Beklemede", "Ödeme Başarısız", "Sipariş Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"],
        default: "Ödeme Beklemede"
    },
    cargo: CargoSchema,
    address: AddressSchema,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", OrderSchema);
