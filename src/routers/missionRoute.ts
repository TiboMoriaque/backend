import express from "express";
import { createMission, getMissions } from "../controllers/missionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", createMission);
router.get("/", authMiddleware, getMissions);

export default router;
