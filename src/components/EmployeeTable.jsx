
function EmployeeTable({
  employees,
  departmentName,
  onView,
  onEdit,
  onDelete,
}) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <h3>No employees found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>EMPLOYEE ID</th>
            <th>DEPARTMENT</th>
            <th>DESIGNATION</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="clickable-row"
              onClick={() => onView(employee.id)}
              title="Click to view employee details"
            >
              <td>
                <div className="employee-cell">
                  <div className="employee-avatar">
                    {employee.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{employee.name}</strong>
                    <small>{employee.email}</small>
                  </div>
                </div>
              </td>

              <td>{employee.employeeCode}</td>
              <td>{departmentName(employee.departmentId)}</td>
              <td>{employee.designation}</td>

              <td>
                <span
                  className={`status-badge ${
                    employee.status?.toLowerCase() === "active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {employee.status}
                </span>
              </td>

              <td>
                <div
                  className="actions"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="view-action"
                    onClick={() => onView(employee.id)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="edit-action"
                    onClick={() => onEdit(employee.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-action"
                    onClick={() => onDelete(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
