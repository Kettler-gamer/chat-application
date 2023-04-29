import { isValidObjectId } from "mongoose";
import channelService from "../services/channelService.js";
import userService from "../services/userService.js";

function createChannel(req, res) {
  const { username } = req.jwtPayload;
  const { users } = req.body;

  if (!users || !Array.isArray(users) || users.length === 0)
    return res.status.send("You must provide a list of users!");

  users.push(username);

  channelService
    .addChannel(users)
    .then((channel) => {
      return userService
        .updateUsersChannelIds(channel.users, channel._id)
        .then((result) => {
          if (result.modifiedCount > 0) {
            res.status(201).send("The channel was created!");
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

export default { createChannel, getChannel };
