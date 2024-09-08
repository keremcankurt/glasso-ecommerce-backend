const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: {
    type: String,
    required: true
  }
});

const ImageSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String
  }
});

const AdSchema = new Schema({
  messages: [MessageSchema],
  images: [ImageSchema]  
});

module.exports = mongoose.model("Ad", AdSchema);
