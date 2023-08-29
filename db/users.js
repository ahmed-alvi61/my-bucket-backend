const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}, { versionKey: false });

signupSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (err) {
    next(err)
  }
})

signupSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error;
  }
}

const updatemodel = mongoose.model("datas", signupSchema);

module.exports = {
  updatemodel,
};