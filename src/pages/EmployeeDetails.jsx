
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployee } from "../services/api";
import Detail from "../components/Detail";

function EmployeeDetails({ departmentName, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await getEmployee(id);
        setEmployee(data);
      } catch {
        setError("Employee details could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    await onDelete(id);
    navigate("/employees");
  }

  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  if (error || !employee) {
    return (
      <div className="content">
        <div className="alert">{error || "Employee not found."}</div>
        <button
          className="button button-secondary"
          onClick={() => navigate("/employees")}
        >
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Employee Details</h2>
            <p>Complete employee information</p>
          </div>

          <div className="actions">
            <button
              className="button button-secondary"
              onClick={() => navigate("/employees")}
            >
              Back
            </button>

            <button
              className="button button-primary"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Edit Employee
            </button>

            <button
              className="button button-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="details-banner">
          <div className="employee-avatar">
            {employee.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{employee.name}</h2>
            <p>{employee.designation}</p>
            <span className="status-badge">
              {employee.status}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <Detail label="Employee Code" value={employee.employeeCode} />
          <Detail label="Full Name" value={employee.name} />
          <Detail label="Email" value={employee.email} />
          <Detail label="Phone" value={employee.phone} />
          <Detail
            label="Department"
            value={departmentName(employee.departmentId)}
          />
          <Detail label="Designation" value={employee.designation} />
          <Detail label="Joining Date" value={employee.joiningDate} />
          <Detail
            label="Salary"
            value={`₹${Number(employee.salary || 0).toLocaleString("en-IN")}`}
          />
          <Detail label="Employment Status" value={employee.status} />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
