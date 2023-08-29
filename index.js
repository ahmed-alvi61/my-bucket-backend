const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt')

const Jwt = require("jsonwebtoken");
const jwtKey = "signup";
const nodeMailer = require('nodemailer')
const randomString = require('randomstring')

const connectionPromise = require('../server/db/config');
const { updatemodel } = require('../server/db/users');
const { productmodel } = require('../server/db/product');

const app = express();


connectionPromise.then(() => {
  console.log('Connected to MongoDB');
})
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });


app.use(express.json());
app.use(cors());


//Sign up APi 
app.post('/register', async (req, res) => {
  try {
    const newData = req.body;
    let result = await updatemodel.create(newData);
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        res.send({ result: "Something went wrong " });
      }
      result.success = true;
      res.send({ result, auth: token });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


//Login ApI
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ result: 'Email and password are required.', success: false });
  }
  try {
    const user = await updatemodel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ result: 'No User Found', success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ result: 'Invalid password', success: false });
    }
    const token = Jwt.sign({ user }, jwtKey, { expiresIn: '2h' });
    res.json({ user: { ...user.toObject(), password: undefined }, auth: token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'Something went wrong', success: false });
  }
});


//Add Product
app.post('/add-product', VerifyToken, async (req, res) => {
  const productData = req.body;
  let result1 = await productmodel.create(productData);
  res.send(result1);
})


//Delete Product
app.delete('/delete_product/:id', async (req, res) => {
  const result = await productmodel.deleteOne({ _id: req.params.id })
  res.send(result);
})


//Product Update
app.put('/product-update/:id', async (req, res) => {
  const result = await productmodel.updateOne({ _id: req.params.id }, {
    $set: req.body
  })
  res.send(result)
})


//Get all the Users That sign up
app.get('/get', async (req, res) => {
  try {
    const datas = await updatemodel.find({});
    res.json(datas);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


// Get Single Product By ID
app.get('/getId/:id', async (req, res) => {
  try {
    const data = await productmodel.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Get Products By 3 ID
app.get('/getIds/:id1/:id2/:id3', async (req, res) => {
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
});


//Forget Password
app.post('/forget-password', async (req, res) => {
  try {
    const user = await updatemodel.findOne({ email:req.body.email });
    if (user) {
      return res.status(404).json({ result: 'No User Found', success: false });
    }else{
      res.status(200).send({success:true,msg:"The Email does not exist"})
    }
  } catch (error) {
    res.status(400).send({success:false,msg:error.message})
  }
})


//All Product list
app.get('/product-list', async (req, res) => {
  try {
    const datas = await productmodel.find({});
    if (datas.length > 0) {
      res.json(datas);
    } else {
      res.send("Data not found")
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Verify Token
function VerifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send("Please add the token to the header");
  }
  // Check if the token starts with "Bearer "
  if (token.startsWith("bearer ")) {
    token = token.split(' ')[1];
  }
  Jwt.verify(token, jwtKey, (err, valid) => {
    if (err) {
      return res.status(401).send("Please provide a valid token");
    } else {
      next();
    }
  });
}


app.listen(3009, () => console.log('Port is listening '));