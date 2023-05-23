import { isValidObjectId } from "mongoose";
import channelService from "../services/channelService.js";

function postFilter(req, res, next) {
  const { content, contactName, channelId } = req.body;

  if (!content || (!contactName && !channelId))
    return res.status(400).send("Not enough info!");

  if (contactName && channelId)
    return res.status(400).send("You must provide contactName OR channelId");

  if (!contactName && !isValidObjectId(channelId))
    return res.status(400).send("The object ID provided is invalid!");

  next();
}

async function getFilter(req, res, next) {
  const { username } = req.jwtPayload;
  const { contactName, channelId } = req.query;

  if (!contactName && !channelId)
    return res.status(400).send("You must provide contactName or channelId!");

  if (channelId && !isValidObjectId(channelId))
    return res.status(400).send("Invalid channel id!");

  if (channelId) {
    const channel = await channelService.getChannel(channelId, username);
    if (!channel) {
      return res.status(404).send("Channel not found!");
    }
  }

  next();
}

export default { getFilter, postFilter };
