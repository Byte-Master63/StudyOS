import { NavLink } from "react-router-dom";

function Sidebar({ user, onLogout }) {
  const menuItems = [
    { label: "Dashboard", path: "/", icon: "⌂" },
    { label: "Calendar", path: "/calendar", icon: "◫" },
    { label: "Assignments", path: "/assignments", icon: "✓" },
    { label: "Modules", path: "/modules", icon: "◈" },
    { label: "Analytics", path: "/analytics", icon: "↗" },
    { label: "Focus", path: "/focus", icon: "◷" },
    { label: "Study Assistant", path: "/assistant", icon: "✦" },
    { label: "Settings", path: "/settings", icon: "⚙" },
  ];

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-gradient-to-b from-indigo-950 via-violet-900 to-fuchsia-800 text-paper flex-col shrink-0 shadow-xl">
      <header className="px-5 py-6 border-b border-paper/15">
        <h2 className="font-display text-2xl tracking-tight">StudyOS <span className="text-mustard">✦</span></h2>
        {user && (
          <p className="text-xs font-mono text-paper/60 mt-1">{user.username}</p>
        )}
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
                      ? "border-mustard bg-white/15 text-paper"
                      : "border-transparent text-paper/75 hover:text-paper hover:bg-white/10"
                  }`
                }
              >
                <span className="inline-block w-6 text-mustard">{item.icon}</span>{item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={onLogout}
        className="mx-5 mb-6 font-mono text-xs text-paper/60 hover:text-paper text-left"
      >
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
