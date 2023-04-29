import Channel from "../db/models/Channel.js";

function addChannel(users) {
  return Channel.create({ users, messageIds: [] });
}

function getChannel(channelId, username) {
  return Channel.findOne({ _id: channelId, users: { $in: username } });
}

export default { addChannel, getChannel };
