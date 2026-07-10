"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type IconName =
  | "dashboard" | "farmer" | "buyer" | "approval" | "orders"
  | "product" | "inventory" | "payments" | "ads" | "profile"
  | "logout" | "search" | "bell" | "menu" | "arrow" | "more";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    farmer: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 5.5c2.8 1.6 5.3 1.6 8 0"/></>,
    buyer: <><circle cx="9" cy="8" r="3.5"/><path d="M3.5 20v-1.2A5.5 5.5 0 0 1 9 13.3a5.4 5.4 0 0 1 3.4 1.2M16 11v6m-3-3h6"/></>,
    approval: <><path d="M6 3h12v18H6z"/><path d="m9 12 2 2 4-5M9 6h6"/></>,
    orders: <><path d="M5 7h14l-1 14H6L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
    product: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/></>,
    inventory: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M9 4v5M15 4v5M8 14h8"/></>,
    payments: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    ads: <><path d="m4 13 14-6v10L4 13Z"/><path d="M7 14v5h4v-3M20 9v6"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">{paths[name]}</svg>;
}

const navItems: { label: string; icon: IconName; href: string }[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Farmer Management", icon: "farmer", href: "/farmer-management" },
  { label: "Buyer Management", icon: "buyer", href: "/buyer-management" },
  { label: "Product Approval", icon: "approval", href: "/product-approval" },
  { label: "Orders", icon: "orders", href: "/orders" },
  { label: "Product", icon: "product", href: "/product" },
  { label: "Inventory", icon: "inventory", href: "/inventory" },
  { label: "Payments", icon: "payments", href: "/payments" },
  { label: "Advertisement", icon: "ads", href: "/advertisement" },
  { label: "Profile", icon: "profile", href: "/profile" },
];

const metrics = [
  { label: "Total Revenue", value: "Rs 8.4M", icon: "payments" as IconName, tone: "mint" },
  { label: "Total Orders", value: "4,892", icon: "orders" as IconName, tone: "lime" },
  { label: "Total Products", value: "1,836", icon: "product" as IconName, tone: "sage" },
  { label: "Pending Approvals", value: "38", icon: "approval" as IconName, tone: "gold" },
  { label: "Total Farmers", value: "2,480", icon: "farmer" as IconName, tone: "sage" },
  { label: "Total Buyers", value: "1,264", icon: "buyer" as IconName, tone: "lime" },
];

const orders = [
  { id: "69a9bfc0", customer: "Siddhartha Dhakal", date: "3/5/2026", status: "Delivered", total: "Rs 1,470.00" },
  { id: "69a3e121", customer: "HS", date: "3/1/2026", status: "Cancelled", total: "Rs 220.00" },
  { id: "69a31747", customer: "Siddhartha Dhakal", date: "2/28/2026", status: "Processing", total: "Rs 420.00" },
  { id: "69a2b795", customer: "Aayush Dhakal", date: "2/28/2026", status: "Cancelled", total: "Rs 620.00" },
  { id: "69a1d3a2", customer: "Bidhan Koirala", date: "2/27/2026", status: "Pending", total: "Rs 620.00" },
];

export default function DashboardPage() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const active = navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-logo">
          <span className="logo-leaf">A</span>
          <div><strong>Agribridge</strong></div>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={active === item.label ? "active" : ""}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon name={item.icon}/><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link className="logout-button" href="/">
          <Icon name="logout"/><span>Log out</span>
        </Link>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
        <header className="admin-header">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button>
          <strong className="header-title">Admin Dashboard</strong>
          <div className="header-actions">
            <button className="notification" aria-label="Notifications"><Icon name="bell"/><span /></button>
            <div className="admin-user">
              <div><strong>Admin User</strong><small>admin@agribridge.com</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="page-title">
            <div>
              <h1>{active}</h1>
              <span>
                {active === "Dashboard"
                  ? "Here's what's happening across Agribridge today."
                  : `Manage Agribridge ${active.toLowerCase()} from here.`}
              </span>
            </div>
          </div>

          {active === "Dashboard" ? <>
          <section className="metric-grid" aria-label="Platform summary">
            {metrics.map((metric) => (
              <article className="metric-box" key={metric.label}>
                <div className={`metric-symbol ${metric.tone}`}><Icon name={metric.icon}/></div>
                <span>{metric.label}</span><strong>{metric.value}</strong>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-card performance-card">
              <div className="card-heading"><div><h2>Order performance</h2><p>Monthly order volume</p></div><button>This year⌄</button></div>
              <div className="chart-wrap">
                <div className="chart-y"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div>
                <div className="bar-chart">
                  {[45, 58, 48, 72, 65, 79, 61, 86, 75, 91, 83, 96].map((height, index) => (
                    <div className="bar-column" key={index}><span style={{ height: `${height}%` }} /><small>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}</small></div>
                  ))}
                </div>
              </div>
            </article>

            <article className="dashboard-card approvals-card">
              <div className="card-heading">
                <div><h2>Product Approvals</h2><p>Products waiting for your review</p></div>
                <span className="approval-count">3 pending</span>
              </div>
              {[["Himalayan Red Apples","Ram Bahadur","2h ago"],["Organic Black Rice","Sita Agro Farm","4h ago"],["Fresh Buffalo Milk","Kavre Dairy","5h ago"]].map(([product, farmer, time], i) => (
                <div className="approval-row" key={product}>
                  <span className={`product-thumb thumb-${i + 1}`}>{product.charAt(0)}</span>
                  <div><strong>{product}</strong><small>{farmer} · {time}</small></div>
                  <button aria-label={`Review ${product}`}>Review <Icon name="arrow"/></button>
                </div>
              ))}
              <button className="view-all">View all pending products <Icon name="arrow"/></button>
            </article>
          </section>

          <section className="dashboard-card orders-card">
            <div className="card-heading"><div><h2>Recent Orders</h2></div></div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.date}</td><td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td><td className="order-total"><strong>{order.total}</strong></td></tr>)}</tbody>
              </table>
            </div>
          </section>
          </> : (
            <section className="section-empty-state">
              <div className="section-empty-icon">
                <Icon name={navItems.find((item) => item.label === active)?.icon ?? "dashboard"} />
              </div>
              <h2>{active}</h2>
              <p>This section is ready for its management tools and data.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
