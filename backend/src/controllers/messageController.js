import userService from "../services/userService.js";
import messageService from "../services/messageService.js";
import { onNewMessage } from "../io/events/message.js";
import channelService from "../services/channelService.js";
import { createError } from "../util/errorUtil.js";

async function getMessages(req, res) {
  const { username } = req.jwtPayload;
  const { contactName, channelId } = req.query;

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
  const { username, userId } = req.jwtPayload;
  const { content, contactName, attachement, channelId } = req.body;

  (contactName
    ? userService.getUser(contactName)
    : channelService.getChannel(channelId, username)
  )
    .then((contact) => {
      if (!contact) throw createError(404, "Contact/Channel does not exist!");

      if (contact.blocked?.includes(userId) || false)
        throw createError(
          400,
          "The user you are trying to send a message to has blocked you!"
        );

      const info = {
        author: username,
        reciever: contactName || channelId,
        content,
        attachement,
      };
      return messageService.addMessage(info, contact);
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
      if (error.status) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Server error!");
      }
    });
}

export default { getMessages, postMessage };
