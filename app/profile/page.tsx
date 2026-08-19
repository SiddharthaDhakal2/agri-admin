"use client";

import { FormEvent } from "react";
import { AdminShell } from "../components/admin-shell";
import { adminApi, useAdminApi } from "../lib/api";

export default function ProfilePage() {
  const { data: account, refresh } = useAdminApi<{ name: string; email: string }>("/auth/me", { name: "", email: "" });
  async function saveAccount(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); await adminApi("/users/me", { method: "PATCH", body: JSON.stringify({ name: form.get("name") }) }); await refresh(); }
  async function savePassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); if (form.get("newPassword") !== form.get("confirmPassword")) return; await adminApi("/users/me/password", { method: "PATCH", body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }) }); event.currentTarget.reset(); }

  return (
    <AdminShell
      title="Profile"
      subtitle="Manage your admin account information and password."
      hidePageTitle
    >
      <section className="dashboard-card profile-simple-card">
        <div className="profile-simple-hero">
          <span>AU</span>
          <div>
            <h2>{account.name || "Admin User"}</h2>
            <p>{account.email}</p>
          </div>
        </div>

        <div className="profile-form-layout">
          <form className="profile-form-section" onSubmit={saveAccount}>
            <h3>Account Information</h3>
            <div className="profile-form-grid">
              <label>
                <span>Name</span>
                <input name="name" type="text" key={account.name} defaultValue={account.name} required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={account.email} readOnly />
              </label>
            </div>
            <button type="submit">Save Changes</button>
          </form>

          <form className="profile-form-section" onSubmit={savePassword}>
            <h3>Change Password</h3>
            <div className="profile-form-grid">
              <label>
                <span>Current Password</span>
                <input name="currentPassword" type="password" placeholder="Enter current password" required />
              </label>
              <label>
                <span>New Password</span>
                <input name="newPassword" type="password" placeholder="Enter new password" required minLength={6} />
              </label>
              <label>
                <span>Confirm Password</span>
                <input name="confirmPassword" type="password" placeholder="Confirm new password" required minLength={6} />
              </label>
            </div>
            <button type="submit">Update Password</button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}
