import jwt from "jsonwebtoken";

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {});
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default { createToken, verifyToken };
