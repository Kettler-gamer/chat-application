import { sockets } from "../ioHandler.js";

export function onNewRequest(request, contactName) {
  sockets[contactName]?.emit("request", request);
}
