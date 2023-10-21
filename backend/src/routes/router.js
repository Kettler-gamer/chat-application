import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import messageController from "../controllers/messageController.js";
import channelController from "../controllers/channelController.js";
import userCheck from "../filter/userCheck.js";
import checkToken from "../filter/jwtCheck.js";
import messageFilter from "../filter/messageFilter.js";
import {
  defaultLimiter,
  loginLimiter,
  registerLimiter,
} from "../util/rateLimiters.js";

const router = express.Router();

router.post(
  "/auth/login",
  userCheck.checkUserInput,
  loginLimiter,
  authController.login
);
router.put(
  "/auth/register",
  userCheck.checkUserInput,
  registerLimiter,
  authController.register
);

router.use(defaultLimiter, checkToken);

router.patch("/auth/changepassword", authController.changePassword);

router
  .route("/user")
  .get(userController.getProfile)
  .put(userController.addContact);

router.put("/profilePicture", userController.setProfilePicture);

router.delete("/removeContact", userController.removeContact);

router.patch("/blockUser", userController.blockUser);

router
  .route("/message")
  .get(messageFilter.getFilter, messageController.getMessages)
  .post(messageFilter.postFilter, messageController.postMessage);

router
  .route("/channel")
  .get(channelController.getChannel)
  .post(channelController.createChannel)
  .patch(channelController.addUsersToChannel);

router.get("/channel/leave", channelController.leaveChannel);

export default router;
