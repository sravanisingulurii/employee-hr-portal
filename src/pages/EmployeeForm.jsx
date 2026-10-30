
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEmployee, getEmployee, updateEmployee } from "../services/api";
import Field from "../components/Field";

const emptyEmployee = {
  employeeCode: "",
  name: "",
  email: "",
  phone: "",
  departmentId: "",
  designation: "",
  joiningDate: "",
  salary: "",
  status: "Active",
};

function EmployeeForm({ employees, departments, designations, loadData }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyEmployee);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadEmployee() {
      try {
        const employee = await getEmployee(id);

        setForm({
          employeeCode: employee.employeeCode || "",
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          departmentId: String(employee.departmentId || ""),
          designation: employee.designation || "",
          joiningDate: employee.joiningDate || "",
          salary: employee.salary ?? "",
          status: employee.status || "Active",
        });
      } catch {
        setError("Unable to load employee details.");
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Object.values(form).some((value) => String(value).trim() === "")) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (Number(form.salary) < 0) {
      setError("Salary cannot be negative.");
      return;
    }

    const duplicate = employees.some((employee) => {
      if (String(employee.id) === String(id)) return false;

      return (
        employee.employeeCode?.toLowerCase() ===
          form.employeeCode.trim().toLowerCase() ||
        employee.email?.toLowerCase() === form.email.trim().toLowerCase()
      );
    });

    if (duplicate) {
      setError("Employee code or email already exists.");
      return;
    }

    const employeeData = {
      ...form,
      employeeCode: form.employeeCode.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      salary: Number(form.salary),
      departmentId: form.departmentId,
    };

    try {
      setSaving(true);

      if (isEditing) {
        await updateEmployee(id, employeeData);
      } else {
        await addEmployee(employeeData);
      }

      await loadData();
      navigate("/employees");
    } catch {
      setError("Unable to save employee. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>{isEditing ? "Edit Employee" : "Add New Employee"}</h2>
            <p>
              {isEditing
                ? "Update the employee information."
                : "Enter the details of the new employee."}
            </p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Field label="Employee Code">
              <input
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                placeholder="EMP001"
                required
              />
            </Field>

            <Field label="Full Name">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
              />
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                required
              />
            </Field>

            <Field label="Department">
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={String(department.id)}>
                    {department.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Designation">
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                {designations.map((designation) => (
                  <option key={designation.id} value={designation.name}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Joining Date">
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Salary">
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                min="0"
                placeholder="Enter salary"
                required
              />
            </Field>

            <Field label="Employment Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/employees")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Employee"
                  : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
