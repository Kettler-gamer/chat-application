import User from "../db/models/User.js";

async function getUser(username) {
  return User.findOne({ username }, "username contactIds messageIds");
}

async function getUsersFromIdList(list) {
  return User.find({ _id: { $in: list } }, "username");
}

async function addContact(username, contactId) {
  return User.updateOne({ username }, { $addToSet: { contactIds: contactId } });
}

export default { getUser, getUsersFromIdList, addContact };
