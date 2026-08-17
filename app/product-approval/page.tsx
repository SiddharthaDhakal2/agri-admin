"use client";
import { useState } from "react";
import { AdminShell, Icon, IconName } from "../components/admin-shell";
import { adminApi, assetUrl, useAdminApi } from "../lib/api";
type Status = "Pending" | "Approved" | "Rejected";
type Product = {
  _id: string;
  productId: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  description?: string;
  approvalStatus: Status;
  reviewNote?: string;
  image?: string;
  createdAt?: string;
  farmer?: { name: string; email?: string; farmName?: string };
};
export default function ProductApprovalPage() {
  const { data: products, setData, refresh, error } = useAdminApi<Product[]>("/products", []);
  const [selected, setSelected] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState("");
  async function update(id: string, status: Status, reviewNote?: string) { await adminApi(`/products/${id}/approval`, { method: "PATCH", body: JSON.stringify({ status, ...(reviewNote ? { reviewNote } : {}) }) }); await refresh(); }
  function handleStatusChange(product: Product, status: Status) {
    if (status === "Rejected") { setRejectTarget(product); setRejectNote(""); setRejectError(""); return; }
    void update(product._id, status);
  }
  async function confirmReject() {
    if (!rejectTarget) return;
    if (!rejectNote.trim()) { setRejectError("Please add a note explaining the rejection."); return; }
    setRejecting(true);
    try {
      await update(rejectTarget._id, "Rejected", rejectNote.trim());
      setRejectTarget(null);
    } finally {
      setRejecting(false);
    }
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi(`/products/${deleteTarget._id}`, { method: "DELETE" });
      setData((current) => current.filter((product) => product._id !== deleteTarget._id));
      setDeleteTarget(null);
      setSelected(null);
    } finally {
      setDeleting(false);
    }
  }
  const stats = [
    { label: "Total Product", value: products.length, icon: "product" as IconName, tone: "sage" },
    { label: "Pending", value: products.filter((p) => p.approvalStatus === "Pending").length, icon: "bell" as IconName, tone: "gold" },
    { label: "Approved", value: products.filter((p) => p.approvalStatus === "Approved").length, icon: "approval" as IconName, tone: "lime" },
    { label: "Rejected", value: products.filter((p) => p.approvalStatus === "Rejected").length, icon: "x" as IconName, tone: "mint" },
  ];
  return <AdminShell title="Product Approval" subtitle="Review submitted products and update their approval status.">
    <section className="metric-grid farmer-summary">{stats.map((stat) => <article className="metric-box" key={stat.label}><div className={`metric-symbol ${stat.tone}`}><Icon name={stat.icon}/></div><span>{stat.label}</span><strong>{stat.value}</strong></article>)}</section>
    <section className="dashboard-card product-approval-card"><div className="simple-users-heading"><h2>Submitted Products</h2></div><div className="table-scroll"><table className="product-approval-table"><thead><tr><th>Product</th><th>Farmer</th><th>Category</th><th>Stock</th><th>Price</th><th>Total Price</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><div className="approval-product-cell">{product.image ? <img src={assetUrl(product.image)} alt={product.name} style={{ width: "34px", height: "34px", borderRadius: "8px", objectFit: "cover" }} /> : <span>{product.name.charAt(0)}</span>}<strong>{product.name}</strong></div></td><td>{product.farmer?.name || "Farmer"}</td><td>{product.category}</td><td>{product.stock} {product.unit}</td><td><strong>Rs {product.price}/{product.unit}</strong></td><td><strong>Rs {(product.stock * product.price).toLocaleString("en-IN")}</strong></td><td><div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><select className={`approval-status-select ${product.approvalStatus.toLowerCase()}`} value={product.approvalStatus} onChange={(event) => handleStatusChange(product, event.target.value as Status)}><option>Pending</option><option>Approved</option><option>Rejected</option></select><button className="table-icon-button" title="View details" onClick={() => setSelected(product)}><Icon name="eye"/></button><button className="table-icon-button" title="Delete product" onClick={() => setDeleteTarget(product)}><Icon name="trash"/></button></div></td></tr>)}</tbody></table></div>{!products.length && <p style={{ padding: 24, textAlign: "center" }}>{error || "No submitted products."}</p>}</section>

    {selected && <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="product-detail-title"><button className="detail-backdrop" type="button" aria-label="Close details" onClick={() => setSelected(null)} /><section className="dashboard-card farmer-detail-panel">
      <div className="detail-header">
        <div className="detail-profile">
          {selected.image ? <img src={assetUrl(selected.image)} alt={selected.name} style={{ width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover" }} /> : <span>{selected.name.charAt(0)}</span>}
          <div><h2 id="product-detail-title">{selected.name}</h2><p>{selected.productId}</p></div>
        </div>
        <button className="detail-close-button" type="button" onClick={() => setSelected(null)}><Icon name="x"/></button>
      </div>
      <dl className="detail-list">
        <div><dt>Farmer</dt><dd>{selected.farmer?.name || "Farmer"}{selected.farmer?.farmName ? ` · ${selected.farmer.farmName}` : ""}</dd></div>
        <div><dt>Farmer Email</dt><dd>{selected.farmer?.email || "Not provided"}</dd></div>
        <div><dt>Category</dt><dd>{selected.category}</dd></div>
        <div><dt>Price</dt><dd>Rs {selected.price}/{selected.unit}</dd></div>
        <div><dt>Stock</dt><dd>{selected.stock} {selected.unit}</dd></div>
        <div><dt>Total Value</dt><dd>Rs {(selected.stock * selected.price).toLocaleString("en-IN")}</dd></div>
        <div><dt>Approval Status</dt><dd>{selected.approvalStatus}</dd></div>
        <div><dt>Submitted</dt><dd>{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "Not available"}</dd></div>
        <div style={{ gridColumn: "1 / -1" }}><dt>Description</dt><dd>{selected.description || "Not provided"}</dd></div>
        {selected.reviewNote && <div style={{ gridColumn: "1 / -1" }}><dt>Review Note</dt><dd>{selected.reviewNote}</dd></div>}
      </dl>
    </section></div>}

    {rejectTarget && <div className="logout-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="reject-product-title"><button className="detail-backdrop" type="button" aria-label="Cancel rejection" onClick={() => !rejecting && setRejectTarget(null)} /><section className="dashboard-card logout-confirm-panel">
      <h2 id="reject-product-title">Reject Product</h2>
      <p>Add a note explaining why &quot;{rejectTarget.name}&quot; is being rejected. The farmer will see this note.</p>
      <div style={{ padding: "0 1.5rem 0.25rem" }}>
        <textarea
          value={rejectNote}
          onChange={(event) => { setRejectNote(event.target.value); if (rejectError) setRejectError(""); }}
          placeholder="e.g. Product images are unclear, please re-upload."
          rows={4}
          style={{ width: "100%", resize: "vertical", padding: "0.65rem 0.75rem", border: "1px solid #dce4d9", borderRadius: "8px", outline: 0, fontFamily: "inherit", fontSize: "0.85rem", color: "#203d31" }}
        />
        {rejectError && <p style={{ margin: "0.5rem 0 0", color: "#b3372d", fontSize: "0.78rem", fontWeight: 600 }}>{rejectError}</p>}
      </div>
      <div className="logout-confirm-actions">
        <button type="button" disabled={rejecting} onClick={() => setRejectTarget(null)}>Cancel</button>
        <button type="button" disabled={rejecting} style={{ border: 0, background: "#e60012", color: "white" }} onClick={() => void confirmReject()}>{rejecting ? "Rejecting..." : "Reject"}</button>
      </div>
    </section></div>}

    {deleteTarget && <div className="logout-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-product-title"><button className="detail-backdrop" type="button" aria-label="Cancel delete" onClick={() => !deleting && setDeleteTarget(null)} /><section className="dashboard-card logout-confirm-panel">
      <h2 id="delete-product-title">Delete Product</h2>
      <p>Are you sure you want to delete &quot;{deleteTarget.name}&quot;? This removes it from the farmer&apos;s listings and the buyer storefront everywhere.</p>
      <div className="logout-confirm-actions">
        <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancel</button>
        <button type="button" disabled={deleting} style={{ border: 0, background: "#e60012", color: "white" }} onClick={() => void confirmDelete()}>{deleting ? "Deleting..." : "Delete"}</button>
      </div>
    </section></div>}
  </AdminShell>;
}
