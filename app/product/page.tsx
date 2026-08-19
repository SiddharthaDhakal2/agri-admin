"use client";
import { useState } from "react";
import { AdminShell, Icon } from "../components/admin-shell";
import { adminApi, assetUrl, useAdminApi } from "../lib/api";
type Product={_id:string;name:string;category:string;price:number;unit:string;stock:number;image?:string;farmer?:{name:string;farmName?:string}};
export default function ProductPage(){
  const{data:products,setData,refresh,loading,error}=useAdminApi<Product[]>("/admin/products",[]);
  const[deleteTarget,setDeleteTarget]=useState<Product|null>(null);
  const[deleting,setDeleting]=useState(false);
  const[search,setSearch]=useState("");
  const[stockFilter,setStockFilter]=useState<"all"|"In Stock"|"Low Stock"|"Out Of Stock">("all");
  const stockStatus=(p:Product)=>p.stock===0?"Out Of Stock":p.stock<=19?"Low Stock":"In Stock";
  const low=products.filter(p=>p.stock>0&&p.stock<=19).length;
  const inStock=products.filter(p=>p.stock>19).length;
  const query=search.trim().toLowerCase();
  const filteredProducts=products.filter(p=>(stockFilter==="all"||stockStatus(p)===stockFilter)&&(!query||p.name.toLowerCase().includes(query)||(p.farmer?.name||"").toLowerCase().includes(query)));
  async function confirmDelete(){
    if(!deleteTarget)return;
    setDeleting(true);
    try{
      await adminApi(`/products/${deleteTarget._id}`,{method:"DELETE"});
      setData(current=>current.filter(product=>product._id!==deleteTarget._id));
      setDeleteTarget(null);
    }finally{
      setDeleting(false);
    }
  }
  return <AdminShell title="Product Management" subtitle="Manage approved products in the catalog.">
    <section className="metric-grid product-summary"><article className="metric-box"><div className="metric-symbol blue"><Icon name="trendUp"/></div><span>All Product</span><strong>{products.length}</strong></article><article className="metric-box"><div className="metric-symbol mint"><Icon name="check"/></div><span>In Stock</span><strong>{inStock}</strong></article><article className="metric-box"><div className="metric-symbol yellow"><Icon name="warning"/></div><span>Low Stock</span><strong>{low}</strong></article><article className="metric-box"><div className="metric-symbol red"><Icon name="trendDown"/></div><span>Out of Stock</span><strong>{products.filter(p=>p.stock===0).length}</strong></article></section>
    <section className="dashboard-card product-management-card"><div className="simple-users-heading"><h2>Products ({filteredProducts.length})</h2><div className="withdrawal-filter-controls"><label className="simple-users-search"><Icon name="search"/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by product or farmer..."/></label><select value={stockFilter} onChange={e=>setStockFilter(e.target.value as typeof stockFilter)} className="withdrawal-role-select" aria-label="Filter by stock"><option value="all">All Stock</option><option value="In Stock">In Stock</option><option value="Low Stock">Low Stock</option><option value="Out Of Stock">Out of Stock</option></select></div></div><div className="table-scroll"><table className="product-management-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map(p=>{const status=stockStatus(p);return <tr key={p._id}><td><div className="catalog-product-cell">{p.image?<img src={assetUrl(p.image)} alt={p.name} style={{width:"34px",height:"34px",borderRadius:"8px",objectFit:"cover"}}/>:<span>{p.name[0]}</span>}<div><strong>{p.name}</strong><small>{p.farmer?.farmName||p.farmer?.name}</small></div></div></td><td>{p.category}</td><td>Rs {p.price}/{p.unit}</td><td>{p.stock} {p.unit}</td><td><span className={`stock-status ${status.toLowerCase().replaceAll(" ","-")}`}>{status}</span></td><td><div className="product-actions"><button onClick={()=>setDeleteTarget(p)} title="Delete product"><Icon name="trash"/></button></div></td></tr>})}</tbody></table></div>{!filteredProducts.length&&<p style={{padding:24,textAlign:"center"}}>{loading?"Loading products...":error||(products.length?"No products match your search.":"No approved products.")}</p>}</section>

    {deleteTarget && <div className="logout-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-product-title"><button className="detail-backdrop" type="button" aria-label="Cancel delete" onClick={() => !deleting && setDeleteTarget(null)} /><section className="dashboard-card logout-confirm-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.25rem 1.5rem", borderBottom: "1px solid #edf0eb" }}>
        <h2 id="delete-product-title" style={{ margin: 0, padding: 0, border: 0 }}>Delete Product</h2>
        <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "#fde1e1", color: "#e11d48", flexShrink: 0 }}>
          <Icon name="trash" />
        </span>
      </div>
      <p style={{ padding: "1rem 1.5rem 0.25rem" }}>Are you sure you want to delete &quot;{deleteTarget.name}&quot;? This removes it from the farmer&apos;s listings and the buyer storefront everywhere.</p>
      <div className="logout-confirm-actions">
        <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancel</button>
        <button type="button" disabled={deleting} style={{ border: 0, background: "#e60012", color: "white" }} onClick={() => void confirmDelete()}>{deleting ? "Deleting..." : "Delete"}</button>
      </div>
    </section></div>}
  </AdminShell>;
}
