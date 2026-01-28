// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import ActivityTable from "./components/ActivityTable";
import Transactions from "./components/Transactions";
import { seed } from "./data/seed";
import { formatMoney } from "./utils/format";

function PageShell({ title, subtitle, children }) {
  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function AnalyticsPage({ data, range }) {
  return (
    <div className="grid content">
      <div className="card span-3">
        <div className="cardHeader">
          <div>
            <h2>Analytics</h2>
            <p className="muted">Revenue trend + quick notes</p>
          </div>
          <span className="pill">Range: {range}</span>
        </div>
        <RevenueChart series={data.revenue[range]} />
      </div>

      <PageShell
        title="Notes"
        subtitle="This is where you’d put funnels, cohorts, etc."
      >
        <div className="muted" style={{ lineHeight: 1.6 }}>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            <li>Top plan by revenue: Team</li>
            <li>Most common status: Active</li>
            <li>Next step: hook real API + real charts</li>
          </ul>
        </div>
      </PageShell>
    </div>
  );
}

function UsersPage({ users, query }) {
  return (
    <div className="grid content">
      <div className="card span-3">
        <div className="cardHeader">
          <div>
            <h2>Users</h2>
            <p className="muted">
              Search: <b>{query || "—"}</b>
            </p>
          </div>
          <span className="pill">Total: {users.length}</span>
        </div>
        <ActivityTable rows={users} />
      </div>
    </div>
  );
}

function OrdersPage({ transactions }) {
  return (
    <div className="grid content">
      <div className="card span-3">
        <div className="cardHeader">
          <div>
            <h2>Orders</h2>
            <p className="muted">Latest transactions (placeholder for orders)</p>
          </div>
          <button
            className="btnGhost"
            onClick={() => alert("Coming next: orders table + filters")}
          >
            Add filters
          </button>
        </div>
        <Transactions items={transactions} />
      </div>
    </div>
  );
}

function SettingsPage({ theme, setTheme }) {
  return (
    <div className="grid content">
      <PageShell title="Settings" subtitle="Basic toggles (expand as you like)">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            Toggle theme (currently {theme})
          </button>

          <button
            className="btnGhost"
            onClick={() => alert("Add profile/settings form here")}
          >
            Profile (placeholder)
          </button>
        </div>
      </PageShell>
    </div>
  );
}

function OverviewPage({ data, kpis, range }) {
  return (
    <>
      <section className="grid kpis">
        <StatCard
          title="Revenue"
          value={formatMoney(kpis.revenue)}
          delta={+12.4}
          icon="💸"
          hint="Total revenue"
        />
        <StatCard
          title="Orders"
          value={kpis.orders.toLocaleString()}
          delta={+6.1}
          icon="🧾"
          hint="Completed checkouts"
        />
        <StatCard
          title="Active Users"
          value={kpis.users.toLocaleString()}
          delta={+3.7}
          icon="🧑‍💻"
          hint="Monthly active"
        />
        <StatCard
          title="Churn"
          value={`${kpis.churn.toFixed(1)}%`}
          delta={-0.6}
          icon="🧯"
          hint="Lower is better"
          invertDelta
        />
      </section>

      <section className="grid content">
        <div className="card span-2">
          <div className="cardHeader">
            <div>
              <h2>Revenue</h2>
              <p className="muted">Trend for selected range</p>
            </div>
            <div className="pillRow">
              <span className="pill">Range: {range}</span>
              <span className="pill">
                Forecast: {formatMoney(Math.round(kpis.revenue * 1.08))}
              </span>
            </div>
          </div>
          <RevenueChart series={data.revenue[range]} />
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2>Transactions</h2>
              <p className="muted">Latest activity</p>
            </div>
            <button
              className="btnGhost"
              onClick={() => alert("Pretend we exported a CSV 😄")}
            >
              Export
            </button>
          </div>
          <Transactions items={data.transactions} />
        </div>

        <div className="card span-3">
          <div className="cardHeader">
            <div>
              <h2>Users</h2>
              <p className="muted">Recent users</p>
            </div>
            <span className="pill">Tip: use the search box</span>
          </div>
          <ActivityTable rows={data.users} />
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("dark"); // "light" | "dark"
  const [range, setRange] = useState("30d"); // 7d, 30d, 90d

  // ✅ Apply theme to <html> so body background + everything inherits vars correctly
  useEffect(() => {
    const root = document.documentElement; // <html>
    root.classList.toggle("theme-light", theme === "light");
    root.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  const data = useMemo(() => seed(), []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter((u) => {
      const hay = `${u.name} ${u.email} ${u.plan} ${u.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data.users, query]);

  const rangeMultiplier = range === "7d" ? 0.25 : range === "90d" ? 1.4 : 1;

  const kpis = useMemo(() => {
    const revenue = Math.round(data.kpis.revenue * rangeMultiplier);
    const orders = Math.round(data.kpis.orders * rangeMultiplier);
    const users = Math.round(data.kpis.users * (0.9 + rangeMultiplier * 0.1));
    const churn = Math.max(
      0.5,
      Math.min(
        6.5,
        data.kpis.churn + (range === "7d" ? 0.4 : range === "90d" ? -0.3 : 0)
      )
    );

    return { revenue, orders, users, churn };
  }, [data.kpis, rangeMultiplier, range]);

  return (
    <div className="app">
      <Sidebar active={active} setActive={setActive} />

      <main className="main">
        <Topbar
          query={query}
          setQuery={setQuery}
          theme={theme}
          setTheme={setTheme}
          range={range}
          setRange={setRange}
        />

        {active === "Overview" && (
          <OverviewPage data={data} kpis={kpis} range={range} />
        )}
        {active === "Analytics" && <AnalyticsPage data={data} range={range} />}
        {active === "Users" && (
          <UsersPage users={filteredUsers} query={query} />
        )}
        {active === "Orders" && (
          <OrdersPage transactions={data.transactions} />
        )}
        {active === "Settings" && (
          <SettingsPage theme={theme} setTheme={setTheme} />
        )}

        <footer className="footer">
          <span className="muted">
            Theme is applied on &lt;html&gt; now, so light/dark should be stable ✅
          </span>
        </footer>
      </main>
    </div>
  );
}
