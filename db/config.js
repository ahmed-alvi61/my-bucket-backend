const mongoose = require('mongoose');

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
};

const connectionPromise = mongoose.connect('mongodb+srv://ahmedalvi:6may1997@cluster0.tcwjsql.mongodb.net/signup', dbOptions)

module.exports = connectionPromise;