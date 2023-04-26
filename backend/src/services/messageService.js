import Message from "../db/models/Message.js";
import User from "../db/models/User.js";

async function getMessagesFromList(list) {
  return Message.find({ _id: { $in: list } });
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
  return result;
}

export default { getMessagesFromList, addMessage };
