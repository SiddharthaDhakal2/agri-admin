"use client";
import { useState } from "react";
import { AdminShell, Icon, IconName } from "../components/admin-shell";
import { useAdminApi } from "../lib/api";
type Method="Wallet"|"Khalti"|"eSewa"|"Cash on Delivery";
type Report={summary:{total:number;today:number;Khalti:number;eSewa:number;Wallet:number;"Cash on Delivery":number};payments:Array<{_id:string;paymentId:string;buyer?:{name:string};amount:number;method:string;createdAt:string;status:string}>};
export default function PaymentsPage(){
  const{data,loading,error}=useAdminApi<Report>("/admin/payments",{summary:{total:0,today:0,Khalti:0,eSewa:0,Wallet:0,"Cash on Delivery":0},payments:[]});
  const[methodFilter,setMethodFilter]=useState<"all"|Method>("all");
  const stats=[{label:"Total Revenue",value:data.summary.total,icon:"payments" as IconName,tone:"mint"},{label:"Today Revenue",value:data.summary.today,icon:"trendUp" as IconName,tone:"blue"},{label:"Wallet",value:data.summary.Wallet,icon:"wallet" as IconName,tone:"gold"},{label:"Khalti",value:data.summary.Khalti,icon:"wallet" as IconName,tone:"khalti"},{label:"eSewa",value:data.summary.eSewa,icon:"wallet" as IconName,tone:"esewa"},{label:"Cash on Delivery",value:data.summary["Cash on Delivery"],icon:"wallet" as IconName,tone:"gold"}];
  const filteredPayments=data.payments.filter(p=>methodFilter==="all"||p.method===methodFilter);
  return <AdminShell title="Payments" subtitle="Track payment revenue, methods, and transaction status.">
    <section className="metric-grid payment-summary">{stats.map(s=><article className="metric-box" key={s.label}><div className={`metric-symbol ${s.tone}`}><Icon name={s.icon}/></div><span>{s.label}</span><strong>Rs {s.value.toLocaleString("en-IN")}</strong></article>)}</section>
    <section className="dashboard-card payments-card"><div className="simple-users-heading"><h2>Payment Details</h2><select value={methodFilter} onChange={e=>setMethodFilter(e.target.value as "all"|Method)} className="withdrawal-role-select" aria-label="Filter by payment method"><option value="all">All Methods</option><option value="Wallet">Wallet</option><option value="Khalti">Khalti</option><option value="eSewa">eSewa</option><option value="Cash on Delivery">Cash on Delivery</option></select></div><div className="table-scroll"><table className="payments-table"><thead><tr><th>ID</th><th>Buyer</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead><tbody>{filteredPayments.map(p=><tr key={p._id}><td><strong>{p.paymentId}</strong></td><td>{p.buyer?.name||"Buyer"}</td><td><strong>Rs {p.amount.toLocaleString("en-IN")}</strong></td><td><span className={`payment-method ${p.method.toLowerCase().replaceAll(" ","-")}`}>{p.method}</span></td><td>{new Date(p.createdAt).toLocaleDateString()}</td><td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td></tr>)}</tbody></table></div>{!filteredPayments.length&&<p style={{padding:24,textAlign:"center"}}>{loading?"Loading payments...":error||(data.payments.length?"No payments match this filter.":"No payments recorded.")}</p>}</section>
  </AdminShell>;
}
