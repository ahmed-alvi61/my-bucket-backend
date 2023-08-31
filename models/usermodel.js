const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  resetToken: String,
  resetTokenExpiration: Date 
}, { versionKey: false });

const userModel = mongoose.model("datas", signupSchema);

module.exports = userModel;