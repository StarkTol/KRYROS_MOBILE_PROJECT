import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Shield, Truck, Clock, CreditCard } from 'lucide-react'

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
  const specifications = typeof p.specifications === 'string' 
    ? JSON.parse(p.specifications) 
    : (Array.isArray(p.specifications) ? p.specifications : [])

  const mainImage = p.images?.[0]?.url || '/placeholder.jpg'

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container-custom">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <Image
                src={mainImage}
                alt={p.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
            {p.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {p.images.map((img: any, idx: number) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                    <Image src={img.url} alt={p.name} fill className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
                  {p.category?.name || 'General'}
                </span>
                {p.brand?.name && (
                  <span className="text-sm font-medium text-slate-500">{p.brand.name}</span>
                )}
              </div>
              
              <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">{p.name}</h1>
              <p className="mt-2 text-sm text-slate-500 font-mono">SKU: {p.sku}</p>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-3xl font-bold text-slate-900">{formatPrice(Number(p.price))}</span>
                {p.originalPrice && (
                  <span className="text-lg text-slate-400 line-through">{formatPrice(Number(p.originalPrice))}</span>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1 bg-green-500 hover:bg-green-600">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1 border-slate-200">
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
              </div>

              {p.allowCredit && (
                <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <CreditCard className="h-5 w-5" />
                    Available on Installments
                  </div>
                  <p className="mt-1 text-sm text-blue-600">
                    Get this product from as low as {formatPrice(Number(p.creditMinimum || 500))}/month
                  </p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-blue-700 underline underline-offset-4">
                    Apply for Credit Now
                  </Button>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Fast Delivery</p>
                    <p className="text-slate-500">Lusaka & Copperbelt</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">1 Year Warranty</p>
                    <p className="text-slate-500">Genuine products</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications & Description */}
            <div className="mt-8 space-y-8">
              {specifications.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">Specifications</h3>
                  <div className="mt-4 grid gap-y-3">
                    {specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="flex border-b border-slate-100 pb-2 last:border-0">
                        <span className="w-1/3 text-sm font-medium text-slate-500">{spec.key}</span>
                        <span className="w-2/3 text-sm font-bold text-slate-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Description</h3>
                <div className="mt-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {p.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
