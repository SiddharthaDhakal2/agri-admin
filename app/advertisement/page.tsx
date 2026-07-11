"use client";

import { useState } from "react";
import { AdminShell, Icon } from "../components/admin-shell";

type AdvertisementTarget = "Farmer" | "Buyer";

type Advertisement = {
  id: string;
  title: string;
  placement: string;
  target: AdvertisementTarget;
  startDate: string;
  endDate: string;
  budget: string;
};

const emptyAdvertisementForm: Omit<Advertisement, "id"> = {
  title: "",
  placement: "",
  target: "Farmer",
  startDate: "",
  endDate: "",
  budget: "",
};

const initialAdvertisements: Advertisement[] = [
  { id: "AD001", title: "Fresh Harvest Boost", placement: "Dashboard banner", target: "Farmer", startDate: "2026-07-10", endDate: "2026-07-18", budget: "Rs 8,500" },
  { id: "AD002", title: "Weekend Vegetable Deal", placement: "Homepage banner", target: "Buyer", startDate: "2026-07-12", endDate: "2026-07-20", budget: "Rs 7,400" },
  { id: "AD003", title: "Organic Listing Promo", placement: "Product listing tips", target: "Farmer", startDate: "2026-07-14", endDate: "2026-07-24", budget: "Rs 5,200" },
  { id: "AD004", title: "Fresh Fruit Campaign", placement: "Category page card", target: "Buyer", startDate: "2026-07-15", endDate: "2026-07-22", budget: "Rs 4,800" },
  { id: "AD005", title: "Seed Supplier Offer", placement: "Farmer home card", target: "Farmer", startDate: "2026-07-01", endDate: "2026-07-08", budget: "Rs 3,900" },
  { id: "AD006", title: "Local Grains Offer", placement: "Checkout recommendation", target: "Buyer", startDate: "2026-07-02", endDate: "2026-07-09", budget: "Rs 3,100" },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAdvertisementState(startDate: string, endDate: string) {
  const today = startOfDay(new Date());
  const start = startOfDay(new Date(startDate));
  const end = startOfDay(new Date(endDate));

  if (today < start) return "pending";
  if (today > end) return "ended";
  return "running";
}

function formatDuration(startDate: string, endDate: string) {
  if (!startDate || !endDate) return "-";

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const start = new Date(startDate).toLocaleDateString("en-US", options);
  const end = new Date(endDate).toLocaleDateString("en-US", options);

  return `${start} - ${end}`;
}

export default function AdvertisementPage() {
  const [adList, setAdList] = useState<Advertisement[]>(initialAdvertisements);
  const [manualStatuses, setManualStatuses] = useState<Record<string, "Live" | "Pause">>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyAdvertisementForm);

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyAdvertisementForm);
    setFormOpen(true);
  };

  const openEditForm = (advertisement: Advertisement) => {
    setEditingId(advertisement.id);
    setFormData({
      title: advertisement.title,
      placement: advertisement.placement,
      target: advertisement.target,
      startDate: advertisement.startDate,
      endDate: advertisement.endDate,
      budget: advertisement.budget,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormData(emptyAdvertisementForm);
  };

  const saveAdvertisement = () => {
    if (editingId) {
      setAdList((currentAds) => (
        currentAds.map((ad) => ad.id === editingId ? { ...ad, ...formData } : ad)
      ));
    } else {
      setAdList((currentAds) => [
        ...currentAds,
        { id: `AD${String(currentAds.length + 1).padStart(3, "0")}`, ...formData },
      ]);
    }

    closeForm();
  };

  const deleteAdvertisement = (id: string) => {
    setAdList((currentAds) => currentAds.filter((ad) => ad.id !== id));
  };

  const farmerAds = adList.filter((ad) => ad.target === "Farmer").length;
  const buyerAds = adList.filter((ad) => ad.target === "Buyer").length;
  const liveAds = adList.filter((ad) => {
    if (getAdvertisementState(ad.startDate, ad.endDate) !== "running") return false;
    return (manualStatuses[ad.id] ?? "Live") === "Live";
  }).length;

  return (
    <AdminShell
      title="Advertisement"
      subtitle="Manage advertisements for farmers and buyers."
    >
      <div className="advertisement-page-actions">
        <button type="button" onClick={openAddForm}>
          <Icon name="plus" />
          <span>Add Advertisement</span>
        </button>
      </div>

      <section className="metric-grid advertisement-summary" aria-label="Advertisement summary">
        <article className="metric-box">
          <div className="metric-symbol gold"><Icon name="ads" /></div>
          <span>All Advertisement</span>
          <strong>{adList.length}</strong>
        </article>
        <article className="metric-box">
          <div className="metric-symbol sage"><Icon name="farmer" /></div>
          <span>Farmer Target</span>
          <strong>{farmerAds}</strong>
        </article>
        <article className="metric-box">
          <div className="metric-symbol blue"><Icon name="buyer" /></div>
          <span>Buyer Target</span>
          <strong>{buyerAds}</strong>
        </article>
        <article className="metric-box">
          <div className="metric-symbol mint"><Icon name="approval" /></div>
          <span>Live Ads</span>
          <strong>{liveAds}</strong>
        </article>
      </section>

      <section className="dashboard-card advertisement-card">
        <div className="table-scroll">
          <table className="advertisement-table">
            <thead>
              <tr>
                <th>Advertisement</th>
                <th>Target</th>
                <th>Duration</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adList.map((ad) => {
                const adState = getAdvertisementState(ad.startDate, ad.endDate);
                const status = adState === "pending"
                  ? "Pending"
                  : adState === "ended"
                    ? "Pause"
                    : manualStatuses[ad.id] ?? "Live";

                return (
                  <tr key={ad.id}>
                    <td>
                      <div className="advertisement-cell">
                        <span>{ad.title.charAt(0)}</span>
                        <div>
                          <strong>{ad.title}</strong>
                          <small>{ad.placement}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className={`target-badge ${ad.target.toLowerCase()}`}>{ad.target}</span></td>
                    <td>{formatDuration(ad.startDate, ad.endDate)}</td>
                    <td><strong>{ad.budget}</strong></td>
                    <td>
                      {adState === "running" ? (
                        <select
                          className={`advertisement-status-select ${status.toLowerCase()}`}
                          value={status}
                          onChange={(event) => {
                            setManualStatuses((currentStatuses) => ({
                              ...currentStatuses,
                              [ad.id]: event.target.value as "Live" | "Pause",
                            }));
                          }}
                        >
                          <option value="Live">Live</option>
                          <option value="Pause">Pause</option>
                        </select>
                      ) : (
                        <span className={`status ${status.toLowerCase()}`}>{status}</span>
                      )}
                    </td>
                    <td>
                      <div className="product-actions">
                        <button type="button" aria-label={`Edit ${ad.title}`} onClick={() => openEditForm(ad)}><Icon name="edit" /></button>
                        <button type="button" aria-label={`Delete ${ad.title}`} onClick={() => deleteAdvertisement(ad.id)}><Icon name="trash" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {formOpen && (
        <div className="detail-overlay" role="dialog" aria-modal="true" aria-label="Advertisement form">
          <button className="detail-backdrop" type="button" aria-label="Close advertisement form" onClick={closeForm} />
          <section className="dashboard-card advertisement-form-panel">
            <div className="advertisement-form-header">
              <h2>{editingId ? "Edit Advertisement" : "Add Advertisement"}</h2>
            </div>

            <div className="advertisement-form-grid">
              <label>
                <span>Advertisement Name</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  placeholder="Enter advertisement name"
                />
              </label>
              <label>
                <span>Target</span>
                <select
                  value={formData.target}
                  onChange={(event) => setFormData({ ...formData, target: event.target.value as AdvertisementTarget })}
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Buyer">Buyer</option>
                </select>
              </label>
              <label>
                <span>Placement</span>
                <input
                  type="text"
                  value={formData.placement}
                  onChange={(event) => setFormData({ ...formData, placement: event.target.value })}
                  placeholder="Dashboard banner"
                />
              </label>
              <label>
                <span>Start Date</span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                />
              </label>
              <label>
                <span>End Date</span>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                />
              </label>
              <label>
                <span>Budget</span>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
                  placeholder="Rs 5,000"
                />
              </label>
            </div>

            <div className="advertisement-form-actions">
              <button type="button" onClick={closeForm}>Cancel</button>
              <button type="button" onClick={saveAdvertisement}>
                {editingId ? "Save Changes" : "Add Advertisement"}
              </button>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
