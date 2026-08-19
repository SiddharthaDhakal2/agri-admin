"use client";
import { useState } from "react";
import { AdminShell, Icon, IconName } from "../../components/admin-shell";
import { adminApi, useAdminApi } from "../../lib/api";

type Withdrawal = { _id: string; withdrawalId: string; user?: { name: string; role: string; walletBalance: number }; amount: number; bankName: string; accountNumber: string; status: "Pending" | "Completed" | "Rejected"; reference?: string; createdAt: string };

function ResolveConfirmModal({ withdrawal, type, resolving, onCancel, onConfirm }: { withdrawal: Withdrawal; type: "approve" | "reject"; resolving: boolean; onCancel: () => void; onConfirm: (reference: string) => void }) {
  const [reference, setReference] = useState("");
  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="resolve-confirm-title">
    <button className="detail-backdrop" type="button" aria-label="Cancel" onClick={onCancel} />
    <section className="dashboard-card action-confirm-panel">
      <span className={`action-confirm-icon ${type}`}><Icon name={type === "approve" ? "check" : "x"} /></span>
      <h2 id="resolve-confirm-title">{type === "approve" ? "Mark as completed?" : "Reject this request?"}</h2>
      <p>{type === "approve" ? `Confirm that Rs ${withdrawal.amount.toLocaleString("en-IN")} has been transferred to ${withdrawal.user?.name || "this user"}'s ${withdrawal.bankName} account.` : `${withdrawal.user?.name || "This user"}'s wallet will be refunded Rs ${withdrawal.amount.toLocaleString("en-IN")}.`}</p>
      {type === "approve" && <div className="action-confirm-reference">
        <label htmlFor="resolve-reference">Reference (optional)</label>
        <input id="resolve-reference" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Transaction ID, receipt number..." />
      </div>}
      <div className="action-confirm-actions">
        <button type="button" className="cancel" disabled={resolving} onClick={onCancel}>Cancel</button>
        <button type="button" className={type} disabled={resolving} onClick={() => onConfirm(reference)}>{resolving ? "Please wait..." : type === "approve" ? "Mark Completed" : "Reject Request"}</button>
      </div>
    </section>
  </div>;
}

function WithdrawalDetailModal({ withdrawal, onClose }: { withdrawal: Withdrawal; onClose: () => void }) {
  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="withdrawal-detail-title">
    <button className="detail-backdrop" type="button" aria-label="Close details" onClick={onClose} />
    <section className="dashboard-card farmer-detail-panel">
      <div className="detail-header">
        <div className="detail-profile">
          <span>{(withdrawal.user?.name || "U").charAt(0).toUpperCase()}</span>
          <div>
            <h2 id="withdrawal-detail-title">{withdrawal.user?.name || "User"}</h2>
            <p>{withdrawal.withdrawalId} · {withdrawal.user?.role || "user"}</p>
          </div>
        </div>
        <button className="detail-close-button" type="button" onClick={onClose}><Icon name="x" /></button>
      </div>
      <dl className="detail-list">
        <div><dt>Amount</dt><dd>Rs {withdrawal.amount.toLocaleString("en-IN")}</dd></div>
        <div><dt>Wallet Balance</dt><dd>Rs {(withdrawal.user?.walletBalance ?? 0).toLocaleString("en-IN")}</dd></div>
        <div><dt>Status</dt><dd><span className={`status ${withdrawal.status.toLowerCase()}`}>{withdrawal.status}</span></dd></div>
        <div><dt>Bank Name</dt><dd>{withdrawal.bankName}</dd></div>
        <div><dt>Account Number</dt><dd>{withdrawal.accountNumber}</dd></div>
        <div><dt>Requested On</dt><dd>{new Date(withdrawal.createdAt).toLocaleString()}</dd></div>
        <div><dt>Reference</dt><dd>{withdrawal.reference || "Not yet resolved"}</dd></div>
      </dl>
    </section>
  </div>;
}

export default function WithdrawalRequestsPage() {
  const { data: withdrawals, loading, error, refresh } = useAdminApi<Withdrawal[]>("/admin/withdrawals", []);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ withdrawal: Withdrawal; type: "approve" | "reject" } | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "farmer">("all");

  async function resolveWithdrawal(id: string, status: "Completed" | "Rejected", reference?: string) {
    if (resolvingId) return;
    setResolvingId(id);
    try { await adminApi(`/admin/withdrawals/${id}`, { method: "PATCH", body: JSON.stringify({ status, reference }) }); await refresh(); setConfirmTarget(null); }
    catch (reason) { alert(reason instanceof Error ? reason.message : "Could not update withdrawal"); }
    finally { setResolvingId(null); }
  }

  const pending = withdrawals.filter((w) => w.status === "Pending");
  const stats: Array<{ label: string; value: string; icon: IconName; tone: string }> = [
    { label: "Pending Amount", value: `Rs ${pending.reduce((sum, w) => sum + w.amount, 0).toLocaleString("en-IN")}`, icon: "wallet", tone: "khalti" },
    { label: "Pending Requests", value: String(pending.length), icon: "warning", tone: "gold" },
    { label: "Completed", value: String(withdrawals.filter((w) => w.status === "Completed").length), icon: "check", tone: "mint" },
    { label: "Rejected", value: String(withdrawals.filter((w) => w.status === "Rejected").length), icon: "x", tone: "red" },
  ];

  const filtered = withdrawals.filter((w) => {
    const matchesRole = roleFilter === "all" || w.user?.role === roleFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (w.user?.name || "").toLowerCase().includes(query) || w.withdrawalId.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  return <AdminShell title="Withdrawal Requests" subtitle="Review and fulfill buyer and farmer withdrawal requests.">
    <section className="metric-grid farmer-summary" aria-label="Withdrawal summary">{stats.map((s) => <article className="metric-box" key={s.label}><div className={`metric-symbol ${s.tone}`}><Icon name={s.icon} /></div><span>{s.label}</span><strong>{s.value}</strong></article>)}</section>

    <section className="dashboard-card payments-card">
      <div className="simple-users-heading">
        <h2>Withdrawal Requests</h2>
        <div className="withdrawal-filter-controls">
          <label className="simple-users-search">
            <Icon name="search" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or ID..." />
          </label>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as "all" | "buyer" | "farmer")} className="withdrawal-role-select" aria-label="Filter by user type">
            <option value="all">All Users</option>
            <option value="buyer">Buyers</option>
            <option value="farmer">Farmers</option>
          </select>
        </div>
      </div>
      <div className="table-scroll">
        <table className="payments-table">
          <thead><tr><th>ID</th><th>User</th><th>Wallet Balance</th><th>Amount</th><th>Bank Details</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((w) => <tr key={w._id}>
              <td><strong>{w.withdrawalId}</strong></td>
              <td>
                <div className="withdrawal-user-cell">
                  <span className="withdrawal-user-avatar">{(w.user?.name || "U").charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{w.user?.name || "User"}</strong>
                    {w.user?.role && <span className="withdrawal-user-role">{w.user.role}</span>}
                  </div>
                </div>
              </td>
              <td>Rs {(w.user?.walletBalance ?? 0).toLocaleString("en-IN")}</td>
              <td><strong>Rs {w.amount.toLocaleString("en-IN")}</strong></td>
              <td>
                <div className="withdrawal-bank-cell">
                  <strong>{w.bankName}</strong>
                  <span>{w.accountNumber}</span>
                </div>
              </td>
              <td>{new Date(w.createdAt).toLocaleDateString()}</td>
              <td><span className={`status ${w.status.toLowerCase()}`}>{w.status}</span></td>
              <td>
                <div className="withdrawal-actions">
                  <button className="withdrawal-action-button view" onClick={() => setSelected(w)} title="View details" aria-label="View details"><Icon name="eye" /></button>
                  {w.status === "Pending" && <>
                    <button className="withdrawal-action-button approve" disabled={resolvingId === w._id} onClick={() => setConfirmTarget({ withdrawal: w, type: "approve" })} title="Mark completed" aria-label="Mark completed"><Icon name="check" /></button>
                    <button className="withdrawal-action-button reject" disabled={resolvingId === w._id} onClick={() => setConfirmTarget({ withdrawal: w, type: "reject" })} title="Reject" aria-label="Reject"><Icon name="x" /></button>
                  </>}
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {!filtered.length && <p style={{ padding: 24, textAlign: "center" }}>{loading ? "Loading withdrawal requests..." : error || (withdrawals.length ? "No withdrawal requests match your search." : "No withdrawal requests.")}</p>}
    </section>

    {selected && <WithdrawalDetailModal withdrawal={selected} onClose={() => setSelected(null)} />}
    {confirmTarget && <ResolveConfirmModal
      withdrawal={confirmTarget.withdrawal}
      type={confirmTarget.type}
      resolving={resolvingId === confirmTarget.withdrawal._id}
      onCancel={() => setConfirmTarget(null)}
      onConfirm={(reference) => void resolveWithdrawal(confirmTarget.withdrawal._id, confirmTarget.type === "approve" ? "Completed" : "Rejected", confirmTarget.type === "approve" ? (reference || undefined) : undefined)}
    />}
  </AdminShell>;
}
