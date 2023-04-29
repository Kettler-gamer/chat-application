import { sockets } from "../ioHandler.js";
import { isValidObjectId } from "mongoose";

export function onNewMessage(message, users, channelId) {
  if (isValidObjectId(message.reciever)) {
    users.forEach((user) => {
      if (sockets[user] && sockets[user].channelSet === channelId) {
        sockets[user].emit("newMessage", message);
      }
    });
  } else {
    const author = sockets[message.author];
    if (author) {
      author.emit("newMessage", message);
    }
    const reciever = sockets[message.reciever];
    if (reciever) {
      reciever.emit("newMessage", message);
    }
  }
}
