import mongoose from "../db.js";

const User = mongoose.model("User", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default User;
