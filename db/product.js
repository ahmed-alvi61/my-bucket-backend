const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: String,
    category: Array,
    price: String,
    userId: String,
  },{ versionKey: false });
  
const productmodel = mongoose.model("products", productSchema);

module.exports = {
    productmodel,
};




// app.post('/add-product', async (req, res) => {
//   const productData = req.body;
//   // Assuming you have a user ID stored in the user's authentication session
//   const userId = req.session.userId; // Replace this with the actual way to access the user's ID
//   // Add the user ID to the product data
//   productData.userId = userId;

//   try {
//     const result = await productmodel.create(productData);
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error adding product');
//   }
// });