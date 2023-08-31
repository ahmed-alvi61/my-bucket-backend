const express = require('express');
const user_routes = express();
const user_controller = require('../controllers/userController')

user_routes.post('/register',user_controller.register_user)
user_routes.post('/login',user_controller.login_user)
user_routes.post('/add-product',user_controller.add_product)
user_routes.delete('/delete-product/:id',user_controller.delete_product)
user_routes.get('/product-list',user_controller.product_list)
user_routes.get('/product-list-id/:id',user_controller.get_product_by_id)
user_routes.get('/users',user_controller.all_users)
user_routes.put('/update-product/:id',user_controller.update_product)
user_routes.post('/reset-password',user_controller.reset_password)
user_routes.post('/verify-otp',user_controller.verify_otp)
user_routes.get('/get-Ids/:id1/:id2/:id3',user_controller.get_product_by_3_ids)

module.exports = user_routes;