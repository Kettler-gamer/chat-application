import Message from "../db/models/Message.js";
import User from "../db/models/User.js";

async function getMessagesFromList(list, contactName) {
  return Message.find({
    _id: { $in: list },
    $or: [{ author: contactName }, { reciever: contactName }],
  })
    .sort({ _id: -1 })
    .limit(10);
}

async function addMessage(message) {
  const time = new Date();
  message.date = time.toLocaleDateString();
  message.time = time.toTimeString().slice(0, 5);
  const newMessage = await Message.create(message);
  const result = await User.updateMany(
    { username: [message.author, message.reciever] },
    { $push: { messageIds: newMessage._id } }
  );
  return { result, newMessage };
}

export default { getMessagesFromList, addMessage };
