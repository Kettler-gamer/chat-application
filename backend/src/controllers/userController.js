import { isValidObjectId } from "mongoose";
import userService from "../services/userService.js";
import { onNewRequest } from "../io/events/request.js";

async function getProfile(req, res) {
  const { contactName } = req.query;

  if (contactName) return getContactInfo(contactName, res);

  const user = await userService.getUser(req.jwtPayload.username, [
    "channelIds",
  ]);

  const result = {
    contacts: await userService.getUsersFromIdList(user.contactIds),
  };

  if (user.requests && user.requests.length > 0)
    result.requests = await userService.getUsersFromIdList(user.requests);

  if (user.blocked && user.blocked.length > 0)
    result.requests = await userService.getUsersFromIdList(user.blocked);

  res.send({
    username: user.username,
    channelIds: user.channelIds,
    profilePicture: user.profilePicture,
    ...result,
  });
}

async function addContact(req, res) {
  const { username } = req.jwtPayload;
  const { contactName } = req.body;

  const contact = await userService.getUser(contactName);

  if (!contact) throw new Error("Contact not found!");

  const result = await userService.addContact(username, contact._id);

  if (result.modifiedCount > 0) {
    const contactInfo = await userService.getContactInfo(contactName);

    res
      .status(201)
      .send({ message: "The contact was added!", contact: contactInfo });

    const requestResult = await userService.removeRequest(
      username,
      contact._id
    );

    console.log(requestResult);

    if (requestResult.modifiedCount === 0) {
      await userService.addRequest(username, contactName);

      onNewRequest(await userService.getContactInfo(username), contactName);
    }
  } else if (result.matchedCount == 1) {
    res.status(400).send("This contact is already added!");
  } else {
    throw new Error("Server error");
  }
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

async function removeContact(req, res) {
  const { username } = req.jwtPayload;
  const { contactId } = req.body;

  if (!contactId || !isValidObjectId(contactId))
    return res.status(400).send("Incorrect values provided!");

  const result = await userService.removeContact(username, contactId);

  if (result.modifiedCount === 0)
    return res.status(400).send("Contact was not found!");

  res.status(200).send("The contact was removed!");
}

export default { getProfile, addContact, setProfilePicture, removeContact };
