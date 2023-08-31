const express = require('express');
var cors = require('cors');
const user_routes = require('../backend/routes/userRoutes')
const connectionPromise = require('./config/dbclient');
const port = process.env.PORT;

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

app.listen(port, () => console.log('Port is listening '));