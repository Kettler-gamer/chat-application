import { sockets } from "../ioHandler.js";

export function onNewChannel(channel) {
  channel.users.forEach((user) => {
    if (sockets[user]) {
      sockets[user].emit("newChannel", channel);
    }
  });
}

export function usersAddedToChannel(channel, users) {
  users.forEach((user) => {
    if (sockets[user]) {
      sockets[user].emit("newChannel", channel);
    }
  });
  const oldUsers = channel.users.filter((user) => !users.includes(user));

  oldUsers.forEach((user) => {
    if (sockets[user]) {
      sockets[user].emit("newUsers", { users, channelId: channel._id });
    }
  });
}
