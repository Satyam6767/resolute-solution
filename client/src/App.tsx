import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import { Student } from "./api/studentApi";
import "./App.css";

type View = "login" | "dashboard";

const App: React.FC = () => {
  const [view, setView] = useState<View>("login");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => {
    setRefreshTrigger((n) => n + 1);
    setEditingStudent(null);
  };

  if (view === "login") {
    return <LoginForm onLoginSuccess={() => setView("dashboard")} />;
  }

  return (
    <div className="app">
      <header>
        <h1>🎓 Student Management System</h1>
        <button className="logout-btn" onClick={() => setView("login")}>Logout</button>
      </header>
      <main>
        <StudentForm
          editing={editingStudent}
          onSaved={refresh}
          onCancel={editingStudent ? () => setEditingStudent(null) : undefined}
        />
        <StudentList
          refreshTrigger={refreshTrigger}
          onEdit={(s) => setEditingStudent(s)}
        />
      </main>
    </div>
  );
};

export default App;
