export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4">
        <div className="min-h-screen flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
