const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kryrosbackend.onrender.com/api'

async function getFlashSales() {
  const res = await fetch(`${API_URL}/products/flash-sales`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function FlashSalesPage() {
  const products = await getFlashSales()
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-slate-900">Flash Sales</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p: any) => (
          <a key={p.id} href={`/product/${p.slug ?? p.id}`} className="block rounded-xl border bg-white p-4">
            <div className="aspect-square rounded-lg bg-slate-100" />
            <div className="mt-3 text-sm font-medium text-slate-900">{p.name}</div>
            <div className="text-sm text-slate-600">K {(p.flashSalePrice ?? p.price ?? 0).toLocaleString()}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
