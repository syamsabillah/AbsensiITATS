import express from "express";
import {
  createAbsen,
  getAbsen,
  deleteAbsen,
  getAbsenToday,
  getAbsenMahasiswaToday,
  getAbsenTamuToday,
  getAbsenQuery,
  getAbsenTodayQuery,
} from "../controllers/absensiController.js";

const router = express.Router();

router.post("/absen", createAbsen);
router.get("/absen", getAbsen);
router.get("/absentoday", getAbsenToday);
router.get("/absenquery", getAbsenQuery);
router.get("/absentodayquery", getAbsenTodayQuery);
router.get("/absenmahasiswa", getAbsenMahasiswaToday);
router.get("/absentamu", getAbsenTamuToday);
router.delete("/absen/:id", deleteAbsen);

export default router;
