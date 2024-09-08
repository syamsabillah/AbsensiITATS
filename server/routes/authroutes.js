import express from "express";
import {
  Login,
  authService,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/authService", authService);
router.post("/login", Login);
router.post("/user", createUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/user", getUsers);
router.get("/user/:id", getUserById);

export default router;
