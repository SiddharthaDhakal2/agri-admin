"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminShell, EmptyManagementSection, Icon, IconName } from "../components/admin-shell";
import { useAdminApi } from "../lib/api";

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

type DashboardData = { metrics: { revenue: number; totalOrders: number; totalProducts: number; pendingApprovals: number; totalFarmers: number; totalBuyers: number }; recentOrders: Array<{ _id: string; orderNumber: string; buyer?: { name: string }; createdAt: string; status: string; total: number; paymentMethod: string; paymentStatus: string }>; pendingProducts: Array<{ _id: string; name: string; farmer?: { name: string; farmName?: string }; createdAt: string }>; monthly: Array<{ _id: { month: number }; count: number }> };

function DashboardContent() {
  const { data } = useAdminApi<DashboardData>("/admin/dashboard", { metrics: { revenue: 0, totalOrders: 0, totalProducts: 0, pendingApprovals: 0, totalFarmers: 0, totalBuyers: 0 }, recentOrders: [], pendingProducts: [], monthly: [] });
  const paidRecentOrders = data.recentOrders.filter((order) => order.paymentMethod === "Cash on Delivery" || order.paymentStatus === "Success" || order.paymentStatus === "Refunded");
  const metrics = [
    { label: "Total Revenue", value: `Rs ${data.metrics.revenue.toLocaleString("en-IN")}`, icon: "payments" as IconName, tone: "mint" },
    { label: "Total Orders", value: data.metrics.totalOrders.toString(), icon: "orders" as IconName, tone: "lime" },
    { label: "Total Products", value: data.metrics.totalProducts.toString(), icon: "product" as IconName, tone: "sage" },
    { label: "Pending Approvals", value: data.metrics.pendingApprovals.toString(), icon: "approval" as IconName, tone: "gold" },
    { label: "Total Farmers", value: data.metrics.totalFarmers.toString(), icon: "farmer" as IconName, tone: "sage" },
    { label: "Total Buyers", value: data.metrics.totalBuyers.toString(), icon: "buyer" as IconName, tone: "lime" },
  ];
  const peak = Math.max(1, ...data.monthly.map((item) => item.count));
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
              {Array.from({ length: 12 }, (_, index) => data.monthly.find((item) => item._id.month === index + 1)?.count || 0).map((count, index) => (
                <div className="bar-column" key={index}><span style={{ height: `${(count / peak) * 100}%` }} /><small>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}</small></div>
              ))}
            </div>
          </div>
        </article>

        <article className="dashboard-card approvals-card">
          <div className="card-heading">
            <div><h2>Product Approvals</h2><p>Products waiting for your review</p></div>
            <span className="approval-count">{data.metrics.pendingApprovals} pending</span>
          </div>
          {data.pendingProducts.map((product, i) => (
            <div className="approval-row" key={product._id}>
              <span className={`product-thumb thumb-${i + 1}`}>{product.name.charAt(0)}</span>
              <div><strong>{product.name}</strong><small>{product.farmer?.farmName || product.farmer?.name || "Farmer"}</small></div>
              <Link href="/product-approval" aria-label={`Review ${product.name}`}>Review <Icon name="arrow"/></Link>
            </div>
          ))}
          <Link href="/product-approval" className="view-all">View all pending products <Icon name="arrow"/></Link>
        </article>
      </section>

      <section className="dashboard-card orders-card">
        <div className="card-heading"><div><h2>Recent Orders</h2></div></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>{paidRecentOrders.map((order) => <tr key={order._id}><td><strong>{order.orderNumber}</strong></td><td>{order.buyer?.name || "Buyer"}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td><td className="order-total"><strong>Rs {order.total.toLocaleString("en-IN")}</strong></td></tr>)}</tbody>
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
