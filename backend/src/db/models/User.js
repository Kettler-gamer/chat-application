import mongoose from "../db.js";

const User = mongoose.model("User", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactIds: { type: Array, required: true },
  messageIds: { type: Array, required: true },
  channelIds: { type: Array, required: true },
  profilePicture: { type: String, required: false },
  requests: { type: Array, required: false },
  blocked: { type: Array, required: false },
});

export default User;
