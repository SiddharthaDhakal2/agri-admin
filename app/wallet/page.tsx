"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell, Icon, IconName } from "../components/admin-shell";
import { adminApi, useAdminApi } from "../lib/api";

type WalletSummary = { total: number; byRole: { buyer: number; farmer: number } };
type WalletTransaction = { _id: string; type: "credit" | "debit"; amount: number; reason: string; createdAt: string };
type MyWallet = { balance: number; transactions: WalletTransaction[] };
const nepaliBanks = ["Agricultural Development Bank", "Citizens Bank International", "Everest Bank", "Global IME Bank", "Himalayan Bank", "Kumari Bank", "Laxmi Sunrise Bank", "Machhapuchhre Bank", "Nabil Bank", "Nepal Bank Limited", "Nepal Investment Mega Bank", "NIC Asia Bank", "NMB Bank", "Prabhu Bank", "Rastriya Banijya Bank", "Sanima Bank", "Siddhartha Bank", "Standard Chartered Bank Nepal"];
const money = (amount: number) => `Rs ${amount.toLocaleString("en-IN")}`;
const timeAgo = (dateString: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units: Array<[string, number]> = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [name, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${name}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

function BankCombobox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const matches = nepaliBanks.filter((bank) => bank.toLowerCase().includes(value.toLowerCase()));
  return <div style={{ position: "relative" }}>
    <input
      value={value}
      onChange={(event) => { onChange(event.target.value); setOpen(true); }}
      onFocus={() => setOpen(true)}
      onBlur={() => setTimeout(() => setOpen(false), 150)}
      placeholder="Search bank name"
    />
    {open && matches.length > 0 && <ul className="wallet-bank-dropdown">
      {matches.map((bank) => <li key={bank}>
        <button type="button" className="wallet-bank-option" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(bank); setOpen(false); }}>{bank}</button>
      </li>)}
    </ul>}
  </div>;
}

function WithdrawConfirmModal({ amount, bankName, accountNumber, withdrawing, onCancel, onConfirm }: { amount: number; bankName: string; accountNumber: string; withdrawing: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-withdraw-confirm-title">
    <button className="detail-backdrop" type="button" aria-label="Cancel" onClick={onCancel} />
    <section className="dashboard-card action-confirm-panel">
      <span className="action-confirm-icon reject"><Icon name="trendDown" /></span>
      <h2 id="admin-withdraw-confirm-title">Withdraw from wallet?</h2>
      <p>Rs {amount.toLocaleString("en-IN")} will be withdrawn from your wallet to {bankName} ({accountNumber}).</p>
      <div className="action-confirm-actions">
        <button type="button" className="cancel" disabled={withdrawing} onClick={onCancel}>Cancel</button>
        <button type="button" className="reject" disabled={withdrawing} onClick={onConfirm}>{withdrawing ? "Withdrawing..." : "Withdraw"}</button>
      </div>
    </section>
  </div>;
}

function MyWalletCard() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: myWallet, refresh: refreshMyWallet } = useAdminApi<MyWallet>("/wallet", { balance: 0, transactions: [] });
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<"Khalti" | "eSewa">("Khalti");
  const [toppingUp, setToppingUp] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<"all" | "credit" | "debit">("all");
  const accountNumberValid = /^\d{9,20}$/.test(accountNumber);
  const bankValid = nepaliBanks.includes(bankName);
  const withdrawAmountValid = Number(withdrawAmount) > 0 && Number(withdrawAmount) <= myWallet.balance;
  const verificationStarted = useRef(false);
  const esewaFailed = params.get("failed") === "esewa";
  const returningFromGateway = Boolean(params.get("data")) || Boolean(params.get("pidx")) || esewaFailed;

  useEffect(() => {
    if (verificationStarted.current) return;
    if (esewaFailed) { verificationStarted.current = true; alert("Top-up was not completed on the payment gateway."); router.replace("/wallet"); return; }
    const gatewayData = params.get("data"); const pidx = params.get("pidx");
    if (!gatewayData && !pidx) return;
    verificationStarted.current = true;
    const body = JSON.stringify(gatewayData ? { provider: "eSewa", data: gatewayData } : { provider: "Khalti", pidx });
    const attempt = (retriesLeft: number) => {
      adminApi("/payments/verify", { method: "POST", body })
        .then(() => { alert("Wallet topped up successfully."); void refreshMyWallet(); })
        .catch((error) => {
          // ponytail: eSewa/Khalti sandbox status can briefly lag "COMPLETE" right after redirect; retry a few times before surfacing the error.
          if (retriesLeft > 0) { setTimeout(() => attempt(retriesLeft - 1), 2500); return; }
          alert(error instanceof Error ? error.message : "Top-up could not be verified");
        })
        .finally(() => router.replace("/wallet"));
    };
    attempt(3);
  }, [params, esewaFailed, refreshMyWallet, router]);

  async function topUp() {
    const value = Number(topUpAmount);
    if (!Number.isFinite(value) || value <= 0 || toppingUp) return;
    setToppingUp(true);
    try {
      const result = await adminApi<{ payment: { _id: string } }>("/wallet/topup", { method: "POST", body: JSON.stringify({ amount: value, method: topUpMethod }) });
      const payment = await adminApi<{ payment_url?: string; paymentUrl?: string; fields?: Record<string, string> }>(`/payments/${result.payment._id}/initiate`, { method: "POST" });
      if (topUpMethod === "Khalti" && payment.payment_url) { window.location.assign(payment.payment_url); return; }
      if (topUpMethod === "eSewa" && payment.paymentUrl && payment.fields) { const form = document.createElement("form"); form.method = "POST"; form.action = payment.paymentUrl; Object.entries(payment.fields).forEach(([name, value_]) => { const input = document.createElement("input"); input.type = "hidden"; input.name = name; input.value = value_; form.appendChild(input); }); document.body.appendChild(form); form.submit(); return; }
      throw new Error("Payment provider did not return a checkout URL");
    } catch (error) { alert(error instanceof Error ? error.message : "Top-up could not be started"); } finally { setToppingUp(false); }
  }

  async function withdraw() {
    const value = Number(withdrawAmount);
    if (!Number.isFinite(value) || value <= 0 || !bankName.trim() || !accountNumberValid || withdrawing) return;
    setWithdrawing(true);
    try {
      await adminApi("/wallet/withdraw", { method: "POST", body: JSON.stringify({ amount: value, bankName, accountNumber }) });
      setWithdrawAmount(""); setBankName(""); setAccountNumber("");
      setConfirmingWithdraw(false);
      void refreshMyWallet();
    } catch (error) { alert(error instanceof Error ? error.message : "Withdrawal could not be requested"); } finally { setWithdrawing(false); }
  }

  if (returningFromGateway) return <section className="dashboard-card payments-card" style={{ padding: "2rem", textAlign: "center" }}>Verifying your top-up...</section>;

  const ownTransactions = myWallet.transactions
    .filter((tx) => tx.reason.startsWith("Wallet top-up") || tx.reason.startsWith("Withdraw"))
    .filter((tx) => transactionFilter === "all" || tx.type === transactionFilter);

  return <>
  <section className="dashboard-card payments-card" style={{ padding: "1.5rem" }}>
    <div className="wallet-hero">
      <span className="wallet-hero-icon"><Icon name="wallet" /></span>
      <div>
        <p className="wallet-hero-label">My Wallet Balance</p>
        <p className="wallet-hero-amount">{money(myWallet.balance)}</p>
      </div>
    </div>

    <div className="wallet-columns">
      <div className="wallet-panel">
        <h3><Icon name="trendUp" />Top up via gateway</h3>
        <div className="wallet-panel-body">
          <div className="wallet-panel-row">
            <input type="number" min={1} value={topUpAmount} onChange={(event) => setTopUpAmount(event.target.value)} placeholder="Amount (Rs)" />
            <select value={topUpMethod} onChange={(event) => setTopUpMethod(event.target.value as "Khalti" | "eSewa")}>
              <option>Khalti</option>
              <option>eSewa</option>
            </select>
          </div>
        </div>
        <button className="wallet-button" disabled={!(Number(topUpAmount) > 0) || toppingUp} onClick={() => void topUp()}>{toppingUp ? "Processing..." : "Top Up"}</button>
      </div>

      <div className="wallet-panel">
        <h3><Icon name="trendDown" />Withdraw to bank</h3>
        <div className="wallet-panel-body">
          <input type="number" min={1} max={myWallet.balance} value={withdrawAmount} onChange={(event) => setWithdrawAmount(event.target.value)} placeholder="Amount (Rs)" />
          {withdrawAmount.length > 0 && !withdrawAmountValid && <span className="wallet-error">Enter an amount up to your balance ({money(myWallet.balance)}).</span>}
          <BankCombobox value={bankName} onChange={setBankName} />
          {bankName.length > 0 && !bankValid && <span className="wallet-error">Select a bank from the list.</span>}
          <input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, ""))} placeholder="Account number" inputMode="numeric" maxLength={20} />
          {accountNumber.length > 0 && !accountNumberValid && <span className="wallet-error">Account number must be 9-20 digits.</span>}
        </div>
        <button className="wallet-button" disabled={!withdrawAmountValid || !bankValid || !accountNumberValid || withdrawing} onClick={() => setConfirmingWithdraw(true)}>{withdrawing ? "Submitting..." : "Withdraw"}</button>
      </div>
    </div>

    {confirmingWithdraw && <WithdrawConfirmModal
      amount={Number(withdrawAmount) || 0}
      bankName={bankName}
      accountNumber={accountNumber}
      withdrawing={withdrawing}
      onCancel={() => setConfirmingWithdraw(false)}
      onConfirm={() => void withdraw()}
    />}
  </section>

  <section className="dashboard-card payments-card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
    <div className="wallet-transactions">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16281f" }}>Transaction Details</h3>
        <select value={transactionFilter} onChange={(event) => setTransactionFilter(event.target.value as "all" | "credit" | "debit")} className="withdrawal-role-select" aria-label="Filter transactions">
          <option value="all">All</option>
          <option value="credit">Top Up</option>
          <option value="debit">Withdraw</option>
        </select>
      </div>
      <div>
        {ownTransactions.map((tx) => <div key={tx._id} className="wallet-transaction-row">
          <div className="wallet-transaction-meta">
            <span className={`wallet-transaction-icon ${tx.type}`}><Icon name={tx.type === "credit" ? "trendUp" : "trendDown"} /></span>
            <div>
              <p className="wallet-transaction-reason">{tx.reason}</p>
              <p className="wallet-transaction-date">{new Date(tx.createdAt).toLocaleString()} · {timeAgo(tx.createdAt)}</p>
            </div>
          </div>
          <span className={`wallet-transaction-amount ${tx.type}`}>{tx.type === "credit" ? "+" : "-"}{money(tx.amount)}</span>
        </div>)}
        {!ownTransactions.length && <p style={{ padding: "1rem 0", color: "#8a9690", fontSize: "0.8rem" }}>No wallet activity yet.</p>}
      </div>
    </div>
  </section>
  </>;
}

export default function WalletPage() {
  const { data: summary } = useAdminApi<WalletSummary>("/admin/wallet-summary", { total: 0, byRole: { buyer: 0, farmer: 0 } });

  const stats: Array<{ label: string; value: number; icon: IconName; tone: string }> = [
    { label: "Buyer & Farmer Wallets", value: summary.total, icon: "wallet", tone: "mint" },
    { label: "Buyer Wallets", value: summary.byRole.buyer, icon: "wallet", tone: "blue" },
    { label: "Farmer Wallets", value: summary.byRole.farmer, icon: "wallet", tone: "gold" },
  ];

  return <AdminShell title="Wallet" subtitle="Platform-wide wallet balances held by buyers and farmers.">
    <section className="metric-grid" aria-label="Wallet summary">{stats.map((s) => <article className="metric-box" key={s.label}><div className={`metric-symbol ${s.tone}`}><Icon name={s.icon} /></div><span>{s.label}</span><strong>Rs {s.value.toLocaleString("en-IN")}</strong></article>)}</section>

    <Suspense fallback={<section className="dashboard-card payments-card" style={{ padding: "2rem", textAlign: "center" }}>Loading wallet...</section>}>
      <MyWalletCard />
    </Suspense>
  </AdminShell>;
}
