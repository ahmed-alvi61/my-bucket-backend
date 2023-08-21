const mongoose = require('mongoose');
const signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  },{ versionKey: false });
  
const updatemodel = mongoose.model("datas", signupSchema);

module.exports = {
    updatemodel,
};