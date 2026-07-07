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
    <aside className="w-56 min-h-screen bg-ink text-paper flex flex-col shrink-0">
      <header className="px-5 py-6 border-b border-paper/10">
        <h2 className="font-display text-xl tracking-tight">StudyOS</h2>
      </header>
      <nav className="flex-1 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block px-5 py-2.5 font-mono text-sm border-l-4 transition-colors ${
                    isActive
                      ? "border-stamp bg-paper/5 text-paper"
                      : "border-transparent text-paper/60 hover:text-paper hover:bg-paper/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
