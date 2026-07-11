"use client";

import { useState } from "react";
import { AdminShell, Icon, IconName } from "../components/admin-shell";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

const approvalOptions: ApprovalStatus[] = ["Pending", "Approved", "Rejected"];

const products = [
  { id: "PA001", name: "Fresh Tomato", image: "T", farmer: "Ram Bahadur Thapa", category: "Vegetables", stock: "120 kg", price: "Rs 150/kg", totalPrice: "Rs 18,000" },
  { id: "PA002", name: "Organic Rice", image: "R", farmer: "Sita Adhikari", category: "Grains", stock: "300 kg", price: "Rs 80/kg", totalPrice: "Rs 24,000" },
  { id: "PA003", name: "Mustang Apple", image: "A", farmer: "Bishnu Gurung", category: "Fruits", stock: "180 kg", price: "Rs 200/kg", totalPrice: "Rs 36,000" },
  { id: "PA004", name: "Green Spinach", image: "S", farmer: "Mina Shrestha", category: "Leafy Greens", stock: "60 kg", price: "Rs 80/kg", totalPrice: "Rs 4,800" },
  { id: "PA005", name: "Red Potato", image: "P", farmer: "Deepak Yadav", category: "Vegetables", stock: "450 kg", price: "Rs 70/kg", totalPrice: "Rs 31,500" },
];

const initialApprovalStatuses: Record<string, ApprovalStatus> = Object.fromEntries(
  products.map((product) => [product.id, "Pending" as ApprovalStatus])
);

export default function ProductApprovalPage() {
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>(initialApprovalStatuses);

  function updateApprovalStatus(id: string, status: ApprovalStatus) {
    setApprovalStatuses((current) => ({ ...current, [id]: status }));
  }

  const approvalStats = [
    { label: "Total Product", value: products.length.toString(), icon: "product" as IconName, tone: "sage" },
    { label: "Pending", value: Object.values(approvalStatuses).filter((status) => status === "Pending").length.toString(), icon: "bell" as IconName, tone: "gold" },
    { label: "Approved", value: Object.values(approvalStatuses).filter((status) => status === "Approved").length.toString(), icon: "approval" as IconName, tone: "lime" },
    { label: "Rejected", value: Object.values(approvalStatuses).filter((status) => status === "Rejected").length.toString(), icon: "x" as IconName, tone: "mint" },
  ];

  return (
    <AdminShell
      title="Product Approval"
      subtitle="Review submitted products and update their approval status."
    >
      <section className="metric-grid farmer-summary" aria-label="Product approval summary">
        {approvalStats.map((stat) => (
          <article className="metric-box" key={stat.label}>
            <div className={`metric-symbol ${stat.tone}`}><Icon name={stat.icon}/></div>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-card product-approval-card">
        <div className="simple-users-heading">
          <h2>Submitted Products</h2>
        </div>

        <div className="table-scroll">
          <table className="product-approval-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Farmer</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="approval-product-cell">
                      <span>{product.image}</span>
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.farmer}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td><strong>{product.price}</strong></td>
                  <td><strong>{product.totalPrice}</strong></td>
                  <td>
                    <select
                      className={`approval-status-select ${approvalStatuses[product.id].toLowerCase()}`}
                      value={approvalStatuses[product.id]}
                      onChange={(event) => updateApprovalStatus(product.id, event.target.value as ApprovalStatus)}
                      aria-label={`Change approval status for ${product.name}`}
                    >
                      {approvalOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
