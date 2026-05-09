import React, { useState, useEffect } from "react";
import { registerStudent, updateStudent, Student } from "../api/studentApi";
import "./StudentForm.css";

interface Props {
  editing?: Student | null;
  onSaved: () => void;
  onCancel?: () => void;
}

const COURSES = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "MBA",
  "Other",
];

const empty: Omit<Student, "_id"> = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  courseEnrolled: "",
  password: "",
};

const StudentForm: React.FC<Props> = ({ editing, onSaved, onCancel }) => {
  const [form, setForm] = useState({ ...empty });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({ ...editing, password: "" });
    } else {
      setForm({ ...empty });
    }
  }, [editing]);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.fullName.trim()) return "Full Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Valid email is required.";
    if (!/^\d{10}$/.test(form.phoneNumber))
      return "Phone Number must be 10 digits.";
    if (!form.dateOfBirth) return "Date of Birth is required.";
    if (!form.gender) return "Gender is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.courseEnrolled) return "Course is required.";
    if (!editing && form.password && form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (editing && editing._id) {
        const { password, ...rest } = form;
        const payload = password ? form : rest;
        await updateStudent(editing._id, payload);
      } else {
        await registerStudent(form as Student);
      }
      setForm({ ...empty });
      onSaved();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{editing ? "Edit Student" : "Register Student"}</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={change} placeholder="John Doe" />
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} placeholder="john@example.com" />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={change} placeholder="10-digit number" />
        </div>
        <div className="field">
          <label>Date of Birth</label>
          <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={change} />
        </div>
        <div className="field">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={change}>
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="field">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={change} rows={3} placeholder="123 Main St…" />
        </div>
        <div className="field">
          <label>Course Enrolled</label>
          <select name="courseEnrolled" value={form.courseEnrolled} onChange={change}>
            <option value="">-- Select Course --</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>{editing ? "New Password (leave blank to keep)" : "Password"}</label>
          <input name="password" type="password" value={form.password} onChange={change} placeholder="••••••••" />
        </div>
        <div className="button-row">
          <button type="submit" disabled={loading}>
            {loading ? "Saving…" : editing ? "Update" : "Register"}
          </button>
          {onCancel && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
