"use client";

import { useState } from "react";
import { AdminShell, Icon } from "../components/admin-shell";

const users = [
  { name: "Siddhartha Dhakal", email: "admin@agribridge.com", phone: "-", address: "-", orders: [{ id: "5EE05024", date: "3/5/2026", products: 5, status: "Delivered", total: "Rs 1,470.00" }] },
  { name: "Siddhartha Dhakal", email: "dhakalsiddhartha228@gmail.com", phone: "9864208623", address: "Kamalamai, Sindhuli", orders: [{ id: "5EE05025", date: "3/2/2026", products: 3, status: "Delivered", total: "Rs 920.00" }] },
  { name: "Shiva Gautam", email: "gautam@gmail.com", phone: "9864208812", address: "Kathmandu, Gyaneshwor", orders: [{ id: "5EE05026", date: "2/28/2026", products: 2, status: "Processing", total: "Rs 620.00" }] },
  { name: "Binisha Dhakal", email: "binisha1@gmail.com", phone: "9826879175", address: "Sindhuli, Dhakalgaun", orders: [{ id: "5EE05027", date: "2/24/2026", products: 4, status: "Delivered", total: "Rs 1,120.00" }] },
  { name: "Eshant Rokka", email: "drivertest18@gmail.com", phone: "-", address: "-", orders: [] },
  { name: "Prajwal", email: "nevermindbeast90@gmail.com", phone: "-", address: "-", orders: [] },
  { name: "Bibek Shah", email: "beebekshah456@gmail.com", phone: "9875896587", address: "Bhaktapur", orders: [{ id: "5EE05028", date: "2/18/2026", products: 1, status: "Pending", total: "Rs 260.00" }] },
];

type User = (typeof users)[number];

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectedOrders = selectedUser?.orders ?? [];
  const totalProducts = selectedOrders.reduce((sum, order) => sum + order.products, 0);
  const totalSpent = selectedOrders.reduce(
    (sum, order) => sum + Number(order.total.replace(/[^\d.]/g, "")),
    0
  );

  return (
    <AdminShell
      title="User Management"
      subtitle="Manage registered users and view their order history."
    >
      <section className="dashboard-card simple-users-card">
        <div className="simple-users-heading">
          <h2>All Users ({users.length})</h2>
          <div className="simple-users-search">
            <Icon name="search" />
            <input type="search" placeholder="Search name, email, phone, address" aria-label="Search users" />
          </div>
        </div>

        <div className="table-scroll">
          <table className="simple-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.email}-${index}`}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>
                    <button className="view-orders-button" type="button" onClick={() => setSelectedUser(user)}>
                      <Icon name="eye" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="buyer-orders-title">
          <button className="detail-backdrop" type="button" aria-label="Close buyer details" onClick={() => setSelectedUser(null)} />
          <section className="dashboard-card buyer-orders-panel">
            <div className="buyer-orders-header">
              <h2 id="buyer-orders-title">{selectedUser.name}&apos;s Orders</h2>
              <button type="button" aria-label="Close buyer details" onClick={() => setSelectedUser(null)}>
                <Icon name="x" />
              </button>
            </div>

            <div className="buyer-order-stats">
              <div><span>Total Orders</span><strong>{selectedOrders.length}</strong></div>
              <div><span>Total Products</span><strong>{totalProducts}</strong></div>
              <div><span>Total Spent</span><strong>Rs {totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
            </div>

            <p className="delivered-count">Order Information</p>

            <div className="table-scroll">
              <table className="buyer-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrders.length > 0 ? selectedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.products}</td>
                      <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td><strong>{order.total}</strong></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5}>No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
