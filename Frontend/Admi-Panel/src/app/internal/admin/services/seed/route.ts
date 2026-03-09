export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";
import { cookies } from "next/headers";

export async function POST() {
  const token = (await cookies()).get("admin_token")?.value || "";
  const res = await fetch(`${API_BASE}/services/seed`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (res.ok) return NextResponse.json(JSON.parse(text));

  if (res.status === 404) {
    const samples = [
      { name: "Phone Repair", slug: "phone-repair", description: "Screen replacement, battery, charging port", price: 300, category: "Repairs", duration: "1-2 hours", image: "", features: ["Genuine parts", "90-day warranty"], isActive: true },
      { name: "Laptop Repair", slug: "laptop-repair", description: "Diagnostics, keyboard, screen, malware removal", price: 500, category: "Repairs", duration: "2-4 hours", image: "", features: ["Expert technicians"], isActive: true },
      { name: "Data Recovery", slug: "data-recovery", description: "Recover data from devices and storage", price: 500, category: "Support", duration: "24-48 hours", image: "", features: ["Secure handling"], isActive: true },
      { name: "Software Installation", slug: "software-installation", description: "OS and app installation and updates", price: 200, category: "Installation", duration: "1-2 hours", image: "", features: ["Licensed software"], isActive: true },
    ];
    let created = 0;
    for (const s of samples) {
      const r = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (r.ok) created++;
    }
    return NextResponse.json({ success: true, count: created });
  }

  return NextResponse.json({ error: text || "Failed to seed services" }, { status: res.status });
}
