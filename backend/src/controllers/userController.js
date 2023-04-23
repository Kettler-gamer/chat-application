import userService from "../services/userService.js";

function login(req, res) {}

function register(req, res) {
  const { username, password } = req.body;

  userService.addUser({ username, password }).then((result) => {
    res.status(201).send("The user was created!");
  });
}

export default { login, register };
