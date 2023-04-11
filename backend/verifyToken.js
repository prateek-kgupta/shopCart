const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }
  const secret = process.env.SECRET_KEY;
  jwt.verify(token, secret, (err, decoded) => {
    console.log(decoded);
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    req.email = decoded.email;
    next();
  });
}

module.exports = authenticate