import User from "../db/models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

async function getUser(username, extraProjection = []) {
  const projection = [
    "username",
    "contactIds",
    "messageIds",
    "profilePicture",
    "requests",
    "blocked",
  ];
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

async function addRequest(username, contactName) {
  const user = await User.findOne({ username });
  return User.updateOne(
    { username: contactName },
    { $push: { requests: user._id } }
  );
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

async function updateUserPassword(username, newPassword) {
  const newPasswordHash = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );
  return User.updateOne(
    { username },
    {
      password: newPasswordHash,
    }
  );
}

async function removeContact(username, contactId) {
  return User.updateOne(
    { username },
    { $pull: { contactIds: new ObjectId(contactId) } }
  );
}

async function removeRequest(username, contactId) {
  return User.updateOne(
    { username },
    { $pull: { requests: new ObjectId(contactId) } }
  );
}

export default {
  getUser,
  getUsersFromIdList,
  addContact,
  addRequest,
  getContactInfo,
  updateProfilePicture,
  updateUsersChannelIds,
  updateUserPassword,
  removeContact,
  removeRequest,
};
