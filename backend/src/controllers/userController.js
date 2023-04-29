import userService from "../services/userService.js";

function getProfile(req, res) {
  const { contactName } = req.query;

  if (contactName) return getContactInfo(contactName, res);

  userService
    .getUser(req.jwtPayload.username, ["channelIds"])
    .then((user) => {
      console.log(user.channelIds);
      return {
        user,
        contacts: userService.getUsersFromIdList(user.contactIds),
      };
    })
    .then((result) => {
      result.contacts.then((contacts) => {
        res.send({
          username: result.user.username,
          channelIds: result.user.channelIds,
          profilePicture: result.user.profilePicture,
          contacts,
        });
      });
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

function setProfilePicture(req, res) {
  const { username } = req.jwtPayload;
  const { picture } = req.body;

  if (!picture) return res.status(400).send("No picture provided!");

  if (
    !picture.startsWith("data:image/png;base64,") &&
    !picture.startsWith("data:image/jpeg;base64,")
  )
    return res.status(400).send("Invalid image type!");

  userService
    .updateProfilePicture(username, picture)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.send("The picture was added!");
      } else {
        res.status(500).send("Something went wrong!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Something went wrong!");
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

export default { getProfile, addContact, setProfilePicture };
