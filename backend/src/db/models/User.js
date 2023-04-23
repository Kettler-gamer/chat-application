import mongoose from "../db.js";

const User = mongoose.model("User", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactIds: { type: Array, required: true },
  messageIds: { type: Array, required: true },
});

export default User;
