"use client";

import { Icon, AdminShell } from "../components/admin-shell";

const products = [
  { name: "Orange", farmer: "Sunny", image: "O", category: "Fruits", price: "Rs 250 / Kg", stock: "177 Kg", status: "In Stock" },
  { name: "Vegetable", farmer: "Sunny", image: "V", category: "Vegetables", price: "Rs 100 / kg", stock: "0 kg", status: "Out Of Stock" },
  { name: "Banana", farmer: "Sunny", image: "B", category: "Fruits", price: "Rs 100 / kg", stock: "48 kg", status: "Low Stock" },
  { name: "Wheat", farmer: "Green Valley", image: "W", category: "Grains", price: "Rs 100 / kg", stock: "794 kg", status: "In Stock" },
  { name: "Apple", farmer: "Sunny Fields", image: "A", category: "Fruits", price: "Rs 300 / Kg", stock: "200 Kg", status: "In Stock" },
  { name: "Organic Tomatoes", farmer: "Green Valley", image: "T", category: "Vegetables", price: "Rs 120 / kg", stock: "104 kg", status: "In Stock" },
];

export default function ProductManagementPage() {
  const totalStockItems = products.reduce((sum, product) => sum + Number.parseInt(product.stock, 10), 0);
  const lowStock = products.filter((product) => product.status === "Low Stock").length;
  const outOfStock = products.filter((product) => product.status === "Out Of Stock").length;

  return (
    <AdminShell
      title="Product Management"
      subtitle="Add, edit, or remove products from your catalog."
    >
      <div className="product-page-actions">
        <button type="button">
          <Icon name="plus" />
          <span>Add Product</span>
        </button>
      </div>

      <section className="metric-grid product-summary" aria-label="Product stock summary">
        <article className="metric-box">
          <div className="metric-symbol blue"><Icon name="trendUp" /></div>
          <span>All Product</span>
          <strong>{totalStockItems}</strong>
        </article>
        <article className="metric-box">
          <div className="metric-symbol yellow"><Icon name="warning" /></div>
          <span>Low Stock</span>
          <strong>{lowStock}</strong>
        </article>
        <article className="metric-box">
          <div className="metric-symbol red"><Icon name="trendDown" /></div>
          <span>Out of Stock</span>
          <strong>{outOfStock}</strong>
        </article>
      </section>

      <section className="dashboard-card product-management-card">
        <div className="table-scroll">
          <table className="product-management-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={`${product.name}-${product.farmer}`}>
                  <td>
                    <div className="catalog-product-cell">
                      <span>{product.image}</span>
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.farmer}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`stock-status ${product.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button type="button" aria-label={`Edit ${product.name}`}><Icon name="edit" /></button>
                      <button type="button" aria-label={`Delete ${product.name}`}><Icon name="trash" /></button>
                    </div>
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
