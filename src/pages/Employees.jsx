
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";

function Employees({
  employees,
  departments,
  departmentName,
  onDelete,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("employeeCode");

  const designations = [
    ...new Set(employees.map((employee) => employee.designation)),
  ].filter(Boolean);

  const filteredEmployees = useMemo(() => {
    const result = employees.filter((employee) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        employee.name?.toLowerCase().includes(searchText) ||
        String(employee.employeeCode || "")
          .toLowerCase()
          .includes(searchText) ||
        employee.email?.toLowerCase().includes(searchText);

      const matchesDepartment =
        !departmentFilter ||
        String(employee.departmentId) === departmentFilter;

      const matchesDesignation =
        !designationFilter ||
        employee.designation === designationFilter;

      const matchesStatus =
        !statusFilter || employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesStatus
      );
    });

    result.sort((a, b) => {
      if (sortBy === "employeeCode") {
        return (
          Number(a.employeeCode) - Number(b.employeeCode)
        );
      }

      if (sortBy === "salary") {
        return Number(a.salary || 0) - Number(b.salary || 0);
      }

      if (sortBy === "joiningDate") {
        return (
          new Date(a.joiningDate) - new Date(b.joiningDate)
        );
      }

      return (a.name || "").localeCompare(b.name || "");
    });

    return result;
  }, [
    employees,
    search,
    departmentFilter,
    designationFilter,
    statusFilter,
    sortBy,
  ]);

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Employee Management</h2>
            <p>Search, filter, sort and manage employees.</p>
          </div>

          <button
            className="button button-primary"
            onClick={() => navigate("/employees/add")}
          >
            + Add Employee
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search name, ID or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option
                key={department.id}
                value={String(department.id)}
              >
                {department.name}
              </option>
            ))}
          </select>

          <select
            value={designationFilter}
            onChange={(event) =>
              setDesignationFilter(event.target.value)
            }
          >
            <option value="">All Designations</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="employeeCode">
              Employee ID (Ascending)
            </option>
            <option value="name">Name (A-Z)</option>
            <option value="salary">Salary (Low to High)</option>
            <option value="joiningDate">
              Joining Date (Oldest to Newest)
            </option>
          </select>
        </div>

        <p className="employee-count">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>

        <EmployeeTable
          employees={filteredEmployees}
          departmentName={departmentName}
          onView={(id) => navigate(`/employees/${id}`)}
          onEdit={(id) => navigate(`/employees/${id}/edit`)}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default Employees;
