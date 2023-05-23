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

  if (!user) return { match: false };

  const match = await bcrypt.compare(password, user.password);

  return { match, userId: user._id };
}

export default { addUser, comparePassword };
