import { Request, Response } from "express";
import Student, { IStudent } from "../models/Student";
import {
  encryptStudentBackend,
  decryptStudentBackend,
} from "../utils/crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // For demo purposes, accept a hardcoded admin credential.
    // In production, query an Admin/User collection.
    if (email === "admin@example.com" && password === "admin123") {
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET || "jwt-secret",
        { expiresIn: "1d" }
      );
      res.json({ message: "Login successful", token });
      return;
    }
    res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ── CRUD ──────────────────────────────────────────────────────────────────────

export const registerStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as Record<string, string>;

    // body arrives already AES-encrypted by the frontend
    // Apply backend's 2nd encryption layer to all sensitive fields
    const doubleEncrypted = encryptStudentBackend(body);

    const student = new Student(doubleEncrypted as unknown as IStudent);
    await student.save();

    res
      .status(201)
      .json({ message: "Student registered successfully", id: student._id });
  } catch (err: unknown) {
    const isDuplicate =
      (err as { code?: number }).code === 11000;
    if (isDuplicate) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
};

export const getStudents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await Student.find().select("-__v").lean();

    // Strip backend encryption so only the frontend layer remains
    const decrypted = students.map((s) => {
      const obj = s as unknown as Record<string, string>;
      return {
        ...decryptStudentBackend(obj),
        _id: obj._id,
        gender: obj.gender,
        courseEnrolled: obj.courseEnrolled,
      };
    });

    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body as Record<string, string>;

    // Re-apply double encryption to updated fields
    const doubleEncrypted = encryptStudentBackend(body);

    const updated = await Student.findByIdAndUpdate(id, doubleEncrypted, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
