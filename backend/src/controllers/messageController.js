import userService from "../services/userService.js";
import messageService from "../services/messageService.js";
import { onNewMessage } from "../io/events/message.js";
import channelService from "../services/channelService.js";
import { isValidObjectId } from "mongoose";

async function getMessages(req, res) {
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

  userService
    .getUser(username)
    .then((user) => {
      return contactName
        ? messageService.getMessagesFromList(user.messageIds, contactName)
        : messageService.getMessagesFromChannel(channelId);
    })
    .then((list) => {
      res.send(list.reverse());
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Something went wrong!");
    });
}

function postMessage(req, res) {
  const { username } = req.jwtPayload;
  const { content, contactName, attachement, channelId } = req.body;

  if (!content || (!contactName && !channelId))
    return res.status(400).send("Not enough info!");

  if (contactName && channelId)
    return res.status(400).send("You must provide contactName OR channelId");

  if (!contactName && !isValidObjectId(channelId))
    return res.status(400).send("The object ID provided is invalid!");

  (contactName
    ? userService.getUser(contactName)
    : channelService.getChannel(channelId, username)
  )
    .then((contact) => {
      if (contact) {
        const info = {
          author: username,
          reciever: contactName || channelId,
          content,
          attachement,
        };
        return messageService.addMessage(info, contact);
      } else {
        res.status(404).send("Contact/Channel does not exist!");
      }
    })
    .then((data) => {
      if (data.result.modifiedCount > 0) {
        res.status(201).send("Message was sent!");
        onNewMessage(data.newMessage, data.users, data.channelId.toString());
      } else {
        console.log(data.result);
        res.status(500).send("Something went wrong!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error!");
    });
}

export default { getMessages, postMessage };
