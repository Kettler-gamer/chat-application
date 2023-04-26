import User from "../db/models/User.js";

async function getUser(username) {
  return User.findOne({ username }, "username contactIds messageIds");
}

async function getUsersFromIdList(list) {
  return User.find({ _id: { $in: list } }, "username profilePicture");
}

async function addContact(username, contactId) {
  return User.updateOne({ username }, { $addToSet: { contactIds: contactId } });
}

async function getContactInfo(username) {
  return User.findOne({ username }, "username profilePicture");
}

async function updateProfilePicture(username, profilePicture) {
  return User.updateOne({ username }, { profilePicture });
}

export default {
  getUser,
  getUsersFromIdList,
  addContact,
  getContactInfo,
  updateProfilePicture,
};
