import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriends,
} from "../controller/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// read
router.route("/:id").get(verifyToken, getUser);
router.route("/:id/friends").get(verifyToken, getUserFriends);

// update
router.route("/:id/:friendId").patch(verifyToken, addRemoveFriends);

export default router;
