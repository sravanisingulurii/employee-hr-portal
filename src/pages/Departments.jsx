
import { useState } from "react";

function Departments({
  departments,
  employees,
  loadData,
}) {
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function addDepartment(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = departmentName.trim();

    if (!name) {
      setError("Please enter a department name.");
      return;
    }

    const exists = departments.some(
      (department) =>
        department.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setError("This department already exists.");
      return;
    }

    try {
      const response = await fetch("https://employee-hr-portal.onrender.com/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Could not add department.");

      setDepartmentName("");
      setMessage("Department added successfully.");
      await loadData();
    } catch {
      setError("Unable to add department. Check JSON Server.");
    }
  }

  async function deleteDepartment(id) {
    const assigned = employees.some(
      (employee) => String(employee.departmentId) === String(id)
    );

    if (assigned) {
      setError("Cannot delete a department assigned to employees.");
      setMessage("");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/departments/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Could not delete department.");

      setError("");
      setMessage("Department deleted successfully.");
      await loadData();
    } catch {
      setError("Unable to delete department.");
    }
  }

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Department Management</h2>
            <p>Create and manage company departments.</p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}
        {message && <div className="alert">{message}</div>}

        <form className="catalog-form" onSubmit={addDepartment}>
          <input
            type="text"
            placeholder="Enter department name"
            value={departmentName}
            onChange={(event) => setDepartmentName(event.target.value)}
          />

          <button className="button button-primary" type="submit">
            + Add Department
          </button>
        </form>

        <div className="catalog-list">
          {departments.length === 0 ? (
            <div className="empty-state">No departments available.</div>
          ) : (
            departments.map((department) => (
              <div className="catalog-item" key={department.id}>
                <div>
                  <strong>{department.name}</strong>
                  <p>
                    {employees.filter(
                      (employee) =>
                        String(employee.departmentId) ===
                        String(department.id)
                    ).length}{" "}
                    employees
                  </p>
                </div>

                <button
                  className="button button-small button-danger"
                  onClick={() => deleteDepartment(department.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Departments;
