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

export default { getProfile };
