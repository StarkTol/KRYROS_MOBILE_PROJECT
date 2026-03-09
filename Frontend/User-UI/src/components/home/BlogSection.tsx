 "use client"
 
 import Link from "next/link"
 import Image from "next/image"
 import { ArrowRight } from "lucide-react"
 import { blogPosts } from "@/lib/store-data"
 
 export function BlogSection() {
   const posts = Array.isArray(blogPosts) ? blogPosts.slice(0, 3) : []
   if (!posts.length) return null
   return (
     <section className="section-padding bg-slate-50">
       <div className="container-custom">
         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-2xl md:text-3xl font-display font-bold">Latest News & Guides</h2>
             <p className="text-slate-600">Stay updated with the latest tech trends</p>
           </div>
           <Link href="/blog" className="text-kryros-accent font-medium hover:underline flex items-center gap-1">
             View All <ArrowRight className="h-4 w-4" />
           </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           {posts.map((p) => (
             <article key={p.slug} className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
               <div className="relative mb-3 h-36 rounded-xl bg-slate-100 overflow-hidden">
                 <Image
                   src={p.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                   alt={p.title}
                   fill
                   className="object-cover"
                 />
               </div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                   {p.category}
                 </span>
                 <span className="text-xs text-slate-500">{p.date}</span>
               </div>
               <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
               <p className="mt-1 text-sm text-slate-600 line-clamp-3">{p.excerpt}</p>
             </article>
           ))}
         </div>
       </div>
     </section>
   )
 }
