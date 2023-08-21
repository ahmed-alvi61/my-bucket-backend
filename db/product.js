const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: String,
    category: String,
    price: String,
    userId: String,
  },{ versionKey: false });
  
const productmodel = mongoose.model("products", productSchema);

module.exports = {
    productmodel,
};