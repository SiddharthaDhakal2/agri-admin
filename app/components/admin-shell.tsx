"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type IconName =
  | "dashboard" | "farmer" | "buyer" | "approval" | "orders"
  | "product" | "inventory" | "payments" | "ads" | "profile"
  | "logout" | "search" | "bell" | "menu" | "arrow" | "more" | "eye" | "x"
  | "edit" | "trash" | "plus" | "trendUp" | "warning" | "trendDown";

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    farmer: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 5.5c2.8 1.6 5.3 1.6 8 0"/></>,
    buyer: <><circle cx="9" cy="8" r="3.5"/><path d="M3.5 20v-1.2A5.5 5.5 0 0 1 9 13.3a5.4 5.4 0 0 1 3.4 1.2M16 11v6m-3-3h6"/></>,
    approval: <><path d="M6 3h12v18H6z"/><path d="m9 12 2 2 4-5M9 6h6"/></>,
    orders: <><path d="M5 7h14l-1 14H6L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
    product: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/></>,
    inventory: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M9 4v5M15 4v5M8 14h8"/></>,
    payments: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    ads: <><path d="m4 13 14-6v10L4 13Z"/><path d="M7 14v5h4v-3M20 9v6"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    eye: <><path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z"/><circle cx="12" cy="12" r="2.25"/></>,
    x: <path d="M18 6 6 18M6 6l12 12"/>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    trendUp: <><path d="m4 15 5-5 4 4 7-7"/><path d="M15 7h5v5"/></>,
    warning: <><path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v4M12 17h.01"/></>,
    trendDown: <><path d="m4 9 5 5 4-4 7 7"/><path d="M15 17h5v-5"/></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">{paths[name]}</svg>;
}

const navItems: { label: string; icon: IconName; href: string }[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Farmer Management", icon: "farmer", href: "/farmer-management" },
  { label: "User Management", icon: "buyer", href: "/buyer-management" },
  { label: "Product Approval", icon: "approval", href: "/product-approval" },
  { label: "Orders", icon: "orders", href: "/orders" },
  { label: "Product", icon: "product", href: "/product" },
  { label: "Payments", icon: "payments", href: "/payments" },
  { label: "Advertisement", icon: "ads", href: "/advertisement" },
  { label: "Profile", icon: "profile", href: "/profile" },
];

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const active = navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";
  const pageTitle = title ?? active;
  const pageSubtitle = subtitle ?? (
    active === "Dashboard"
      ? "Here's what's happening across Agribridge today."
      : `Manage Agribridge ${active.toLowerCase()} from here.`
  );

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-logo">
          <span className="logo-leaf">A</span>
          <div><strong>Agribridge</strong></div>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={active === item.label ? "active" : ""}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon name={item.icon}/><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link className="logout-button" href="/">
          <Icon name="logout"/><span>Log out</span>
        </Link>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
        <header className="admin-header">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button>
          <strong className="header-title">Admin Dashboard</strong>
          <div className="header-actions">
            <button className="notification" aria-label="Notifications"><Icon name="bell"/><span /></button>
            <div className="admin-user">
              <div><strong>Admin User</strong><small>admin@agribridge.com</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="page-title">
            <div>
              <h1>{pageTitle}</h1>
              <span>{pageSubtitle}</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function EmptyManagementSection({ icon = "dashboard", title }: { icon?: IconName; title: string }) {
  return (
    <section className="section-empty-state">
      <div className="section-empty-icon">
        <Icon name={icon} />
      </div>
      <h2>{title}</h2>
      <p>This section is ready for its management tools and data.</p>
    </section>
  );
}
