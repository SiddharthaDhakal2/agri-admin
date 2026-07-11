"use client";

import { useState } from "react";
import { AdminShell, Icon, IconName } from "../components/admin-shell";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
type OrderItem = { product: string; price: string; quantity: number; subtotal: string };

const statusOptions: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const orders = [
  { id: "5EE05024", customer: "Siddhartha Dhakal", email: "siddharthadhakal458@gmail.com", phone: "9864208623", address: "Kamalamai, Sindhuli", date: "3/5/2026", items: "2 item(s)", total: "Rs 1470.00", orderItems: [{ product: "Orange", price: "Rs 250.00", quantity: 3, subtotal: "Rs 750.00" }, { product: "Tomato", price: "Rs 120.00", quantity: 6, subtotal: "Rs 720.00" }] },
  { id: "0E6CC014", customer: "hs", email: "h@gmail.com", phone: "-", address: "-", date: "3/1/2026", items: "1 item(s)", total: "Rs 220.00", orderItems: [{ product: "Potato", price: "Rs 110.00", quantity: 2, subtotal: "Rs 220.00" }] },
  { id: "E648BC76", customer: "Siddhartha Dhakal", email: "dhakalsiddhartha228@gmail.com", phone: "9864208623", address: "Kamalamai, Sindhuli", date: "2/28/2026", items: "1 item(s)", total: "Rs 420.00", orderItems: [{ product: "Apple", price: "Rs 210.00", quantity: 2, subtotal: "Rs 420.00" }] },
  { id: "282AC2FB", customer: "Aayush Dhakal", email: "siddharthadhakal458@gmail.com", phone: "9841001122", address: "Bhaktapur", date: "2/28/2026", items: "1 item(s)", total: "Rs 620.00", orderItems: [{ product: "Rice", price: "Rs 310.00", quantity: 2, subtotal: "Rs 620.00" }] },
  { id: "625D8697", customer: "Bidhan Koirala", email: "koirala0@gmail.com", phone: "9826879175", address: "Sindhuli, Dhakalgaun", date: "2/27/2026", items: "1 item(s)", total: "Rs 620.00", orderItems: [{ product: "Wheat", price: "Rs 100.00", quantity: 2, subtotal: "Rs 200.00" }] },
  { id: "74DA120B", customer: "Pratiksha Shrestha", email: "pratiksha@agri.np", phone: "9818904155", address: "Lalitpur-10", date: "2/26/2026", items: "3 item(s)", total: "Rs 980.00", orderItems: [{ product: "Banana", price: "Rs 140.00", quantity: 7, subtotal: "Rs 980.00" }] },
  { id: "9C72A011", customer: "Nabin Rai", email: "nabin@agri.np", phone: "9852671440", address: "Dharan-5", date: "2/25/2026", items: "2 item(s)", total: "Rs 760.00", orderItems: [{ product: "Apple", price: "Rs 190.00", quantity: 4, subtotal: "Rs 760.00" }] },
  { id: "A81B3042", customer: "Bibek Shah", email: "bibek@agri.np", phone: "9875896587", address: "Bhaktapur", date: "2/24/2026", items: "1 item(s)", total: "Rs 350.00", orderItems: [{ product: "Cauliflower", price: "Rs 175.00", quantity: 2, subtotal: "Rs 350.00" }] },
  { id: "B41D9801", customer: "Mina Karki", email: "mina@agri.np", phone: "9800001111", address: "Kathmandu", date: "2/23/2026", items: "4 item(s)", total: "Rs 1,250.00", orderItems: [{ product: "Organic Tomatoes", price: "Rs 125.00", quantity: 10, subtotal: "Rs 1,250.00" }] },
  { id: "C20A67E8", customer: "Anil Thapa", email: "anil@agri.np", phone: "9812345678", address: "Pokhara", date: "2/22/2026", items: "2 item(s)", total: "Rs 540.00", orderItems: [{ product: "Spinach", price: "Rs 90.00", quantity: 6, subtotal: "Rs 540.00" }] },
  { id: "D94C11A0", customer: "Rita Basnet", email: "rita@agri.np", phone: "9845566778", address: "Butwal", date: "2/21/2026", items: "1 item(s)", total: "Rs 300.00", orderItems: [{ product: "Onion", price: "Rs 100.00", quantity: 3, subtotal: "Rs 300.00" }] },
  { id: "E33F90B7", customer: "Kiran Maharjan", email: "kiran@agri.np", phone: "9801122334", address: "Kirtipur", date: "2/20/2026", items: "5 item(s)", total: "Rs 1,840.00", orderItems: [{ product: "Mustang Apple", price: "Rs 230.00", quantity: 8, subtotal: "Rs 1,840.00" }] },
  { id: "F72E5D18", customer: "Suman Lama", email: "suman@agri.np", phone: "9811223344", address: "Dhulikhel", date: "2/19/2026", items: "2 item(s)", total: "Rs 690.00", orderItems: [{ product: "Green Chilli", price: "Rs 115.00", quantity: 6, subtotal: "Rs 690.00" }] },
  { id: "A09B3C72", customer: "Pooja Gurung", email: "pooja@agri.np", phone: "9866442211", address: "Chitwan", date: "2/18/2026", items: "3 item(s)", total: "Rs 870.00", orderItems: [{ product: "Lentil", price: "Rs 290.00", quantity: 3, subtotal: "Rs 870.00" }] },
  { id: "B58F0A24", customer: "Madan Yadav", email: "madan@agri.np", phone: "9855221100", address: "Morang", date: "2/17/2026", items: "1 item(s)", total: "Rs 250.00", orderItems: [{ product: "Coriander", price: "Rs 125.00", quantity: 2, subtotal: "Rs 250.00" }] },
  { id: "C81E4D90", customer: "Sneha Joshi", email: "sneha@agri.np", phone: "9809988776", address: "Lalitpur", date: "2/16/2026", items: "2 item(s)", total: "Rs 480.00", orderItems: [{ product: "Garlic", price: "Rs 160.00", quantity: 3, subtotal: "Rs 480.00" }] },
  { id: "D22A9E31", customer: "Ramesh KC", email: "ramesh@agri.np", phone: "9843214567", address: "Hetauda", date: "2/15/2026", items: "4 item(s)", total: "Rs 1,100.00", orderItems: [{ product: "Rice", price: "Rs 275.00", quantity: 4, subtotal: "Rs 1,100.00" }] },
  { id: "E17C6B53", customer: "Asmita Rai", email: "asmita@agri.np", phone: "9817676767", address: "Dharan", date: "2/14/2026", items: "2 item(s)", total: "Rs 720.00", orderItems: [{ product: "Walnut", price: "Rs 360.00", quantity: 2, subtotal: "Rs 720.00" }] },
];

const initialOrderStatuses: Record<string, OrderStatus> = Object.fromEntries(
  orders.map((order) => [order.id, "Pending" as OrderStatus])
);

type Order = (typeof orders)[number];

export default function OrderManagementPage() {
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>(initialOrderStatuses);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orderStats = [
    { label: "Pending", icon: "bell" as IconName, tone: "gold" },
    { label: "Processing", icon: "orders" as IconName, tone: "sage" },
    { label: "Shipped", icon: "product" as IconName, tone: "mint" },
    { label: "Delivered", icon: "approval" as IconName, tone: "lime" },
    { label: "Cancelled", icon: "x" as IconName, tone: "gold" },
  ].map((stat) => ({
    ...stat,
    value: Object.values(orderStatuses).filter((current) => current === stat.label).length,
  }));

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrderStatuses((current) => ({ ...current, [id]: status }));
  }

  return (
    <AdminShell title="Order Management" subtitle="View and manage customer orders.">
      <section className="metric-grid order-summary" aria-label="Order status summary">
        {orderStats.map((stat) => (
          <article className="metric-box" key={stat.label}>
            <div className={`metric-symbol ${stat.tone}`}><Icon name={stat.icon}/></div>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-card order-management-card">
        <div className="simple-users-heading">
          <h2>All Orders ({orders.length})</h2>
        </div>

        <div className="table-scroll">
          <table className="order-management-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>
                    <strong>{order.customer}</strong>
                    <small>{order.email}</small>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td><strong>{order.total}</strong></td>
                  <td>
                    <select
                      className="order-status-select"
                      value={orderStatuses[order.id]}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                      aria-label={`Change status for order ${order.id}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="view-orders-button" type="button" onClick={() => setSelectedOrder(order)}>
                      <Icon name="eye" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
          <button className="detail-backdrop" type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)} />
          <section className="dashboard-card order-detail-panel">
            <div className="order-detail-header">
              <h2 id="order-detail-title">Order Details</h2>
              <button type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)}>
                <Icon name="x" />
              </button>
            </div>

            <div className="order-detail-summary">
              <div><span>Order ID</span><strong>{selectedOrder.id}</strong></div>
              <div><span>Status</span><strong><span className={`status ${orderStatuses[selectedOrder.id].toLowerCase()}`}>{orderStatuses[selectedOrder.id]}</span></strong></div>
              <div><span>Order Date</span><strong>{selectedOrder.date}</strong></div>
              <div><span>Total Amount</span><strong className="order-total-green">{selectedOrder.total}</strong></div>
            </div>

            <h3 className="order-detail-section-title">Customer Information</h3>
            <div className="order-customer-box">
              <div><span>Name</span><strong>{selectedOrder.customer}</strong></div>
              <div><span>Email</span><strong>{selectedOrder.email}</strong></div>
              <div><span>Phone</span><strong>{selectedOrder.phone}</strong></div>
              <div><span>Delivery Address</span><strong>{selectedOrder.address}</strong></div>
            </div>

            <h3 className="order-detail-section-title">Order Items</h3>
            <div className="table-scroll">
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item: OrderItem) => (
                    <tr key={`${selectedOrder.id}-${item.product}`}>
                      <td>{item.product}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td><strong>{item.subtotal}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
