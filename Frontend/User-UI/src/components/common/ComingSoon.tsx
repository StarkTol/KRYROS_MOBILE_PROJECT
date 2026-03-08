export default function ComingSoon({ title = "Coming Soon", message = "This section will be available soon." }: { title?: string; message?: string }) {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-600">{message}</p>
        </div>
      </div>
    </section>
  );
}
