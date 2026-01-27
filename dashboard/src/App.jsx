import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import StatCard from "./components/StatCard.jsx";
import RevenueChart from "./components/RevenueChart.jsx";
import ActivityTable from "./components/ActivityTable.jsx";
import Transactions from "./components/Transactions.jsx";
import { seed } from "./data/seed.js";
import { formatMoney } from "./utils/format.js";

export default function App() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("dark"); // "light" | "dark"
  const [range, setRange] = useState("30d"); // 7d, 30d, 90d

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
    const churn = Math.max(0.5, Math.min(6.5, data.kpis.churn + (range === "7d" ? 0.4 : range === "90d" ? -0.3 : 0)));

    return { revenue, orders, users, churn };
  }, [data.kpis, rangeMultiplier, range]);

  return (
    <div className={`app theme-${theme}`}>
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
                <span className="pill">Goal: {formatMoney(120000)}</span>
                <span className="pill">Forecast: {formatMoney(Math.round(kpis.revenue * 1.08))}</span>
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
              <button className="btnGhost" onClick={() => alert("Pretend we exported a CSV ")}>
                Export
              </button>
            </div>
            <Transactions items={data.transactions} />
          </div>

          <div className="card span-3">
            <div className="cardHeader">
              <div>
                <h2>Users</h2>
                <p className="muted">
                  Showing <b>{filteredUsers.length}</b> of {data.users.length}
                </p>
              </div>
              <div className="rightTools">
                <span className="pill">Sort: Most recent</span>
              </div>
            </div>

            <ActivityTable rows={filteredUsers} />
          </div>
        </section>

        <footer className="footer">
          <span className="muted">work in progress</span>
        </footer>
      </main>
    </div>
  );
}
