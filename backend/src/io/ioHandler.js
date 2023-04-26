export const sockets = {};

export function onSocketConnection(ws) {
  const oldConnection = sockets[ws.jwtPayload.username];

  if (oldConnection) {
    console.log("Old connection!");
    sockets.splice(sockets.indexOf(oldConnection), 1);
    console.log("Disconnect, current sockets:", Object.keys(sockets).length);
  }

  ws.on("disconnect", () => onDisconnect(ws));

  sockets[ws.jwtPayload.username] = ws;
  console.log("Connect, current sockets:", Object.keys(sockets).length);
}

export function onDisconnect(ws) {
  if (sockets[ws.jwtPayload.username] === ws) {
    delete sockets[ws.jwtPayload.username];
    console.log("Disconnect, current sockets:", Object.keys(sockets).length);
  }
}
