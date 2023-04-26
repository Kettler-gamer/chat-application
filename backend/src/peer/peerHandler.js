import jwtUtil from "../util/jwtUtil.js";

export function setUpPeerEvents(peerServer) {
  peerServer.on("connection", onConnection);
  peerServer.on("disconnect", (peer) => {
    console.log(`${peer.id} Disconnect from peer`);
  });
}

function onConnection(peer) {
  console.log("Connection to peer...");

  jwtUtil
    .verifyToken(peer.token)
    .then((payload) => {
      if (!payload.username) {
        console.log("No username!");
      } else {
        console.log(`${peer.id} Connected to peer`);
      }
    })
    .catch((error) => {
      console.log(error);
      peer.socket.close(4001, "Invalid token");
    });
}
