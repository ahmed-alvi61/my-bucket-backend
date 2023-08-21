const express = require('express');
var cors = require('cors');

const connectionPromise = require('../server/db/config')
const { updatemodel } = require('../server/db/users');
const {productmodel} = require('../server/db/product')

const app = express();


connectionPromise.then(() => {
  console.log('Connected to MongoDB');
})
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });


app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  try {
    const newData = req.body;
    let result = await updatemodel.create(newData);
    result = result.toObject();
    delete result.password;
    res.status(201).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/login', async (req, res) => {
   if (req.body.password && req.body.email) {
    let user = await updatemodel.findOne(req.body).select("-password");
    if (user) {
      user.success= true;
      res.send(user)
    } else {
      res.send({ result: 'No User Found',success:false  })
    }
  } else {
    res.send({ result: 'No User Found',success:false })

  }

})

// app.post('/add-product',async (req,res)=>{
//   const productData = req.body;
//   let result1 = await productmodel.create(productData);
//   res.send(result1);
// })

app.post('/add-product', async (req, res) => {
  const productData = req.body;
  // Assuming you have a user ID stored in the user's authentication session
  const userId = req.session.userId; // Replace this with the actual way to access the user's ID
  // Add the user ID to the product data
  productData.userId = userId;

  try {
    const result = await productmodel.create(productData);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding product');
  }
});

app.delete('/delete_product/:id',async (req,res)=>{
  const result = await productmodel.deleteOne({_id:req.params.id})
  res.send(result);
})

app.put('/product-update/:id', async (req,res)=>{
  const result = await productmodel.updateOne({_id:req.params.id},{
    $set : req.body
  })
  res.send(result)
})

app.get('/get', async (req, res) => {
  try {
    const datas = await updatemodel.find({});
    res.json(datas);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});
app.get('/product-list', async (req, res) => {
  try {
    const datas = await productmodel.find({});
    if(datas.length>0)
    {
      res.json(datas);
    }else {
      res.send("Data not found")
    } 
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(3009, () => console.log('Port is listening '));