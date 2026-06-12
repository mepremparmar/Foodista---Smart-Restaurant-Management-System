import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/dashboard/collections")({ component: Collections });

function Collections() {
  const { collections, toggleCollection, dishes } = useApp();
  const items = dishes.filter((d) => collections.includes(d.id));
  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Saved</p>
        <h1 className="font-display text-5xl">Your collections.</h1>
      </header>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
          <Heart className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Tap the heart on any dish to save it here.</p>
          <Link to="/menu" className="inline-flex rounded-full gradient-ember px-6 py-3 text-background">Browse menu</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d, i) => (
            <motion.div key={d.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden">
              <img src={d.image} alt={d.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between"><h3 className="font-display text-lg">{d.name}</h3><span className="text-primary">${d.price}</span></div>
                <button onClick={() => toggleCollection(d.id)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
