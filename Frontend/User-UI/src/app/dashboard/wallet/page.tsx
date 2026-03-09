 "use client"
 
 import { useEffect, useState } from "react"
 import Link from "next/link"
 import { useRouter } from "next/navigation"
 import { Button } from "@/components/ui/button"
 import { walletApi } from "@/lib/api"
 import { useAuth } from "@/providers/AuthProvider"
 
 export default function WalletPage() {
   const { isAuthenticated, isLoading } = useAuth()
   const router = useRouter()
   const [mounted, setMounted] = useState(false)
   const [balance, setBalance] = useState<any>(null)
   const [transactions, setTransactions] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
 
   useEffect(() => {
     setMounted(true)
   }, [])
 
   useEffect(() => {
     if (mounted && !isLoading && !isAuthenticated) {
       router.push("/login")
     }
   }, [mounted, isLoading, isAuthenticated, router])
 
   useEffect(() => {
     let active = true
     Promise.all([walletApi.getBalance(), walletApi.getTransactions()]).then(([b, t]) => {
       if (!active) return
       setBalance(b.data || { amount: 0, currency: "K" })
       setTransactions(Array.isArray(t.data) ? t.data : [])
       setLoading(false)
     }).catch(() => {
       if (!active) return
       setBalance({ amount: 0, currency: "K" })
       setTransactions([])
       setLoading(false)
     })
     return () => { active = false }
   }, [])
 
   if (!mounted || isLoading || (!isAuthenticated && mounted)) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
       </div>
     )
   }
 
   return (
     <div className="mx-auto max-w-7xl px-4 py-8">
       <div className="mb-6 flex items-center justify-between">
         <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Wallet</h1>
         <Link href="/dashboard">
           <Button variant="ghost">Back to Dashboard</Button>
         </Link>
       </div>
 
       {loading ? (
         <div className="rounded-xl border bg-white p-10 text-center text-slate-600">
           Loading wallet...
         </div>
       ) : (
         <div className="grid gap-6 lg:grid-cols-3">
           <div className="rounded-xl border bg-white p-6">
             <p className="text-slate-600">Available Balance</p>
             <p className="mt-2 text-3xl font-bold text-slate-900">
               {balance?.currency || "K"} {(Number(balance?.amount) || 0).toLocaleString()}
             </p>
             <div className="mt-4 flex gap-3">
               <Button className="bg-green-500 hover:bg-green-600">Deposit</Button>
               <Button variant="outline">Withdraw</Button>
             </div>
           </div>
 
           <div className="lg:col-span-2 rounded-xl border bg-white p-6">
             <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Transactions</h2>
             {transactions.length === 0 ? (
               <p className="text-slate-600">No transactions found.</p>
             ) : (
               <div className="space-y-3">
                 {transactions.map((txn) => (
                   <div key={txn.id} className="flex items-center justify-between rounded-lg border p-3">
                     <div>
                       <p className="text-sm font-medium text-slate-900">{txn.type || "Transaction"}</p>
                       <p className="text-xs text-slate-500">{new Date(txn.createdAt || Date.now()).toLocaleString()}</p>
                     </div>
                     <div className={`text-sm font-semibold ${Number(txn.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                       {balance?.currency || "K"} {(Number(txn.amount) || 0).toLocaleString()}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       )}
     </div>
   )
 }
