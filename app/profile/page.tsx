"use client";

import { useState } from "react";
import { AdminShell } from "../components/admin-shell";

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [mode, setMode] = useState<"light" | "dark">("light");

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
            <h2>Admin User</h2>
            <p>admin@agribridge.com</p>
          </div>
        </div>

        <div className="profile-form-layout">
          <form className="profile-form-section">
            <h3>Account Information</h3>
            <div className="profile-form-grid">
              <label>
                <span>Name</span>
                <input type="text" defaultValue="Admin User" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" defaultValue="admin@agribridge.com" />
              </label>
            </div>
            <button type="button">Save Changes</button>
          </form>

          <form className="profile-form-section">
            <h3>Change Password</h3>
            <div className="profile-form-grid">
              <label>
                <span>Current Password</span>
                <input type="password" placeholder="Enter current password" />
              </label>
              <label>
                <span>New Password</span>
                <input type="password" placeholder="Enter new password" />
              </label>
              <label>
                <span>Confirm Password</span>
                <input type="password" placeholder="Confirm new password" />
              </label>
            </div>
            <button type="button">Update Password</button>
          </form>
        </div>

        <div className="profile-preferences">
          <h3>Preferences</h3>
          <div className="profile-preference-row">
            <div>
              <strong>Notifications</strong>
              <span>Turn admin notifications on or off</span>
            </div>
            <label className="profile-switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.target.checked)}
              />
              <span />
            </label>
          </div>

          <div className="profile-preference-row">
            <div>
              <strong>Mode</strong>
              <span>Choose light or dark appearance</span>
            </div>
            <div className="profile-mode-toggle" aria-label="Appearance mode">
              <button
                type="button"
                className={mode === "light" ? "active" : ""}
                onClick={() => setMode("light")}
              >
                Light
              </button>
              <button
                type="button"
                className={mode === "dark" ? "active" : ""}
                onClick={() => setMode("dark")}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
