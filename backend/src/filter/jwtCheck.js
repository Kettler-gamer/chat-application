import jwtUtil from "../util/jwtUtil.js";

function checkToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(400).send("JWT token is required!");

  jwtUtil
    .verifyToken(token.replace("Bearer ", ""))
    .then((payload) => {
      if (payload.username) {
        req.jwtPayload = payload;
        next();
      } else {
        res.status(401).send("Not authorized!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send("Invalid token!");
    });
}

export default checkToken;
