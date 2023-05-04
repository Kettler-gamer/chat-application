import { info } from "../pages/MainPage";
import { io } from "socket.io-client";

export function setUpSocketConnection(setProfile) {
  const newSocket = io("/", {
    pingInterval: 25000,
    extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
  });
  newSocket.on("connect", () => {
    info.socket = newSocket;
    newSocket.emit("online", {
      username: info.username,
      contacts: info.contacts.map((user) => user.username),
    });
  });
  newSocket.on("connection_error", () => {
    console.log("WS Connection error!");
  });
  newSocket.on("userOnline", (data) => {
    console.log("userOnline: " + data.username + " is " + data.online);
    setProfile((oldValue) => {
      const newValue = JSON.parse(JSON.stringify(oldValue));

      newValue.contacts.find(
        (element) => element.username === data.username
      ).online = data.online;

      return newValue;
    });
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
  newSocket.on("online", (data) => {
    console.log(data);
  });
  info.socket = newSocket;
  window.socket = newSocket;
}
