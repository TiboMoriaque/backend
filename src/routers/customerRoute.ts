import express from "express";
import {
  getCustomers,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "../controllers/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);
router.get("/", authMiddleware, getCustomers);

export default router;
