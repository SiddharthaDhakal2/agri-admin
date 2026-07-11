"use client";

import { useState } from "react";
import { AdminShell, Icon, IconName } from "../components/admin-shell";

type FarmerStatus = "Verified" | "Unverified" | "Suspended";
type ProductStatus = "Pending" | "Approved" | "Rejected";

type ListedProduct = {
  id: string;
  date: string;
  name: string;
  qty: string;
  status: ProductStatus;
  totalPrice: string;
};

type Farmer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  location: string;
  joined: string;
  totalRevenue: string;
  listedProducts: ListedProduct[];
};

const farmers: Farmer[] = [
  { id: "F001", name: "Ram Bahadur Thapa", contact: "9841-224-810", email: "ram.thapa@agri.np", address: "Kavre-4", location: "Kavrepalanchok", joined: "Mar 2, 2026", totalRevenue: "Rs 284,500", listedProducts: [
    { id: "P001", date: "3/5/2026", name: "Tomato", qty: "120 kg", status: "Approved", totalPrice: "Rs 18,000" },
    { id: "P002", date: "3/4/2026", name: "Cauliflower", qty: "80 kg", status: "Pending", totalPrice: "Rs 9,600" },
    { id: "P003", date: "3/2/2026", name: "Green Chilli", qty: "35 kg", status: "Rejected", totalPrice: "Rs 4,200" },
  ] },
  { id: "F002", name: "Sita Adhikari", contact: "9803-612-445", email: "sita.adhikari@agri.np", address: "Bharatpur-8", location: "Chitwan", joined: "Feb 24, 2026", totalRevenue: "Rs 198,200", listedProducts: [
    { id: "P004", date: "3/1/2026", name: "Rice", qty: "300 kg", status: "Approved", totalPrice: "Rs 24,000" },
    { id: "P005", date: "2/27/2026", name: "Mustard Oil", qty: "45 ltr", status: "Pending", totalPrice: "Rs 13,500" },
  ] },
  { id: "F003", name: "Bishnu Gurung", contact: "9867-908-332", email: "bishnu.gurung@agri.np", address: "Jomsom-2", location: "Mustang", joined: "Feb 18, 2026", totalRevenue: "Rs 352,900", listedProducts: [
    { id: "P006", date: "2/25/2026", name: "Apple", qty: "180 kg", status: "Approved", totalPrice: "Rs 36,000" },
    { id: "P007", date: "2/23/2026", name: "Walnut", qty: "40 kg", status: "Approved", totalPrice: "Rs 28,000" },
  ] },
  { id: "F004", name: "Mina Shrestha", contact: "9818-334-902", email: "mina.shrestha@agri.np", address: "Lalitpur-15", location: "Lalitpur", joined: "Feb 12, 2026", totalRevenue: "Rs 126,750", listedProducts: [
    { id: "P008", date: "2/20/2026", name: "Spinach", qty: "60 kg", status: "Pending", totalPrice: "Rs 4,800" },
    { id: "P009", date: "2/19/2026", name: "Coriander", qty: "22 kg", status: "Rejected", totalPrice: "Rs 3,300" },
  ] },
  { id: "F005", name: "Deepak Yadav", contact: "9852-747-118", email: "deepak.yadav@agri.np", address: "Biratnagar-6", location: "Morang", joined: "Jan 29, 2026", totalRevenue: "Rs 416,300", listedProducts: [
    { id: "P010", date: "2/15/2026", name: "Potato", qty: "450 kg", status: "Approved", totalPrice: "Rs 31,500" },
    { id: "P011", date: "2/14/2026", name: "Onion", qty: "260 kg", status: "Pending", totalPrice: "Rs 20,800" },
  ] },
];

const statusOptions: FarmerStatus[] = ["Unverified", "Verified", "Suspended"];

const initialFarmerStatuses: Record<string, FarmerStatus> = Object.fromEntries(
  farmers.map((farmer) => [farmer.name, "Unverified" as FarmerStatus])
);

export default function FarmerManagementPage() {
  const [farmerStatuses, setFarmerStatuses] = useState<Record<string, FarmerStatus>>(initialFarmerStatuses);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const farmerStats = [
    { label: "All Farmer", value: farmers.length.toString(), icon: "farmer" as IconName, tone: "sage" },
    { label: "Verified", value: Object.values(farmerStatuses).filter((status) => status === "Verified").length.toString(), icon: "approval" as IconName, tone: "lime" },
    { label: "Unverified", value: Object.values(farmerStatuses).filter((status) => status === "Unverified").length.toString(), icon: "profile" as IconName, tone: "gold" },
    { label: "Suspended", value: Object.values(farmerStatuses).filter((status) => status === "Suspended").length.toString(), icon: "bell" as IconName, tone: "mint" },
  ];

  function updateFarmerStatus(name: string, status: FarmerStatus) {
    setFarmerStatuses((current) => ({ ...current, [name]: status }));
  }

  return (
    <AdminShell
      title="Farmer Management"
      subtitle="Manage farmer records, verification, listings, and account status."
    >
      <section className="metric-grid farmer-summary" aria-label="Farmer management summary">
        {farmerStats.map((stat) => (
          <article className="metric-box" key={stat.label}>
            <div className={`metric-symbol ${stat.tone}`}><Icon name={stat.icon}/></div>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section>
        <article className="dashboard-card farmer-directory">
          <div className="card-heading">
            <div>
              <h2>Farmer Directory</h2>
              <p>Review farmer records, verification status, and active product listings.</p>
            </div>
          </div>

          <div className="farmer-toolbar" aria-label="Farmer filters">
            {["All Farmer", "Verified", "Unverified", "Suspended"].map((filter, index) => (
              <button className={index === 0 ? "active" : ""} key={filter}>{filter}</button>
            ))}
          </div>

          <div className="table-scroll">
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr key={farmer.name}>
                    <td>
                      <div className="farmer-cell">
                        <span>{farmer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                        <div><strong>{farmer.name}</strong></div>
                      </div>
                    </td>
                    <td>{farmer.contact}</td>
                    <td>{farmer.location}</td>
                    <td>{farmer.joined}</td>
                    <td>
                      <span className={`status ${farmerStatuses[farmer.name].toLowerCase()}`}>
                        {farmerStatuses[farmer.name]}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-icon-button"
                        type="button"
                        aria-label={`View ${farmer.name}`}
                        onClick={() => setSelectedFarmer(farmer)}
                      >
                        <Icon name="eye"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {selectedFarmer && (
        <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="farmer-detail-title">
          <button className="detail-backdrop" type="button" aria-label="Close farmer details" onClick={() => setSelectedFarmer(null)} />
          <section className="dashboard-card farmer-detail-panel">
            <div className="detail-header">
              <div className="detail-profile">
                <span>{selectedFarmer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                <div>
                  <h2 id="farmer-detail-title">{selectedFarmer.name}</h2>
                  <p>{selectedFarmer.id}</p>
                  <select
                    className="detail-status-select"
                    value={farmerStatuses[selectedFarmer.name]}
                    onChange={(event) => updateFarmerStatus(selectedFarmer.name, event.target.value as FarmerStatus)}
                    aria-label={`Change status for ${selectedFarmer.name}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="detail-close-button" type="button" aria-label="Close farmer details" onClick={() => setSelectedFarmer(null)}>
                <Icon name="x"/>
              </button>
            </div>

            <dl className="detail-list">
              <div><dt>Total Revenue</dt><dd>{selectedFarmer.totalRevenue}</dd></div>
              <div><dt>Joined Date</dt><dd>{selectedFarmer.joined}</dd></div>
              <div><dt>Contact</dt><dd>{selectedFarmer.contact}</dd></div>
              <div><dt>Email</dt><dd>{selectedFarmer.email}</dd></div>
              <div><dt>Address</dt><dd>{selectedFarmer.address}</dd></div>
              <div><dt>Product Listed</dt><dd>{selectedFarmer.listedProducts.length}</dd></div>
            </dl>

            <div className="listed-products">
              <h3>Product Information</h3>
              <div className="table-scroll">
                <table className="product-info-table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFarmer.listedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.date}</td>
                        <td>{product.name}</td>
                        <td>{product.qty}</td>
                        <td><span className={`status ${product.status.toLowerCase()}`}>{product.status}</span></td>
                        <td><strong>{product.totalPrice}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
