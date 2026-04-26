import express from "express";
import { login, logout, register } from "../controllers/authController";
import { validate } from "../middlewares/validateRegisterMiddleware";
import { registerBodySchema } from "../validators/userSchema";

const router = express.Router();

router.post("/register", validate(registerBodySchema), register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
