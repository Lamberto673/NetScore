import express from "express"
import { Delete } from "../controllers/DeleteController.js";

const routes = express.Router();

routes.delete("/post/:id", Delete);

export default routes;