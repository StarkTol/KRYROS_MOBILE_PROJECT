"use client";

import { useEffect, useMemo, useState } from "react";
import { DollarSign, ShoppingCart, Users, CreditCard, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Summary = {
  stats: { totalRevenue: number; totalOrders: number; activeUsers: number; creditDisbursed: number };
  recentTransactions: { id: string; customer: string; amount: number; status: string; date: string }[];
};

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [repRes, ordRes] = await Promise.all([
        fetch("/internal/admin/reports/summary?range=month", { cache: "no-store" }),
        fetch("/internal/admin/orders", { cache: "no-store" }),
      ]);
      const [rep, ord] = await Promise.all([repRes.json().catch(()=>null), ordRes.json().catch(()=>[])]);
      if (repRes.ok) setSummary(rep);
      if (ordRes.ok) setOrders(Array.isArray(ord) ? ord : ord?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cards = useMemo(() => {
    const s = summary?.stats;
    return [
      { title: "Revenue (This Month)", value: formatPrice(Number(s?.totalRevenue || 0)), icon: DollarSign, color: "green" },
      { title: "Total Orders", value: (Number(s?.totalOrders || 0)).toLocaleString(), icon: ShoppingCart, color: "blue" },
      { title: "Active Users", value: (Number(s?.activeUsers || 0)).toLocaleString(), icon: Users, color: "purple" },
      { title: "Credit Disbursed", value: formatPrice(Number(s?.creditDisbursed || 0)), icon: CreditCard, color: "orange" },
    ];
  }, [summary]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Live business metrics and recent activity</p>
        </div>
        <button
          onClick={() => { setIsRefreshing(true); load().finally(()=> setTimeout(()=> setIsRefreshing(false),300)); }}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${c.color}-100`}>
                <c.icon className={`h-5 w-5 text-${c.color}-600`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500">{c.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(orders.slice(0,6)).map(o => (
                  <tr key={o.id}>
                    <td className="font-mono">{o.orderNumber}</td>
                    <td>{o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim() || o.user.email : "—"}</td>
                    <td>{formatPrice(Number(o.total))}</td>
                    <td><span className="badge badge-neutral">{o.status}</span></td>
                    <td><span className={`badge ${o.paymentStatus === "PAID" ? "badge-success" : o.paymentStatus === "PENDING" ? "badge-warning" : "badge-danger"}`}>{o.paymentStatus}</span></td>
                    <td className="text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="p-4 text-sm text-slate-500">Loading...</div>}
            {!loading && !orders.length && <div className="p-4 text-sm text-slate-500">No recent orders</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {(summary?.recentTransactions || []).slice(0,6).map(txn => (
              <div key={txn.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{txn.customer}</p>
                  <p className="text-xs text-slate-500">{txn.id} • {txn.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatPrice(Number(txn.amount))}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === "paid" || txn.status === "completed" ? "bg-green-100 text-green-700" : txn.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  }`}>{txn.status}</span>
                </div>
              </div>
            ))}
            {!summary?.recentTransactions?.length && <div className="p-4 text-sm text-slate-500 border border-slate-200 rounded-lg">No transactions</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
