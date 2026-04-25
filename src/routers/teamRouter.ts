import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createTeam, getTeams } from "../controllers/teamController";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTeam);
router.get("/", getTeams);
export default router;
