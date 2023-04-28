import Message from "../db/models/Message.js";
import User from "../db/models/User.js";
import Channel from "../db/models/Channel.js";

async function getMessagesFromList(list, contactName) {
  return Message.find({
    _id: { $in: list },
    $or: [{ author: contactName }, { reciever: contactName }],
  })
    .sort({ _id: -1 })
    .limit(10);
}

async function getMessagesFromChannel(channelId) {
  return Message.find({
    reciever: channelId,
  })
    .sort({ _id: -1 })
    .limit(10);
}

async function addMessage(message, channel) {
  const time = new Date();
  message.date = time.toLocaleDateString();
  message.time = time.toTimeString().slice(0, 5);
  const newMessage = await Message.create(message);
  const result = !channel
    ? await updateContactChat(message, newMessage)
    : await updateChannelChat(channel, newMessage);
  return { result, newMessage };
}

async function updateContactChat(message, newMessage) {
  return User.updateMany(
    { username: [message.author, message.reciever] },
    { $push: { messageIds: newMessage._id } }
  );
}

async function updateChannelChat(channel, newMessage) {
  return Channel.updateOne(
    {
      _id: channel._id,
    },
    { $push: { messageIds: newMessage._id } }
  );
}

export default { getMessagesFromList, addMessage, getMessagesFromChannel };
