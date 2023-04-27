import userService from "../services/userService.js";
import messageService from "../services/messageService.js";
import { onNewMessage } from "../io/events/message.js";

function getMessages(req, res) {
  const { username } = req.jwtPayload;
  const { contactName } = req.query;

  if (!contactName)
    return res.status(400).send("You must provide contactName!");

  userService
    .getUser(username)
    .then((user) => {
      return messageService.getMessagesFromList(user.messageIds, contactName);
    })
    .then((list) => {
      res.send(list);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Something went wrong!");
    });
}

function postMessage(req, res) {
  const { username } = req.jwtPayload;
  const { content, contactName, attachement } = req.body;

  if (!content || !contactName) return res.status(400).send("Not enough info!");

  userService
    .getUser(contactName)
    .then((contact) => {
      if (contact) {
        return messageService.addMessage({
          author: username,
          reciever: contactName,
          content,
          attachement,
        });
      } else {
        res.status(404).send("Contact does not exist!");
      }
    })
    .then((data) => {
      if (data.result.modifiedCount == 2) {
        res.status(201).send("Message was sent!");
        onNewMessage(data.newMessage);
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
