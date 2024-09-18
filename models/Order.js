const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    products:[ 
        {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "Product"
            },
            name: {
                type: String
            },
            price: {
                type: Number
            },
            image: {
                type: String
            },
            status: {
                type: String,
                enum: ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi", "İptal Edildi"],
                default: "Hazırlanıyor"
            },
            cancellationDate: {
                type: Date,
                required: function() {
                    return this.status === "İptal Edildi";
                }
            }

        }
    ],
    status: {
        type: String,
        enum: ["Sipariş Alındı", "Sipariş Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"],
        default: 'Sipariş Alındı'
    },
    cargo: {
        shippingCompany: {
            type: String
        },
        trackingNumber: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Ad", OrderSchema);
