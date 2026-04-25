import express from "express";
import { getConnectedUser, getUsers } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getConnectedUser);
router.get("/", getUsers);

export default router;
