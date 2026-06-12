import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, ChefHat, UtensilsCrossed, PartyPopper } from "lucide-react";
import { z } from "zod";

const search = z.object({
  type: z.enum(["order", "booking"]),
  id: z.string(),
});

export const Route = createFileRoute("/confirmation")({
  component: () => (<RequireAuth><Confirmation /></RequireAuth>),
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Confirmed — Foodista" }] }),
});

const steps = [
  { key: "received", label: "Order received", Icon: CheckCircle2 },
  { key: "preparing", label: "Preparing", Icon: ChefHat },
  { key: "cooking", label: "Cooking", Icon: Flame },
  { key: "serving", label: "Serving", Icon: UtensilsCrossed },
] as const;

function Confirmation() {
  const { type, id } = Route.useSearch();
  const { orders, bookings } = useApp();

  if (type === "booking") {
    const b = bookings.find((x) => x.id === id);
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}
            className="mx-auto h-20 w-20 rounded-full gradient-ember grid place-items-center text-background mb-6">
            <PartyPopper className="h-10 w-10" />
          </motion.div>
          <h1 className="font-display text-5xl mb-3">Table reserved.</h1>
          <p className="text-muted-foreground mb-8">Reservation ID <span className="text-primary">{id}</span></p>

          {b && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0,transition:{delay:0.3}}}
              className="rounded-3xl border border-border bg-card p-8 text-left space-y-4 mb-8">
              <Row label="Table" value={b.table} />
              <Row label="Date" value={b.date} />
              <Row label="Arrival time" value={b.time} />
              <Row label="Guests" value={String(b.guests)} />
              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-display text-xl">
                  <span>Hold deposit</span><span className="text-primary">$0.00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Free up to 4 hours before arrival.</p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 justify-center">
            <Link to="/dashboard/bookings" className="rounded-full border border-border px-6 py-3 hover:border-primary">My bookings</Link>
            <Link to="/" className="rounded-full gradient-ember px-6 py-3 text-background">Back home</Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const o = orders.find((x) => x.id === id);
  const currentIdx = steps.findIndex((s) => s.key === o?.status);
  const activeIdx = (o?.status === "delivered" || o?.status === "completed") ? steps.length - 1 : Math.max(0, currentIdx);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}
          className="mx-auto h-20 w-20 rounded-full gradient-ember grid place-items-center text-background mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <h1 className="font-display text-5xl mb-3">Order placed.</h1>
        <p className="text-muted-foreground mb-2">Order ID <span className="text-primary">{id}</span></p>
        <p className="text-sm text-muted-foreground mb-10 inline-flex items-center gap-2"><Clock className="h-4 w-4"/> Estimated 25–35 minutes</p>

        <div className="rounded-3xl border border-border bg-card p-8 mb-8">
          <div className="flex items-center justify-between gap-2">
            {steps.map((s, i) => {
              const done = i <= activeIdx;
              return (
                <div key={s.key} className="flex-1 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
                    className={`grid h-12 w-12 place-items-center rounded-full transition-colors ${done ? "gradient-ember text-background" : "border border-border text-muted-foreground"}`}>
                    <s.Icon className="h-5 w-5" />
                  </motion.div>
                  <div className="text-xs mt-2">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {o && (
          <div className="rounded-3xl border border-border bg-card p-8 text-left space-y-3 mb-8">
            <h3 className="font-display text-2xl mb-2">Bill</h3>
            {o.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>{i.name} × {i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-display text-xl">
              <span>Total</span><span className="text-primary">${(o.total * 1.05).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/dashboard/orders" className="rounded-full border border-border px-6 py-3 hover:border-primary">My orders</Link>
          <Link to="/feedback" className="rounded-full gradient-ember px-6 py-3 text-background">Leave feedback</Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
