import userService from "../services/userService.js";

export const sockets = {};

export function onSocketConnection(ws) {
  const oldConnection = sockets[ws.jwtPayload.username];

  if (oldConnection) {
    console.log("Old connection!");
    delete sockets[ws.jwtPayload.username];
    console.log("Disconnect, current sockets:", Object.keys(sockets).length);
  }

  ws.on("online", (value) => {
    console.log(value);
    value.contacts.forEach((contact) => {
      if (sockets[contact]) {
        sockets[contact].emit("userOnline", {
          username: value.username,
          online: true,
        });
        sockets[value.username].emit("userOnline", {
          username: contact,
          online: true,
        });
      }
    });
  });

  ws.on("disconnect", () => onDisconnect(ws));

  ws.on("channelSet", (channelId) => {
    ws.channelSet = channelId;
  });

  sockets[ws.jwtPayload.username] = ws;
  console.log("Connect, current sockets:", Object.keys(sockets).length);
}

export function onDisconnect(ws) {
  if (sockets[ws.jwtPayload.username] === ws) {
    console.log("Trying offline update");
    userService
      .getUser(ws.jwtPayload.username)
      .then((user) => {
        if (user) {
          return userService.getUsersFromIdList(user.contactIds);
        } else {
          throw new Error("Could not find user for socket status update");
        }
      })
      .then((contacts) => {
        if (contacts) {
          contacts.forEach((user) => {
            sockets[user.username]?.emit("userOnline", {
              username: ws.jwtPayload.username,
              online: false,
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    delete sockets[ws.jwtPayload.username];
    console.log("Disconnect, current sockets:", Object.keys(sockets).length);
  }
}
