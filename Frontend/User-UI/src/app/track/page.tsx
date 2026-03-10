"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/lib/api";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const onTrack = async () => {
    setError(null);
    setOrder(null);
    if (!query.trim()) return;
    setLoading(true);
    // Try fetch by id (backend exposes GET /orders/:id)
    const res = await ordersApi.getById(query.trim());
    setLoading(false);
    if (res.error) {
      setError("Order not found. Please verify the ID in My Orders.");
      return;
    }
    setOrder(res.data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-white">Track Your Order</h1>
          <p className="mt-2 text-slate-300">Enter your Order ID to view the latest status</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Enter Order ID (e.g., 9d2f1...)" value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={onTrack} disabled={loading} className="bg-green-500 hover:bg-green-600">
              {loading ? "Tracking..." : "Track"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Tip: You can find your Order ID in{" "}
            <Link className="text-green-600 underline" href="/dashboard/orders">My Orders</Link>.
          </p>
          {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        </div>

        {order && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-slate-500 text-sm">Order Number</p>
                <p className="font-medium">{order.orderNumber || order.id}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Placed</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Status</p>
                <p className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total</p>
                <p className="font-medium">{formatPrice(Number(order.total || 0))}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
