const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in backend/.env');
  }
  return secret;
}

function getExpiresIn() {
  return process.env.JWT_EXPIRE || '1h';
}

function generateToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: getExpiresIn(),
  });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};