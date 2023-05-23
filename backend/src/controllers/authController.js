import authService from "../services/authService.js";
import userService from "../services/userService.js";
import jwtUtil from "../util/jwtUtil.js";

function login(req, res) {
  const { username, password } = req.body;

  authService.comparePassword(username, password).then((info) => {
    if (info.match) {
      const jwtToken = jwtUtil.createToken({ username, userId: info.userId });
      console.log(jwtToken);
      res.send({ jwtToken, message: "You logged in!" });
    } else {
      res.status(401).send("Incorrect username or password!");
    }
  });
}

function register(req, res) {
  const { username, password } = req.body;

  authService
    .addUser({ username, password })
    .then((result) => {
      res.status(201).send("The user was created!");
    })
    .catch((error) => {
      console.log(error.code);
      if (error.code === 11000) {
        res.status(409).send("That username is already taken!");
      } else {
        res.status(500).send("Server error!");
      }
    });
}

async function changePassword(req, res) {
  const { username } = req.jwtPayload;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword)
    return res.status(400).send("Insufficient credentials!");

  if (newPassword !== confirmPassword)
    return res.status(400).send("New passwords do not match!");

  const match = await authService.comparePassword(username, oldPassword);

  if (!match) return res.status(400).send("Incorrect password!");

  const result = await userService.updateUserPassword(username, newPassword);

  if (result.modifiedCount > 0) return res.send("The password was changed!");
  console.log(result);
  res
    .status(500)
    .send("Something went wrong when trying to change your password!");
}

export default { login, register, changePassword };
