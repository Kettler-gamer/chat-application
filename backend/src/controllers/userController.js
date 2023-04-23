import userService from "../services/userService.js";
import jwtUtil from "../util/jwtUtil.js";

function login(req, res) {
  const { username, password } = req.body;

  userService.comparePassword(username, password).then((match) => {
    if (match) {
      const jwtToken = jwtUtil.createToken({ username });
      res.send({ jwtToken, message: "You logged in!" });
    } else {
      res.status(401).send("Incorrect username or password!");
    }
  });
}

function register(req, res) {
  const { username, password } = req.body;

  userService
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

export default { login, register };
