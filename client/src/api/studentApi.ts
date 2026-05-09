import axios from "axios";
import { encryptStudent, decryptStudent } from "../utils/crypto";

const BASE_URL = "/api";

export interface Student {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const payload = { email, password };
  const { data } = await axios.post(`${BASE_URL}/login`, payload);
  return data;
}

// ── Students ──────────────────────────────────────────────────────────────────

export async function registerStudent(student: Student) {
  const encrypted = encryptStudent(student as unknown as Record<string, string>);
  const { data } = await axios.post(`${BASE_URL}/register`, encrypted);
  return data;
}

export async function getStudents(): Promise<Student[]> {
  const { data } = await axios.get(`${BASE_URL}/students`);
  // Each student comes back with frontend-layer encryption still applied
  return data.map((s: Record<string, string>) => decryptStudent(s) as unknown as Student);
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const encrypted = encryptStudent(student as unknown as Record<string, string>);
  const { data } = await axios.put(`${BASE_URL}/student/${id}`, encrypted);
  return data;
}

export async function deleteStudent(id: string) {
  const { data } = await axios.delete(`${BASE_URL}/student/${id}`);
  return data;
}
