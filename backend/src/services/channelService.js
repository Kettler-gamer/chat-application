import Channel from "../db/models/Channel.js";

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

export default { addChannel, getChannel };
