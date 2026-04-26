import express from "express";
import {
  createMission,
  getMissions,
  updateMission,
} from "../controllers/missionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", createMission);
router.get("/", authMiddleware, getMissions);
router.put("/:id", authMiddleware, updateMission);

export default router;
