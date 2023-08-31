const jwt = require('jsonwebtoken');
const config = require('../config/config')

const generateJwtToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, config, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
module.exports = generateJwtToken;