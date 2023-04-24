import { onCall, onAnswer, onVoice } from "./events/call.js";

export const sockets = [];

export function onSocketConnection(ws) {
  const oldConnection = sockets.find(
    (socket) => socket.jwtPayload.username == ws.jwtPayload.username
  );

  if (oldConnection) {
    console.log("Old connection!");
    sockets.splice(sockets.indexOf(oldConnection), 1);
    console.log("Disconnect, current sockets:", sockets.length);
  }

  ws.on("call", (contact) => onCall(ws, contact));

  ws.on("answer", (answer) => onAnswer(ws, answer));

  ws.on("voice", (voiceData) => onVoice(ws, voiceData));

  ws.on("disconnect", () => onDisconnect(ws));

  sockets.push(ws);
  console.log("Connect, current sockets:", sockets.length);
}

export function onDisconnect(ws) {
  const index = sockets.indexOf(ws);
  if (index == -1) return;
  sockets.splice(sockets.indexOf(ws), 1);
  console.log("Disconnect, current sockets:", sockets.length);
}
