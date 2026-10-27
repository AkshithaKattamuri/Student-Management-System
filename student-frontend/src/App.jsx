import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  // =========================
  // ADD STUDENT FIELDS
  // =========================

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [cgpa, setCgpa] = useState("");

  // =========================
  // INLINE EDITING
  // =========================

  const [editingId, setEditingId] = useState(null);
  const [editAge, setEditAge] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editMarks, setEditMarks] = useState("");
  const [editCgpa, setEditCgpa] = useState("");

  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/students"
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setStudents(data);

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend server");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // =========================
  // ADD STUDENT
  // =========================

  const addStudent = async () => {

    // Name validation
    if (!name.trim()) {
      alert("Please enter student name");
      return;
    }

    if (
      name.trim().length < 2 ||
      name.trim().length > 50
    ) {
      alert("Name must be between 2 and 50 characters");
      return;
    }

    // Age validation
    if (
      age === "" ||
      Number(age) < 1 ||
      Number(age) > 100
    ) {
      alert("Age must be between 1 and 100");
      return;
    }

    // Course validation
    if (!course) {
      alert("Please select a course");
      return;
    }

    // Marks validation
    if (
      marks === "" ||
      Number(marks) < 0 ||
      Number(marks) > 100
    ) {
      alert("Marks must be between 0 and 100");
      return;
    }

    // CGPA validation
    if (
      cgpa === "" ||
      Number(cgpa) < 0 ||
      Number(cgpa) > 10
    ) {
      alert("CGPA must be between 0 and 10");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name.trim(),
            age: Number(age),
            course: course,
            marks: Number(marks),
            cgpa: Number(cgpa)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Student added successfully");

      // Clear fields
      setName("");
      setAge("");
      setCourse("");
      setMarks("");
      setCgpa("");

      // Refresh table
      getStudents();

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend server");
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (student) => {

    setEditingId(student._id);
    setEditAge(student.age);
    setEditCourse(student.course);
    setEditMarks(student.marks);

    setEditCgpa(
      student.cgpa !== undefined
        ? student.cgpa
        : ""
    );
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {

    setEditingId(null);
    setEditAge("");
    setEditCourse("");
    setEditMarks("");
    setEditCgpa("");
  };

  // =========================
  // SAVE EDIT
  // =========================

  const saveEdit = async (studentName) => {

    // Age validation
    if (
      editAge === "" ||
      Number(editAge) < 1 ||
      Number(editAge) > 100
    ) {
      alert("Age must be between 1 and 100");
      return;
    }

    // Marks validation
    if (
      editMarks === "" ||
      Number(editMarks) < 0 ||
      Number(editMarks) > 100
    ) {
      alert("Marks must be between 0 and 100");
      return;
    }

    // Course validation
    if (!editCourse) {
      alert("Please select a course");
      return;
    }

    // CGPA validation
    if (
      editCgpa === "" ||
      Number(editCgpa) < 0 ||
      Number(editCgpa) > 10
    ) {
      alert("CGPA must be between 0 and 10");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/students/${encodeURIComponent(
          studentName
        )}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            age: Number(editAge),
            course: editCourse,
            marks: Number(editMarks),
            cgpa: Number(editCgpa)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update table immediately
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student._id === data.student._id
            ? data.student
            : student
        )
      );

      alert("Student updated successfully");

      // Exit edit mode
      cancelEdit();

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend server");
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (studentName) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${studentName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/students/${encodeURIComponent(
          studentName
        )}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Student deleted successfully");

      getStudents();

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend server");
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div>

      {/* TITLE */}

      <h1>Student Management System</h1>

      {/* =========================
          ADD STUDENT
          ========================= */}

      <h2>Add Student</h2>

      <p className="required-text">
        All fields are required. Age: 1-100, Marks: 0-100, CGPA: 0-10.
      </p>

      <div className="add-student-form">

        {/* NAME */}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        {/* AGE */}

        <input
          type="number"
          placeholder="Age (1-100)"
          min="1"
          max="100"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
        />

        {/* COURSE DROPDOWN */}

        <select
          value={course}
          onChange={(e) =>
            setCourse(e.target.value)
          }
        >
          <option value="">
            Select Course
          </option>

          <option value="CSE">
            CSE
          </option>

          <option value="ECE">
            ECE
          </option>

          <option value="EEE">
            EEE
          </option>

          <option value="AERO">
            AERO
          </option>

          <option value="MECH">
            MECH
          </option>

          <option value="CIVIL">
            CIVIL
          </option>

        </select>

        {/* MARKS */}

        <input
          type="number"
          placeholder="Marks (0-100)"
          min="0"
          max="100"
          value={marks}
          onChange={(e) =>
            setMarks(e.target.value)
          }
        />

        {/* CGPA */}

        <input
          type="number"
          placeholder="CGPA (0-10)"
          min="0"
          max="10"
          step="0.01"
          value={cgpa}
          onChange={(e) =>
            setCgpa(e.target.value)
          }
        />

        {/* ADD BUTTON */}

        <button onClick={addStudent}>
          Add Student
        </button>

      </div>

      {/* =========================
          STUDENTS TABLE
          ========================= */}

      <h2>Students</h2>

      <table className="student-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Marks</th>
            <th>CGPA</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student._id}>

              {/* NAME */}

              <td>
                {student.name}
              </td>

              {/* AGE */}

              <td>

                {editingId === student._id ? (

                  <input
                    className="edit-input"
                    type="number"
                    min="1"
                    max="100"
                    value={editAge}
                    onChange={(e) =>
                      setEditAge(e.target.value)
                    }
                  />

                ) : (

                  student.age

                )}

              </td>

              {/* COURSE */}

              <td>

                {editingId === student._id ? (

                  <select
                    className="edit-input"
                    value={editCourse}
                    onChange={(e) =>
                      setEditCourse(e.target.value)
                    }
                  >

                    <option value="CSE">
                      CSE
                    </option>

                    <option value="ECE">
                      ECE
                    </option>

                    <option value="EEE">
                      EEE
                    </option>

                    <option value="AERO">
                      AERO
                    </option>

                    <option value="MECH">
                      MECH
                    </option>

                    <option value="CIVIL">
                      CIVIL
                    </option>

                  </select>

                ) : (

                  student.course

                )}

              </td>

              {/* MARKS */}

              <td>

                {editingId === student._id ? (

                  <input
                    className="edit-input"
                    type="number"
                    min="0"
                    max="100"
                    value={editMarks}
                    onChange={(e) =>
                      setEditMarks(e.target.value)
                    }
                  />

                ) : (

                  student.marks

                )}

              </td>

              {/* CGPA */}

              <td>

                {editingId === student._id ? (

                  <input
                    className="edit-input"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={editCgpa}
                    onChange={(e) =>
                      setEditCgpa(e.target.value)
                    }
                  />

                ) : (

                  student.cgpa !== undefined
                    ? student.cgpa
                    : "-"

                )}

              </td>

              {/* ACTION */}

              <td>

                {editingId === student._id ? (

                  <>

                    <button
                      className="save-btn"
                      onClick={() =>
                        saveEdit(student.name)
                      }
                    >
                      Save
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>

                  </>

                ) : (

                  <>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        startEdit(student)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteStudent(student.name)
                      }
                    >
                      Delete
                    </button>

                  </>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;