import userService from "../services/userService.js";

function login(req, res) {
  const { username, password } = req.body;

  userService.comparePassword(username, password).then((match) => {
    if (match) {
      res.send("You logged in!");
    } else {
      res.status(401).send("Incorrect username or password!");
    }
  });
}

function register(req, res) {
  const { username, password } = req.body;

  userService.addUser({ username, password }).then((result) => {
    res.status(201).send("The user was created!");
  });
}

export default { login, register };
