import mongoose from "../db.js";

const Message = mongoose.model("Message", {
  author: { type: String, required: true },
  reciever: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

export default Message;
