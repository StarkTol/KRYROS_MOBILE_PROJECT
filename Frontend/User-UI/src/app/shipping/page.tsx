"use client";

import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-white">Shipping Information</h1>
          <p className="mt-2 text-slate-300">Delivery options, timelines, and fees</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Areas</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700">
            <li>Within Lusaka: 1–2 business days</li>
            <li>Other major cities: 2–4 business days</li>
            <li>Nationwide: 3–7 business days</li>
          </ul>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Shipping Fees</h2>
          <p className="mt-2 text-slate-700">
            Orders over $ 5,000 ship for free. Otherwise, shipping starts from $ 150 depending on distance and weight.
          </p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order Tracking</h2>
          <p className="mt-2 text-slate-700">
            After your order ships, we’ll email tracking details. You can also{" "}
            <Link className="text-green-600 underline" href="/track">track your order here</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
