import info from "../scripts/userinfo";
import { io } from "socket.io-client";

export function setUpSocketConnection(setProfile, setNotices) {
  const newSocket = io("/", {
    pingInterval: 25000,
    extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
  });
  newSocket.on("connect", () => onConnect(newSocket));

  newSocket.on("userOnline", (data) => onUserOnline(data, setProfile));

  newSocket.on("newChannel", (channel) => onNewChannel(channel, setProfile));

  newSocket.on("newMessage", (data) => onNewMessage(data, setNotices));

  info.socket = newSocket;
  window.socket = newSocket;
}

function onNewMessage(data, setNotices) {
  if (info.currentChat === data.author || info.currentChat === data.reciever)
    return;
  const newNotice = { type: "message", data };
  setNotices((oldValue) => [...oldValue, newNotice]);
  setTimeout(() => {
    setNotices((oldValue) => oldValue.filter((notice) => notice !== newNotice));
  }, 5000);
}

function onConnect(newSocket) {
  info.socket = newSocket;
  newSocket.emit("online", {
    username: info.username,
    contacts: info.contacts.map((user) => user.username),
  });
}

function onUserOnline(data, setProfile) {
  setProfile((oldValue) => {
    const newValue = JSON.parse(JSON.stringify(oldValue));

    const contact = newValue.contacts.find(
      (element) => element.username === data.username
    );

    if (contact) contact.online = data.online;

    return newValue;
  });
}

function onNewChannel(channel, setProfile) {
  setProfile((oldValue) => {
    const newVal = JSON.parse(JSON.stringify(oldValue));

    newVal.channelIds = [...newVal.channelIds, channel._id];

    return newVal;
  });
}

export function onNewUsers(data, setChannels) {
  setChannels((oldValue) => {
    const newValue = JSON.parse(JSON.stringify(oldValue));

    newValue
      .find((channel) => channel._id === data.channelId)
      .users.push(...data.users);

    return newValue;
  });
}

export function onLeftChannel(
  data,
  setChannels,
  setSelectedChannel,
  setProfile
) {
  setChannels((oldValue) => {
    if (info.username === data.username) {
      return oldValue.filter((channel) => channel._id !== data.channelId);
    } else {
      const newValue = JSON.parse(JSON.stringify(oldValue));
      const users = newValue.find(
        (channel) => channel._id === data.channelId
      ).users;

      users.splice(users.indexOf(data.username), 1);

      return newValue;
    }
  });
  if (data.username === info.username) {
    setSelectedChannel(undefined);
    setProfile((oldValue) => {
      const newValue = JSON.parse(JSON.stringify(oldValue));

      const channelIds = newValue.channelIds;

      const index = channelIds.indexOf(data.channelId);

      channelIds.splice(index, 1);

      return newValue;
    });
  }
}
