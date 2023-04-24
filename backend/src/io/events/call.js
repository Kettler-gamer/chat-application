import { sockets } from "../ioHandler.js";

const callRooms = [];

export function onCall(ws, contact) {
  const foundContact = sockets.find(
    (user) => user.jwtPayload.username === contact
  );

  if (!foundContact) {
    ws.emit("serverMessage", "User not online!");
  } else {
    foundContact.emit("call", ws.jwtPayload.username);
    callRooms.push({ caller: ws, recipient: contact });
    console.log("Callrooms: ", callRooms.length);
  }
}

export function onAnswer(ws, answer) {
  console.log(answer);
  console.log(ws.jwtPayload.username);
  if (answer) {
    const room = callRooms.find(
      (room) => room.recipient == ws.jwtPayload.username
    );
    room.recipient = ws;
    room.caller.emit("startCall", ws.jwtPayload.username);
    room.recipient.emit("startCall", room.caller.jwtPayload.username);
  } else {
    callRooms.splice(
      callRooms.indexOf(
        callRooms.find((room) => room.recipient === ws.jwtPayload.username)
      )
    );
    console.log("Callrooms: ", callRooms.length);
  }
}

export function onVoice(ws, voiceData) {
  const room = callRooms.find(
    (room) => room.caller == ws || room.recipient == ws
  );
  if (room) {
    if (room.caller == ws) {
      room.recipient.emit("voice", voiceData);
    } else {
      room.caller.emit("voice", voiceData);
    }
  }
}
