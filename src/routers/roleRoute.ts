import express from "express";
import { getRoles } from "../controllers/roleController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getRoles);

export default router;
