import mongoose from "../db.js";

const Channel = mongoose.model("Channel", {
  users: { type: Array, required: true },
  messageIds: { type: Array, required: true },
  name: { type: String, required: false },
});

export default Channel;
