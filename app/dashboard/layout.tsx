import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Agribridge Admin",
  description: "Agribridge administration dashboard.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
