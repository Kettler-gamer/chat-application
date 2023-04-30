import Channel from "../db/models/Channel.js";
import User from "../db/models/User.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

function addChannel(users, name) {
  const data = { users, messageIds: [] };
  if (name) {
    data.name = name;
  }
  return Channel.create(data);
}

function getChannel(channelId, username) {
  return Channel.findOne({ _id: channelId, users: { $in: username } });
}

async function addUsersToChannel(channelId, users, username) {
  const channel = await getChannel(channelId, username);

  if (!channel) return { result: { modifiedCount: 0 } };

  users.forEach((user) => {
    if (channel.users.includes(user)) return { result: { modifiedCount: 0 } };
  });

  await User.updateMany(
    { username: { $in: users } },
    { $push: { channelIds: channel._id } }
  );

  return {
    result: await Channel.updateOne(
      { _id: channel._id },
      { $push: { users: { $each: users } } }
    ),
    channel,
  };
}

async function removeUserFromChannel(username, channelId) {
  const userResult = await User.updateOne(
    { username },
    { $pull: { channelIds: new ObjectId(channelId) } }
  );
  const channelResult = await Channel.updateOne(
    { _id: channelId },
    { $pull: { users: username } }
  );
  return { channelResult, userResult };
}

export default {
  addChannel,
  getChannel,
  addUsersToChannel,
  removeUserFromChannel,
};
