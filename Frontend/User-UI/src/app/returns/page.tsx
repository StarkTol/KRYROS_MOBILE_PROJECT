"use client";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-white">Returns & Refunds</h1>
          <p className="mt-2 text-slate-300">Hassle-free returns within 7 days</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Return Window</h2>
          <p className="mt-2 text-slate-700">
            You can return eligible items within 7 days of delivery in original condition and packaging.
          </p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Non-Returnable Items</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700">
            <li>Software licenses and digital goods once delivered</li>
            <li>Opened earphones/headphones for hygiene reasons (unless defective)</li>
            <li>Items damaged due to misuse</li>
          </ul>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">How to Request a Return</h2>
          <ol className="mt-3 list-decimal pl-5 text-slate-700">
            <li>Go to Dashboard → My Orders and select the order.</li>
            <li>Contact support with your order number and reason.</li>
            <li>We arrange pickup or drop-off and process your refund/replacement.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
