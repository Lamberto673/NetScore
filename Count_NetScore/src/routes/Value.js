import express from "express"
import { value, getValue } from "../controllers/valueControllers.js";

const routers = express.Router();

routers.post("/vote", value);

routers.get("/getVote", getValue);

export default routers;