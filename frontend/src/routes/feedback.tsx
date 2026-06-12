import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/feedback")({
  component: () => (<RequireAuth><Feedback /></RequireAuth>),
  head: () => ({ meta: [{ title: "Feedback — Foodista" }] }),
});

function Feedback() {
  const { dishes, submitFeedback, orders } = useApp();
  const [foodRating, setFood] = useState(0);
  const [restRating, setRest] = useState(0);
  const [dish, setDish] = useState<string>("");
  const [text, setText] = useState("");

  const latestOrderId = orders && orders.length > 0 ? orders[0].id : null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Tell us</p>
        <h1 className="font-display text-6xl">How was it?</h1>
        <p className="text-muted-foreground mt-4">Every note is read by the chef and the room manager. We answer within a day.</p>
      </section>

      <motion.form
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={async (e) => {
          e.preventDefault();
          const rating = Math.max(1, restRating || foodRating || 5);
          const selectedDishObj = dishes.find((d) => d.id === dish);
          const comment = selectedDishObj ? `[Dish: ${selectedDishObj.name}] ${text}` : text;

          try {
            await submitFeedback(rating, comment, latestOrderId);
            toast.success("Thanks — your feedback is on its way to the kitchen and database!");
            setText("");
            setFood(0);
            setRest(0);
            setDish("");
          } catch (err: any) {
            toast.error(err.message || "Failed to submit feedback to server.");
          }
        }}
        className="mx-auto max-w-2xl px-6 pb-24 space-y-6"
      >
        <Block title="Rate the food">
          <Stars value={foodRating} onChange={setFood} />
        </Block>
        <Block title="Rate the experience">
          <Stars value={restRating} onChange={setRest} />
        </Block>
        <Block title="Which dish are you reviewing?">
          <select value={dish} onChange={(e) => setDish(e.target.value)} className="w-full rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary">
            <option value="">— Overall experience —</option>
            {dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Block>
        <Block title="Your thoughts">
          <textarea required rows={5} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-input bg-background/40 p-4 outline-none focus:border-primary" placeholder="What made it memorable? Anything we could improve?" />
        </Block>
        <button className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3 text-background font-medium">
          Send feedback <Send className="h-4 w-4" />
        </button>
      </motion.form>
    </SiteLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)}
          className="transition-transform hover:scale-125">
          <Star className={`h-8 w-8 ${n <= value ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}
