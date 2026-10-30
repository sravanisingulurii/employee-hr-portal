
import { useState } from "react";

function Designations({ designations, employees, loadData }) {
  const [designationName, setDesignationName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function addDesignation(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = designationName.trim();

    if (!name) {
      setError("Please enter a designation name.");
      return;
    }

    const exists = designations.some(
      (designation) =>
        designation.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setError("This designation already exists.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/designations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Could not add designation.");

      setDesignationName("");
      setMessage("Designation added successfully.");
      await loadData();
    } catch {
      setError("Unable to add designation. Check JSON Server.");
    }
  }

  async function deleteDesignation(id) {
    const designation = designations.find(
      (item) => String(item.id) === String(id)
    );

    const assigned = employees.some(
      (employee) => employee.designation === designation?.name
    );

    if (assigned) {
      setError("Cannot delete a designation assigned to employees.");
      setMessage("");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this designation?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/designations/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Could not delete designation.");

      setError("");
      setMessage("Designation deleted successfully.");
      await loadData();
    } catch {
      setError("Unable to delete designation.");
    }
  }

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Designation Management</h2>
            <p>Create and manage employee designations.</p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}
        {message && <div className="alert">{message}</div>}

        <form className="catalog-form" onSubmit={addDesignation}>
          <input
            type="text"
            placeholder="Enter designation name"
            value={designationName}
            onChange={(event) => setDesignationName(event.target.value)}
          />

          <button className="button button-primary" type="submit">
            + Add Designation
          </button>
        </form>

        <div className="catalog-list">
          {designations.length === 0 ? (
            <div className="empty-state">No designations available.</div>
          ) : (
            designations.map((designation) => (
              <div className="catalog-item" key={designation.id}>
                <div>
                  <strong>{designation.name}</strong>
                  <p>
                    {employees.filter(
                      (employee) => employee.designation === designation.name
                    ).length}{" "}
                    employees
                  </p>
                </div>

                <button
                  className="button button-small button-danger"
                  onClick={() => deleteDesignation(designation.id)}
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

export default Designations;
