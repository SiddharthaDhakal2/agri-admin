"use client";

import { usePathname } from "next/navigation";
import { AdminShell, EmptyManagementSection, Icon, IconName } from "../components/admin-shell";

const emptyRouteMeta: Record<string, { title: string; icon: IconName }> = {
  "/buyer-management": { title: "User Management", icon: "buyer" },
  "/product-approval": { title: "Product Approval", icon: "approval" },
  "/orders": { title: "Orders", icon: "orders" },
  "/product": { title: "Product", icon: "product" },
  "/inventory": { title: "Inventory", icon: "inventory" },
  "/payments": { title: "Payments", icon: "payments" },
  "/advertisement": { title: "Advertisement", icon: "ads" },
  "/profile": { title: "Profile", icon: "profile" },
};

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

function DashboardContent() {
  return (
    <>
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
          <div className="card-heading"><div><h2>Order performance</h2><p>Monthly order volume</p></div><button>This year</button></div>
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
              <div><strong>{product}</strong><small>{farmer} - {time}</small></div>
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
    </>
  );
}

export default function DashboardPage() {
  const pathname = usePathname();
  const emptyMeta = emptyRouteMeta[pathname];

  if (emptyMeta) {
    return (
      <AdminShell title={emptyMeta.title}>
        <EmptyManagementSection title={emptyMeta.title} icon={emptyMeta.icon} />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Dashboard" subtitle="Here's what's happening across Agribridge today.">
      <DashboardContent />
    </AdminShell>
  );
}
