import userService from "../services/userService.js";

function getProfile(req, res) {
  const { contactName } = req.query;

  if (contactName) return getContactInfo(contactName, res);

  userService
    .getUser(req.jwtPayload.username)
    .then((user) => {
      return userService.getUsersFromIdList(user.contactIds);
    })
    .then((contacts) => {
      res.send({ username: req.jwtPayload.username, contacts });
    });
}

function addContact(req, res) {
  const { username } = req.jwtPayload;
  const { contactName } = req.body;

  userService
    .getUser(contactName)
    .then((contact) => {
      if (!contact) throw new Error("Contact not found!");

      return userService.addContact(username, contact._id);
    })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(201).send("The contact was added!");
      } else if (result.matchedCount == 1) {
        res.status(400).send("This contact is already added!");
      } else {
        throw new Error("Server error");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error.message);
    });
}

function getContactInfo(contactName, res) {
  userService
    .getContactInfo(contactName)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("User not found!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Server Error");
    });
}

export default { getProfile, addContact };
