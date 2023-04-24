import jwtUtil from "../../util/jwtUtil.js";

export function jwtCheck(ws, next) {
  const token = ws.handshake.headers.jwttoken;

  if (!token) return ws.disconnect("No token supplied!");

  jwtUtil
    .verifyToken(token)
    .then((payload) => {
      if (payload.username) {
        ws.jwtPayload = payload;
        next();
      } else {
        ws.disconnect();
      }
    })
    .catch((error) => {
      console.log(error);
      ws.disconnect();
    });
}
