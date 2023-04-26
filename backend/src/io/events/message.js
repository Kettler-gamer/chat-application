import { sockets } from "../ioHandler.js";

export function onNewMessage(message) {
  const author = sockets[message.author];
  if (author) {
    author.emit("newMessage", message);
  }
  const reciever = sockets[message.reciever];
  if (reciever) {
    reciever.emit("newMessage", message);
  }
}
