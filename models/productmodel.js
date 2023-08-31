const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: String,
    category: Array,
    price: String,
    userId: String,
  },{ versionKey: false });
  
const productModel = mongoose.model("products", productSchema);

module.exports = productModel