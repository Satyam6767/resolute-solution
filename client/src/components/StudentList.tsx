import React, { useEffect, useState, useCallback } from "react";
import { getStudents, deleteStudent, Student } from "../api/studentApi";
import "./StudentList.css";

interface Props {
  refreshTrigger: number;
  onEdit: (student: Student) => void;
}

const StudentList: React.FC<Props> = ({ refreshTrigger, onEdit }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents();
      setStudents(data);
    } catch {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await deleteStudent(id);
      fetchStudents();
    } catch {
      alert("Failed to delete student.");
    }
  };

  if (loading) return <p>Loading students...</p>;

  if (error) return <p className="error-msg">{error}</p>;

  if (students.length === 0)
    return <p>No students registered yet.</p>;

  return (
    <div className="list-container">
      <h2>Registered Students</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.fullName}</td>
                <td>{s.email}</td>
                <td>{s.phoneNumber}</td>
                <td>{s.dateOfBirth}</td>
                <td>{s.gender}</td>
                <td>{s.courseEnrolled}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(s._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;