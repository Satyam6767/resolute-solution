import { Router } from "express";
import {
  login,
  registerStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = Router();

router.post("/login", login);
router.post("/register", registerStudent);
router.get("/students", getStudents);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

export default router;
