
import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeDetails from "./pages/EmployeeDetails";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";

import {
  getEmployees,
  getDepartments,
  getDesignations,
  deleteEmployee,
} from "./services/api";

import "./App.css";

function Layout() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  const loadData = useCallback(async () => {
    try {
      setError("");

      const [employeeData, departmentData, designationData] =
        await Promise.all([
          getEmployees(),
          getDepartments(),
          getDesignations(),
        ]);

      setEmployees(employeeData);
      setDepartments(departmentData);
      setDesignations(designationData);
    } catch {
      setError(
        "Unable to connect to the server. Please start JSON Server on port 3000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function departmentName(departmentId) {
    const department = departments.find(
      (item) => String(item.id) === String(departmentId)
    );

    return department ? department.name : "Not assigned";
  }

  async function handleDeleteEmployee(id) {
    try {
      await deleteEmployee(id);
      await loadData();
    } catch {
      window.alert("Unable to delete employee. Please try again.");
    }
  }

  const pageTitles = {
    "/": "Dashboard",
    "/employees": "Employees",
    "/employees/add": "Add Employee",
    "/departments": "Departments",
    "/designations": "Designations",
  };

  const pageTitle = location.pathname.includes("/edit")
    ? "Edit Employee"
    : location.pathname.startsWith("/employees/")
      ? "Employee Details"
      : pageTitles[location.pathname] || "L&T HR Portal";

  const context = {
    employees,
    departments,
    designations,
    departmentName,
    loadData,
    onDelete: handleDeleteEmployee,
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <header className="topbar">
          <div>
            <h2>{pageTitle}</h2>
            <p>Employee & HR Management Portal</p>
          </div>
        </header>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <div className="loading">Loading portal data...</div>
        ) : (
          <Outlet context={context} />
        )}
      </main>
    </div>
  );
}

function DashboardRoute() {
  const { employees, departments, departmentName, onDelete } =
    useOutletContext();

  const navigate = useNavigate();

  return (
    <Dashboard
      employees={employees}
      departments={departments}
      departmentName={departmentName}
      onView={(id) => navigate(`/employees/${id}`)}
      onEdit={(id) => navigate(`/employees/${id}/edit`)}
      onDelete={onDelete}
    />
  );
}

function EmployeesRoute() {
  const { employees, departments, departmentName, onDelete } =
    useOutletContext();

  return (
    <Employees
      employees={employees}
      departments={departments}
      departmentName={departmentName}
      onDelete={onDelete}
    />
  );
}

function EmployeeFormRoute() {
  const { employees, departments, designations, loadData } =
    useOutletContext();

  return (
    <EmployeeForm
      employees={employees}
      departments={departments}
      designations={designations}
      loadData={loadData}
    />
  );
}

function EmployeeDetailsRoute() {
  const { departmentName, onDelete } = useOutletContext();

  return (
    <EmployeeDetails
      departmentName={departmentName}
      onDelete={onDelete}
    />
  );
}

function DepartmentsRoute() {
  const { departments, employees, loadData } = useOutletContext();

  return (
    <Departments
      departments={departments}
      employees={employees}
      loadData={loadData}
    />
  );
}

function DesignationsRoute() {
  const { designations, employees, loadData } = useOutletContext();

  return (
    <Designations
      designations={designations}
      employees={employees}
      loadData={loadData}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardRoute />} />
        <Route path="employees" element={<EmployeesRoute />} />
        <Route path="employees/add" element={<EmployeeFormRoute />} />
        <Route path="employees/:id" element={<EmployeeDetailsRoute />} />
        <Route path="employees/:id/edit" element={<EmployeeFormRoute />} />
        <Route path="departments" element={<DepartmentsRoute />} />
        <Route path="designations" element={<DesignationsRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
