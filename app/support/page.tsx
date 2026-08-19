"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell, Icon } from "../components/admin-shell";
import { adminApi, assetUrl, useAdminApi } from "../lib/api";

type Thread = { userId: string; name: string; email?: string; role: "buyer" | "farmer"; profileImage?: string; lastMessage: string; lastMessageAt: string; unread: number };
type SupportMsg = { _id: string; sender: "user" | "admin"; text: string; createdAt: string };

const initials = (name: string) => name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
const timeLabel = (value: string) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export default function SupportPage() {
  const { data: threads, refresh: refreshThreads } = useAdminApi<Thread[]>("/support/threads", []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [thread, setThread] = useState<SupportMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => threads.find((item) => item.userId === activeId) || null, [threads, activeId]);

  const loadThread = async (userId: string) => {
    const messages = await adminApi<SupportMsg[]>(`/support/threads/${userId}`);
    setThread(messages);
  };

  useEffect(() => {
    if (!activeId) return;
    void loadThread(activeId);
    const interval = window.setInterval(() => { void loadThread(activeId); void refreshThreads(); }, 4000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [thread]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setDraft("");
    try {
      await adminApi(`/support/threads/${activeId}`, { method: "POST", body: JSON.stringify({ text }) });
      await loadThread(activeId);
      await refreshThreads();
    } finally { setSending(false); }
  };

  return (
    <AdminShell title="Support" subtitle="Reply to buyers and farmers who asked to talk to a human.">
      <section className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 260px)", minHeight: 480 }}>
          <aside style={{ borderRight: "1px solid #edf0eb", overflowY: "auto" }}>
            {threads.map((item) => (
              <button key={item.userId} type="button" onClick={() => setActiveId(item.userId)} style={{ display: "flex", width: "100%", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", textAlign: "left", border: 0, borderBottom: "1px solid #f4f6f2", background: activeId === item.userId ? "#eef6ea" : "transparent", cursor: "pointer" }}>
                {item.profileImage ? <img src={assetUrl(item.profileImage)} alt={item.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} /> : <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: "50%", background: "#12372a", color: "#a8d65e", fontWeight: 700, flexShrink: 0 }}>{initials(item.name)}</span>}
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontSize: "0.85rem" }}>{item.name}</strong>
                    {item.lastMessageAt && <small style={{ color: "#8a9690", flexShrink: 0 }}>{timeLabel(item.lastMessageAt)}</small>}
                  </span>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <small style={{ color: "#8a9690", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.role === "farmer" ? "Farmer" : "Buyer"} · {item.lastMessage}</small>
                    {item.unread > 0 && <em style={{ background: "#16a34a", color: "white", borderRadius: 999, padding: "0 6px", fontSize: "0.7rem", fontStyle: "normal", flexShrink: 0 }}>{item.unread}</em>}
                  </span>
                </span>
              </button>
            ))}
            {!threads.length && <p style={{ padding: 24, textAlign: "center", color: "#8a9690" }}>No support conversations yet.</p>}
          </aside>

          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            {active ? (
              <>
                <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.85rem 1.25rem", borderBottom: "1px solid #edf0eb" }}>
                  <strong>{active.name}</strong>
                  <small style={{ color: "#8a9690" }}>{active.role === "farmer" ? "Farmer" : "Buyer"} · {active.email}</small>
                </header>
                <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem", background: "#f7f9f5", display: "flex", flexDirection: "column", gap: 10 }}>
                  {thread.map((message) => (
                    <div key={message._id} style={{ display: "flex", justifyContent: message.sender === "admin" ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "75%", borderRadius: 16, padding: "0.6rem 0.9rem", fontSize: "0.85rem", background: message.sender === "admin" ? "#12372a" : "white", color: message.sender === "admin" ? "white" : "#16281f", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
                        <p style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {!thread.length && <p style={{ textAlign: "center", color: "#8a9690", paddingTop: 24 }}>No messages yet.</p>}
                </div>
                <form onSubmit={(event) => { event.preventDefault(); void send(); }} style={{ display: "flex", gap: 8, padding: "0.75rem", borderTop: "1px solid #edf0eb" }}>
                  <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a reply..." style={{ flex: 1, height: 42, borderRadius: 999, border: "1px solid #dce4d9", padding: "0 1rem", outline: "none" }} />
                  <button type="submit" disabled={!draft.trim() || sending} style={{ width: 42, height: 42, borderRadius: "50%", border: 0, background: "#12372a", color: "#a8d65e", cursor: "pointer", opacity: !draft.trim() || sending ? 0.5 : 1 }}><Icon name="arrow" /></button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: "grid", placeItems: "center", color: "#8a9690" }}>Select a conversation to reply.</div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
