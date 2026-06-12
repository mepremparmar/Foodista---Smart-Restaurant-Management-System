import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { Receipt, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/dashboard/orders")({ component: Orders });

function Orders() {
  const { orders } = useApp();
  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Your orders</p>
        <h1 className="font-display text-5xl">Order history.</h1>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
          <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link to="/menu" className="inline-flex rounded-full gradient-ember px-6 py-3 text-background">Browse menu</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div key={o.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-xl flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /> {o.id}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <span className="text-xs rounded-full bg-primary/15 text-primary px-3 py-1 uppercase tracking-widest">{o.status}</span>
              </div>
              <div className="space-y-1 text-sm">
                {o.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>${(i.price*i.qty).toFixed(2)}</span></div>)}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-display text-lg">
                <span>Total</span><span className="text-primary">${(o.total*1.05).toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
