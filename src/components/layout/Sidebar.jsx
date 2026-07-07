import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Calendar", path: "/calendar" },
    { label: "Assignment Tracker", path: "/assignments" },
    { label: "Modules", path: "/modules" },
    { label: "Analytics", path: "/analytics" },
    { label: "Focus", path: "/focus" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <aside>
      <header>
        <h2>StudyOS</h2>
      </header>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
