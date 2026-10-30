
import StatCard from "../components/StatCard";
import EmployeeTable from "../components/EmployeeTable";

function Dashboard({
  employees,
  departments,
  departmentName,
  onView,
  onEdit,
  onDelete,
}) {
  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  );

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  );

  const totalSalary = employees.reduce(
    (total, employee) => total + Number(employee.salary || 0),
    0
  );

  const averageSalary =
    employees.length > 0 ? totalSalary / employees.length : 0;

  const recentEmployees = [...employees]
    .sort(
      (a, b) =>
        new Date(b.joiningDate) - new Date(a.joiningDate)
    )
    .slice(0, 5);

  return (
    <div className="content">
      <div className="welcome-panel">
        <div>
          <h1>Welcome to L&T HR Portal</h1>
          <p>Manage your workforce efficiently from one place.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={employees.length}
          subtitle="Registered employees"
          icon="♙"
        />

        <StatCard
          title="Active Employees"
          value={activeEmployees.length}
          subtitle="Currently working"
          icon="✓"
        />

        <StatCard
          title="Departments"
          value={departments.length}
          subtitle="Available departments"
          icon="▤"
        />

        <StatCard
          title="Average Salary"
          value={`₹${Math.round(averageSalary).toLocaleString("en-IN")}`}
          subtitle="Average employee salary"
          icon="₹"
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Employees</h2>
            <p>Latest employees based on joining date</p>
          </div>
        </div>

        <EmployeeTable
          employees={recentEmployees}
          departmentName={departmentName}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Workforce Overview</h2>
        </div>

        <p>Total employees: {employees.length}</p>
        <p>Active employees: {activeEmployees.length}</p>
        <p>Inactive employees: {inactiveEmployees.length}</p>
      </div>
    </div>
  );
}

export default Dashboard;
