import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useApp } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: () => (<RequireAuth><Cart /></RequireAuth>),
  head: () => ({ meta: [{ title: "Your cart — Foodista" }] }),
});

function Cart() {
  const { cart, setQty, removeFromCart } = useApp();
  const nav = useNavigate();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Your cart</p>
        <h1 className="font-display text-6xl">Almost ready.</h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {cart.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-4">
              <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty — but the kitchen is hot.</p>
              <Link to="/menu" className="inline-flex rounded-full gradient-ember px-6 py-3 text-background">Browse menu</Link>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((i) => (
                <motion.div
                  key={i.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3"
                >
                  <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg">{i.name}</div>
                    <div className="text-sm text-primary">${i.price}</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border px-1">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5"/></button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5"/></button>
                  </div>
                  <button onClick={() => removeFromCart(i.id)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-destructive/20 hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6 space-y-4 h-fit sticky top-24">
          <h3 className="font-display text-2xl">Summary</h3>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={subtotal} />
            <Row label="GST (5%)" value={tax} />
            <div className="border-t border-border pt-3 flex justify-between font-display text-2xl">
              <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            disabled={!cart.length}
            onClick={() => nav({ to: "/checkout" })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-ember py-3 text-background font-medium disabled:opacity-50"
          >
            Checkout <ArrowRight className="h-4 w-4"/>
          </button>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span>${value.toFixed(2)}</span></div>;
}
