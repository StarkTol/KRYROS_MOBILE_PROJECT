import { notFound } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kryrosbackend.onrender.com/api'

async function getProduct(slug: string) {
  // Try slug first
  let res = await fetch(`${API_URL}/products/slug/${slug}`, { cache: 'no-store' })
  if (res.ok) {
    return res.json()
  }
  // Fallback: treat slug as id
  res = await fetch(`${API_URL}/products/${slug}`, { cache: 'no-store' })
  if (res.ok) {
    return res.json()
  }
  return null
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) {
    notFound()
  }
  const p = product
  return (
    <div className="container-custom py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-slate-100 aspect-square" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{p.name || 'Product'}</h1>
          <p className="mt-2 text-slate-600">{p.description || 'Coming soon.'}</p>
          <div className="mt-4 text-xl font-semibold">K {(p.price ?? 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
