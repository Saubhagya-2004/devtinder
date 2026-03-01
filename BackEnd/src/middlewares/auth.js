const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // Support both cookie-based (web) and Bearer token (React Native mobile)
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).send('Unauthorized Access: Token not found');
    }

    // Validate token
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized access, please login: ' + err.message);
  }
};

module.exports = { userAuth };
