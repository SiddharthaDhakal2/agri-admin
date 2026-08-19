"use client";
import { useState } from "react";
import { AdminShell, Icon, IconName } from "../../components/admin-shell";
import { adminApi, useAdminApi } from "../../lib/api";

type Farmer = { id: string; name: string; farmName: string; walletBalance: number; totalRevenue: number };
type SettlementRow = { _id: string; farmer?: { _id: string }; payoutAmount: number; status: string };
const COMMISSION_RATE = 0.1;

function SettleConfirmModal({ farmer, amount, settling, onCancel, onConfirm }: { farmer: Farmer; amount: number; settling: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="settle-confirm-title">
    <button className="detail-backdrop" type="button" aria-label="Cancel" onClick={onCancel} />
    <section className="dashboard-card action-confirm-panel">
      <span className="action-confirm-icon approve"><Icon name="wallet" /></span>
      <h2 id="settle-confirm-title">Settle {farmer.name}?</h2>
      <p>Rs {amount.toLocaleString("en-IN")} will be credited to {farmer.name}&apos;s wallet as a settlement payout.</p>
      <div className="action-confirm-actions">
        <button type="button" className="cancel" disabled={settling} onClick={onCancel}>Cancel</button>
        <button type="button" className="approve" disabled={settling} onClick={onConfirm}>{settling ? "Settling..." : "Confirm Settle"}</button>
      </div>
    </section>
  </div>;
}

export default function FarmerSettlementPage() {
  const { data: farmers, loading, error, refresh: refreshFarmers } = useAdminApi<Farmer[]>("/admin/users?role=farmer", []);
  const { data: settlements, refresh: refreshSettlements } = useAdminApi<SettlementRow[]>("/admin/settlements", []);
  const [settleAmounts, setSettleAmounts] = useState<Record<string, string>>({});
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [confirmFarmer, setConfirmFarmer] = useState<Farmer | null>(null);
  const [search, setSearch] = useState("");

  const paidByFarmer = settlements.reduce<Record<string, number>>((result, row) => {
    if (row.status === "Completed" && row.farmer?._id) result[row.farmer._id] = (result[row.farmer._id] || 0) + row.payoutAmount;
    return result;
  }, {});

  async function settle(id: string) {
    const amount = Number(settleAmounts[id]);
    if (!Number.isFinite(amount) || amount <= 0 || settlingId) return;
    setSettlingId(id);
    try {
      await adminApi(`/admin/users/${id}/settle`, { method: "POST", body: JSON.stringify({ amount }) });
      setSettleAmounts((current) => ({ ...current, [id]: "" }));
      await Promise.all([refreshFarmers(), refreshSettlements()]);
      setConfirmFarmer(null);
    } catch (reason) { alert(reason instanceof Error ? reason.message : "Settlement failed"); } finally { setSettlingId(null); }
  }

  const rows = farmers.map((farmer) => {
    const paid = paidByFarmer[farmer.id] || 0;
    const payout = farmer.totalRevenue * (1 - COMMISSION_RATE);
    const pending = Math.max(0, payout - paid);
    return { farmer, paid, pending };
  });

  const totalPending = rows.reduce((sum, row) => sum + row.pending, 0);
  const totalSettled = rows.reduce((sum, row) => sum + row.paid, 0);
  const totalWallet = farmers.reduce((sum, farmer) => sum + farmer.walletBalance, 0);
  const stats: Array<{ label: string; value: string; icon: IconName; tone: string }> = [
    { label: "Total Farmers", value: String(farmers.length), icon: "farmer", tone: "sage" },
    { label: "Pending Payout", value: `Rs ${totalPending.toLocaleString("en-IN")}`, icon: "warning", tone: "gold" },
    { label: "Already Settled", value: `Rs ${totalSettled.toLocaleString("en-IN")}`, icon: "check", tone: "mint" },
    { label: "Farmer Wallets", value: `Rs ${totalWallet.toLocaleString("en-IN")}`, icon: "wallet", tone: "khalti" },
  ];

  const query = search.trim().toLowerCase();
  const filteredRows = rows.filter(({ farmer }) => !query || farmer.name.toLowerCase().includes(query) || farmer.farmName.toLowerCase().includes(query));

  return <AdminShell title="Farmer Settlement" subtitle="Credit a farmer's wallet against their earnings.">
    <section className="metric-grid farmer-summary" aria-label="Settlement summary">{stats.map((s) => <article className="metric-box" key={s.label}><div className={`metric-symbol ${s.tone}`}><Icon name={s.icon} /></div><span>{s.label}</span><strong>{s.value}</strong></article>)}</section>

    <section className="dashboard-card payments-card">
      <div className="simple-users-heading">
        <h2>Farmer Settlements</h2>
        <label className="simple-users-search">
          <Icon name="search" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by farmer or farm name..." />
        </label>
      </div>
      <div className="table-scroll">
        <table className="payments-table">
          <thead><tr><th>Farmer</th><th>Pending Amount</th><th>Already Settled</th><th>Wallet Balance</th><th>Settle Amount</th><th>Action</th></tr></thead>
          <tbody>
            {filteredRows.map(({ farmer, paid, pending }) => <tr key={farmer.id}>
              <td>
                <div className="withdrawal-user-cell">
                  <span className="withdrawal-user-avatar">{farmer.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{farmer.name}</strong>
                    {farmer.farmName && <span className="withdrawal-user-role">{farmer.farmName}</span>}
                  </div>
                </div>
              </td>
              <td><strong>Rs {pending.toLocaleString("en-IN")}</strong></td>
              <td>Rs {paid.toLocaleString("en-IN")}</td>
              <td><strong>Rs {farmer.walletBalance.toLocaleString("en-IN")}</strong></td>
              <td>
                <input type="number" min={1} max={pending} value={settleAmounts[farmer.id] || ""} onChange={(event) => setSettleAmounts((current) => ({ ...current, [farmer.id]: event.target.value }))} placeholder="Amount" className="settlement-amount-input" disabled={pending <= 0} />
                {Number(settleAmounts[farmer.id]) > pending && <div className="wallet-error">Max Rs {pending.toLocaleString("en-IN")}</div>}
              </td>
              <td><button className="settlement-button" disabled={pending <= 0 || !(Number(settleAmounts[farmer.id]) > 0) || Number(settleAmounts[farmer.id]) > pending || settlingId === farmer.id} onClick={() => setConfirmFarmer(farmer)}><Icon name="wallet" />Settle</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {!filteredRows.length && <p style={{ padding: 24, textAlign: "center" }}>{loading ? "Loading farmers..." : error || (farmers.length ? "No farmers match your search." : "No farmers registered.")}</p>}
    </section>

    {confirmFarmer && <SettleConfirmModal
      farmer={confirmFarmer}
      amount={Number(settleAmounts[confirmFarmer.id]) || 0}
      settling={settlingId === confirmFarmer.id}
      onCancel={() => setConfirmFarmer(null)}
      onConfirm={() => void settle(confirmFarmer.id)}
    />}
  </AdminShell>;
}
