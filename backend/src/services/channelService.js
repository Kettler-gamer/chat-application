import Channel from "../db/models/Channel.js";

function addChannel(users) {
  return Channel.create({ users, messageIds: [] });
}

function getChannel(channelId) {
  return Channel.findOne({ _id: channelId });
}

export default { addChannel, getChannel };
