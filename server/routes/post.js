import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controller/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(verifyToken, getFeedPosts);
router.route("/:userId/posts").get(verifyToken, getUserPosts);

router.route("/:id/likes").patch(verifyToken, likePost);

export default router;
