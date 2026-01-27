const items = [
  { name: "Overview", icon: "🏠" },
  { name: "Analytics", icon: "📈" },
  { name: "Users", icon: "👥" },
  { name: "Orders", icon: "📦" },
  { name: "Settings", icon: "⚙️" },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">D</div>
        <div>
          <div className="brandName">Dashkit</div>
          <div className="brandTag muted">tiny dashboard</div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => (
          <button
            key={it.name}
            className={`navItem ${active === it.name ? "active" : ""}`}
            onClick={() => setActive(it.name)}
          >
            <span className="navIcon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="navText">{it.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div className="miniCard">
          <div className="miniTitle">Pro tip</div>
          <div className="miniBody muted">
            Search users by name/email/plan/status
          </div>
        </div>
      </div>
    </aside>
  );
}
