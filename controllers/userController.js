const userModel = require('../models/usermodel')
const Jwt = require("jsonwebtoken");
const productModel = require('../models/productmodel')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

//Generate 6 digit Numeric
function generateResetToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//Function to send reset email
async function sendResetEmail(email, resetLink) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'bilalmirza79500@gmail.com',
                pass: 'wjsgtpljfrlgwyui'
            }
        });
        const mailOptions = {
            from: 'ahmed.alvi9921@outlook.com',
            to: email,
            subject: 'Password Reset',
            text: `Verify Your OTP: ${resetLink}`
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('An error occurred while sending the reset email.');
    }
}

//Function to Password Bash 
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

//Register User
const register_user = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, msg: "Missing required data." });
        }
        const spassWord = await securePassword(password);
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: spassWord,
        });

        const userData = await userModel.findOne({ email });
        if (userData) {
            return res.status(400).json({ success: false, msg: "This email is already registered" });
        }
        const user_data = await user.save();
        Jwt.sign({ result }, config, { expiresIn: "2h" }, (err, token) => {
            if (err) {
              res.send({ result: "Something went wrong " });
            }
            result.success = true;
            res.send({ result, auth: token });
          })
        return res.status(201).json({ success: true, data: user_data });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: "An error occurred while registering the user." });
    }
};

//Login User
const login_user = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ result: 'Email and password are required.', success: false });
    }
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ result: 'No User Found', success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ result: 'Invalid password', success: false });
        }
        const token = Jwt.sign({ user }, jwtKey, { expiresIn: '2h' });
        res.json({ user: { ...user.toObject(), password: undefined }, auth: token, success: true });
        res.send(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'Something went wrong', success: false });
    }
}

//Add Product
const add_product = async (req, res) => {
    const productData = req.body;
    let result1 = await productModel.create(productData);
    res.send(result1);
}

//Delete Product
const delete_product = async (req, res) => {
    const result = await productModel.deleteOne({ _id: req.params.id })
    res.send(result);
}

//Product List
const product_list = async (req, res) => {
    try {
        const datas = await productModel.find({});
        if (datas.length > 0) {
            res.json(datas);
        } else {
            res.send("Data not found")
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
}

//Get Product By Id
const get_product_by_id = async (req, res) => {
    try {
        const data = await productModel.findOne({ _id: req.params.id });
        if (!data) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
}

//Get Products By 3 ID
const get_product_by_3_ids = async (req, res) => {
    try {
        const ids = [req.params.id1, req.params.id2, req.params.id3];
        const promises = ids.map(id => productmodel.findOne({ _id: id }));
        const data = await Promise.all(promises);
        if (promises.every(item => item !== null)) {
            res.json(promises);
        } else {
            res.status(404).json({ error: 'One or more products not found' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};

//Get all the Users That sign up
const all_users = async (req, res) => {
    try {
        const datas = await userModel.find({});
        res.json(datas);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};

//Update Product
const update_product = async (req, res) => {
    const result = await productModel.updateOne({ _id: req.params.id }, {
        $set: req.body
    })
    res.send(result)
}

//Reset Password
const reset_password = async (req, res) => {
    const email = req.body.email;
    const resetToken = generateResetToken();
    const tokenExpiration = new Date(Date.now() + 3600000); // Set token expiration (e.g., 1 hour from now)
    try {
        const updatedUser = await userModel.findOneAndUpdate(
            { email: email },
            { resetToken: resetToken, resetTokenExpiration: tokenExpiration }
        );
        const resetLink = resetToken;
        await sendResetEmail(email, resetLink);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error('Error updating reset token:', error);
        res.status(500).json({ error: 'An error occurred while updating the reset token.' });
    }
};

//Verification of the OTP
const verify_otp = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (user.resetToken === otp && user.resetTokenExpiration > Date.now()) {
            const spassWord = await securePassword(newPassword);
            user.password = spassWord;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();
            return res.status(200).json({ message: 'Password reset successful.' });
        } else {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }
    } catch (error) {
        console.error('Error verifying OTP and updating password:', error);
        res.status(500).json({ error: 'An error occurred while verifying OTP and updating password.' });
    }
};


module.exports = {
    register_user,
    login_user,
    add_product,
    delete_product,
    product_list,
    get_product_by_id,
    all_users,
    update_product,
    reset_password,
    verify_otp,
    get_product_by_3_ids
}