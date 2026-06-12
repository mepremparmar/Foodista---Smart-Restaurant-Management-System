import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

export const Route = createFileRoute("/dashboard/dining")({ component: Dining });

function Dining() {
  const { orders, bookings } = useApp();
  const events = [
    ...orders.map((o) => ({ id: o.id, kind: "Order", title: `${o.items.length} item(s)`, date: o.createdAt, total: o.total })),
    ...bookings.map((b) => ({ id: b.id, kind: "Reservation", title: `${b.table} · ${b.guests} guests`, date: `${b.date}T${b.time}`, total: 0 })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Memories</p>
        <h1 className="font-display text-5xl">Dining history.</h1>
      </header>
      {events.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Utensils className="h-10 w-10 mx-auto mb-3" />Your visits will appear here.
        </div>
      ) : (
        <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {events.map((e, i) => (
            <motion.div key={e.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="relative">
              <span className="absolute -left-7 top-2 h-3 w-3 rounded-full gradient-ember ring-4 ring-background" />
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-primary uppercase tracking-widest">{e.kind}</div>
                    <div className="font-display text-lg">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(e.date).toLocaleString()}</div>
                  </div>
                  {e.total > 0 && <div className="font-display text-lg text-primary">${(e.total*1.05).toFixed(2)}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
