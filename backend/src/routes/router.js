import express from "express";
import userController from "../controllers/userController.js";
import userCheck from "../filter/userCheck.js";
import checkToken from "../filter/jwtCheck.js";

const router = express.Router();

router
  .route("/user")
  .post(userCheck.checkUserInput, userController.login)
  .put(userCheck.checkUserInput, userController.register);

router.use(checkToken);

export default router;
