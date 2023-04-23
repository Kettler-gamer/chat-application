function checkUserInput(req, res, next) {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username.includes(" ") ||
    password.includes(" ") ||
    username.length < 5 ||
    password.length < 5
  )
    return res.status(400).send("Bad credentials!");

  next();
}

export default { checkUserInput };
