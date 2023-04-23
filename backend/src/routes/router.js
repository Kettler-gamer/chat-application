import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.route("/user").post(userController.login).put(userController.register);

export default router;
