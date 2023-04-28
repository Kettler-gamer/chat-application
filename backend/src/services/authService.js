import User from "../db/models/User.js";
import bcrypt from "bcrypt";

async function addUser(user) {
  user.contactIds = [];
  user.messageIds = [];
  user.channelIds = [];
  user.password = await bcrypt.hash(
    user.password,
    Number(process.env.SALT_ROUNDS)
  );
  return User.insertMany([user]);
}

async function comparePassword(username, password) {
  const user = await User.findOne({ username });

  if (!user) return false;

  return bcrypt.compare(password, user.password);
}

export default { addUser, comparePassword };
