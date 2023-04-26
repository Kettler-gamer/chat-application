import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import messageController from "../controllers/messageController.js";
import userCheck from "../filter/userCheck.js";
import checkToken from "../filter/jwtCheck.js";

const router = express.Router();

router.post("/auth/login", userCheck.checkUserInput, authController.login);
router.put("/auth/register", userCheck.checkUserInput, authController.register);

router.use(checkToken);

router
  .route("/user")
  .get(userController.getProfile)
  .put(userController.addContact);

router.put("/profilePicture", userController.setProfilePicture);

router
  .route("/message")
  .get(messageController.getMessages)
  .post(messageController.postMessage);

export default router;
