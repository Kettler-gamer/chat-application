import { sockets } from "../ioHandler.js";
import { isValidObjectId } from "mongoose";

export function onNewMessage(message) {
  if (isValidObjectId(message.reciever)) {
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
