import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reserve")({
  component: () => (<RequireAuth><Reserve /></RequireAuth>),
  head: () => ({ meta: [{ title: "Reserve a table — Foodista" }] }),
});

function Reserve() {
  const { addBooking, tables } = useApp();
  const nav = useNavigate();
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:30");
  const [guests, setGuests] = useState(2);

  const sel = tables.find((t) => t.id === selected) || tables[0];

  if (!tables.length) return <SiteLayout><div className="pt-32 text-center">Loading tables...</div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Reservations</p>
        <h1 className="font-display text-6xl md:text-7xl">Pick your seat.</h1>
        <p className="text-muted-foreground mt-4 max-w-xl">Choose the room, the time, and we'll have a candle lit when you arrive.</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 grid lg:grid-cols-3 gap-8 pb-24">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">Most booked this week</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {tables.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(t.id)}
                className={`text-left rounded-3xl border p-6 transition-all ${selected === t.id ? "border-primary bg-primary/5 ring-ember" : "border-border bg-card hover:border-primary/50"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-2xl">{t.name}</h3>
                  {t.popular && <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary rounded-full px-2 py-0.5">Popular</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4" /> Seats {t.seats}
                </div>
                <p className="text-sm">{t.vibe}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!date || !time) return toast.error("Please pick date and time.");
            if (sel && sel.seats < guests) {
              return toast.error(`${sel.seats} seater table is not sufficient for ${guests} guests.`);
            }
            try {
              const b = await addBooking({ table_id: sel.id, table: sel.name, seats: sel.seats, date, time, guests });
              toast.success("Table reserved!");
              nav({ to: "/confirmation", search: { type: "booking" as const, id: b.id } });
            } catch (err: any) {
              toast.error(err.message || "Reservation failed. Please try again.");
            }
          }}
          className="rounded-3xl border border-border bg-card p-6 space-y-5 h-fit sticky top-24"
        >
          <h3 className="font-display text-2xl">Your reservation</h3>
          <div className="rounded-2xl gradient-ember p-4 text-background">
            <div className="text-xs uppercase tracking-widest opacity-80">Selected</div>
            <div className="font-display text-2xl">{sel.name}</div>
            <div className="text-xs opacity-80">{sel.vibe}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Field label="Time" type="time" value={time} onChange={setTime} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Guests</label>
            <div className="flex items-center gap-2 mt-2">
              {[1,2,3,4,5,6,8].map((n) => (
                <button type="button" key={n} onClick={() => setGuests(n)}
                  className={`h-10 w-10 rounded-full text-sm transition ${guests === n ? "gradient-ember text-background" : "border border-border hover:border-primary"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-ember py-3 text-background font-medium">
            Confirm reservation <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary transition"
      />
    </label>
  );
}
