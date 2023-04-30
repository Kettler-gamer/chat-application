import { isValidObjectId } from "mongoose";
import channelService from "../services/channelService.js";
import userService from "../services/userService.js";
import {
  onNewChannel,
  onUserLeftChannel,
  usersAddedToChannel,
} from "../io/events/channel.js";

function createChannel(req, res) {
  const { username } = req.jwtPayload;
  const { users, name } = req.body;

  if (!users || !Array.isArray(users) || users.length === 0)
    return res.status(400).send("You must provide a list of users!");

  users.push(username);

  channelService
    .addChannel(users, name)
    .then((channel) => {
      return userService
        .updateUsersChannelIds(channel.users, channel._id)
        .then((result) => {
          if (result.modifiedCount > 0) {
            res.status(201).send("The channel was created!");
            onNewChannel(channel);
          } else {
            res.status(500).send("Something went wrong!");
          }
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error!");
    });
}

function getChannel(req, res) {
  const { channelId } = req.query;
  const { username } = req.jwtPayload;

  if (!channelId || !isValidObjectId(channelId))
    return res.status(400).send("Invalid channelId!");

  channelService
    .getChannel(channelId, username)
    .then((channel) => {
      if (channel) {
        res.send({ name: channel.name, users: channel.users });
      } else {
        res.status(404).send("Channel not found!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error");
    });
}

function addUsersToChannel(req, res) {
  const { username } = req.jwtPayload;
  const { channelId, users } = req.body;

  if (!channelId || !users) return res.status(400).send("Bad request!");

  if (!isValidObjectId(channelId))
    return res.status(400).send("Invalid channelId!");

  channelService.addUsersToChannel(channelId, users, username).then((data) => {
    if (data.result.modifiedCount > 0) {
      res.send("The user/s was/were added!");
      usersAddedToChannel(data.channel, users);
    } else {
      res.status(500).send("Something went wrong!");
    }
  });
}

function leaveChannel(req, res) {
  const { username } = req.jwtPayload;
  const { channelId } = req.query;

  if (!channelId || !isValidObjectId(channelId))
    return res.status(400).send("ChannelId malformed or not provided!");

  channelService
    .removeUserFromChannel(username, channelId)
    .then((data) => {
      if (
        data.channelResult.modifiedCount > 0 &&
        data.userResult.modifiedCount > 0
      ) {
        res.status(200).send("You left the channel!");
        onUserLeftChannel(channelId, username);
      } else {
        res.status(500).send("Something went wrong!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Something went wrong!");
    });
}

export default { createChannel, getChannel, addUsersToChannel, leaveChannel };
