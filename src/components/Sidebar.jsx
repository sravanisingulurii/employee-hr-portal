
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "▦" },
    { name: "Employees", path: "/employees", icon: "♙" },
    { name: "Departments", path: "/departments", icon: "▤" },
    { name: "Designations", path: "/designations", icon: "▣" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">L</div>
        <div>
          <h2>L&T</h2>
          <span>HR MANAGEMENT</span>
        </div>
      </div>

      <p className="nav-heading">MAIN MENU</p>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Employee & HR Portal</p>
        <span>Management System</span>
      </div>
    </aside>
  );
}

export default Sidebar;
