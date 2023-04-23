import User from "../db/models/User.js";

async function getUser(username) {
  return User.findOne({ username }, "username contactIds messageIds");
}

async function getUsersFromIdList(list) {
  return User.find({ _id: { $in: list } }, "username");
}

export default { getUser, getUsersFromIdList };
