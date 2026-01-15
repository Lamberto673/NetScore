import express from "express"
import { post, getPosts } from "../controllers/postController.js";

const routers = express.Router();

routers.post("/post", post);
routers.get("/posts", getPosts);

export default routers;