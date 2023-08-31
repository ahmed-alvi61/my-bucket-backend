const express = require('express');
var cors = require('cors');
const user_routes = require('../server/routes/userRoutes')
const connectionPromise = require('./config/dbclient');

const app = express();
app.use(express.json());
app.use(cors());

//Database Connection
connectionPromise.then(() => {
  console.log('Connected to MongoDB');
})
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use('/api', user_routes)

app.listen(3009, () => console.log('Port is listening '));