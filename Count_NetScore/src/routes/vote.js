import express from "express"
import { sign } from "../controllers/voteControllers.js";

const routes = express.Router();

routes.post("/sign", sign)

export default routes;