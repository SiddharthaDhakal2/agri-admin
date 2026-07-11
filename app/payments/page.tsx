"use client";

import { AdminShell, Icon, IconName } from "../components/admin-shell";

const payments = [
  { id: "PAY001", buyer: "Siddhartha Dhakal", amount: "Rs 1,470.00", method: "Khalti", date: "3/5/2026", status: "Success" },
  { id: "PAY002", buyer: "Aayush Dhakal", amount: "Rs 620.00", method: "eSewa", date: "2/28/2026", status: "Pending" },
  { id: "PAY003", buyer: "Bidhan Koirala", amount: "Rs 620.00", method: "Wallet", date: "2/27/2026", status: "Failed" },
  { id: "PAY004", buyer: "Pratiksha Shrestha", amount: "Rs 980.00", method: "Khalti", date: "2/26/2026", status: "Success" },
  { id: "PAY005", buyer: "Nabin Rai", amount: "Rs 760.00", method: "eSewa", date: "2/25/2026", status: "Success" },
  { id: "PAY006", buyer: "Bibek Shah", amount: "Rs 350.00", method: "Wallet", date: "2/24/2026", status: "Pending" },
];

const paymentStats = [
  { label: "Total Revenue", value: "Rs 4,800.00", icon: "payments" as IconName, tone: "mint" },
  { label: "Today Revenue", value: "Rs 1,470.00", icon: "trendUp" as IconName, tone: "blue" },
  { label: "Khalti", value: "Rs 2,450.00", logo: "K", tone: "khalti" },
  { label: "eSewa", value: "Rs 1,380.00", logo: "e", tone: "esewa" },
  { label: "Wallet", value: "Rs 970.00", icon: "wallet" as IconName, tone: "gold" },
];

export default function PaymentsPage() {
  return (
    <AdminShell
      title="Payments"
      subtitle="Track payment revenue, methods, and transaction status."
    >
      <section className="metric-grid payment-summary" aria-label="Payment summary">
        {paymentStats.map((stat) => (
          <article className="metric-box" key={stat.label}>
            <div className={`metric-symbol ${stat.tone}`}>
              {"logo" in stat ? <span className="payment-logo-mark">{stat.logo}</span> : <Icon name={stat.icon}/>}
            </div>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-card payments-card">
        <div className="simple-users-heading">
          <h2>Payment Details</h2>
        </div>

        <div className="table-scroll">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td><strong>{payment.id}</strong></td>
                  <td>{payment.buyer}</td>
                  <td><strong>{payment.amount}</strong></td>
                  <td><span className={`payment-method ${payment.method.toLowerCase()}`}>{payment.method}</span></td>
                  <td>{payment.date}</td>
                  <td><span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
