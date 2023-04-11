const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    if (decoded.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    req.username = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }
}

module.exports = authenticate