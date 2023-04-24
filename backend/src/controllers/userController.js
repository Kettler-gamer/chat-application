import userService from "../services/userService.js";

function getProfile(req, res) {
  userService
    .getUser(req.jwtPayload.username)
    .then((user) => {
      return userService.getUsersFromIdList(user.contactIds);
    })
    .then((contacts) => {
      console.log(contacts);
      res.send({ username: req.jwtPayload.username, contacts });
    });
}

function addContact(req, res) {
  const { username } = req.jwtPayload;
  const { contactName } = req.body;
  console.log("Add contact!");

  userService
    .getUser(contactName)
    .then((contact) => {
      if (!contact) throw new Error("Contact not found!");

      return userService.addContact(username, contact._id);
    })
    .then((result) => {
      console.log(result);
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

export default { getProfile, addContact };
