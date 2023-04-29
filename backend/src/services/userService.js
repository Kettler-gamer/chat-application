import User from "../db/models/User.js";

async function getUser(username, extraProjection = []) {
  const projection = ["username", "contactIds", "messageIds", "profilePicture"];
  if (extraProjection) {
    projection.push(...extraProjection);
  }
  return User.findOne({ username }, projection.join(" "));
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

async function updateUsersChannelIds(users, channelId) {
  return User.updateMany(
    { username: { $in: users } },
    { $push: { channelIds: channelId } }
  );
}

export default {
  getUser,
  getUsersFromIdList,
  addContact,
  getContactInfo,
  updateProfilePicture,
  updateUsersChannelIds,
};
