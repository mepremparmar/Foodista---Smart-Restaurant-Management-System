import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/bookings")({ component: Bookings });

function Bookings() {
  const { bookings } = useApp();
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Tables</p>
        <h1 className="font-display text-5xl">Your bookings.</h1>
      </header>
      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No reservations yet.</p>
          <Link to="/reserve" className="inline-flex rounded-full gradient-ember px-6 py-3 text-background">Book a table</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {bookings.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-2">
              <div className="text-xs text-primary uppercase tracking-widest">{b.id}</div>
              <h3 className="font-display text-2xl">{b.table}</h3>
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/> {b.date} · {b.time}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4"/> {b.guests} guests · seats {b.seats}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
