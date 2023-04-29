import { info } from "../pages/MainPage";
import { io } from "socket.io-client";

export function setUpSocketConnection(setProfile) {
  const newSocket = io("/", {
    pingInterval: 25000,
    extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
  });
  newSocket.on("connect", () => {
    info.socket = newSocket;
  });
  newSocket.on("connection_error", () => {
    console.log("WS Connection error!");
  });
  newSocket.on("disconnect", () => {
    console.log("WS disconnect");
  });
  newSocket.on("serverMessage", (message) => {
    console.log(message);
  });
  newSocket.on("newChannel", (channel) => {
    setProfile((oldValue) => {
      const newVal = JSON.parse(JSON.stringify(oldValue));

      newVal.channelIds = [...newVal.channelIds, channel._id];

      return newVal;
    });
  });
  info.socket = newSocket;
  window.socket = newSocket;
}
