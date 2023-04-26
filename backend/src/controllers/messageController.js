import userService from "../services/userService.js";
import messageService from "../services/messageService.js";

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
  const { content, contactName } = req.body;

  if (!content || !contactName) return res.status(400).send("Not enough info!");

  userService
    .getUser(contactName)
    .then((contact) => {
      if (contact) {
        return messageService.addMessage({
          author: username,
          reciever: contactName,
          content,
        });
      } else {
        res.status(404).send("Contact does not exist!");
      }
    })
    .then((result) => {
      if (result.modifiedCount == 2) {
        res.status(201).send("Message was sent!");
      } else {
        console.log(result);
        res.status(500).send("Something went wrong!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server error!");
    });
}

export default { getMessages, postMessage };
