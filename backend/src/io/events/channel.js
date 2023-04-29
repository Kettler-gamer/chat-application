import { sockets } from "../ioHandler.js";

export function onNewChannel(channel) {
  channel.users.forEach((user) => {
    if (sockets[user]) {
      sockets[user].emit("newChannel", channel);
    }
  });
}
