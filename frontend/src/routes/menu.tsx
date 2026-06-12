import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { type Dish } from "@/lib/store";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Star, Plus, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  component: () => (<RequireAuth><Menu /></RequireAuth>),
  head: () => ({ meta: [{ title: "Menu — Foodista" }, { name: "description", content: "Wood-fired pizzas, smoked meats, seasonal salads and craft cocktails." }] }),
});

const cats = ["All", "Starters", "Main Course", "Breads", "Salads", "Snacks", "Desserts", "Beverages", "Breakfast"] as const;

function Menu() {
  const { addToCart, collections, toggleCollection, user, dishes } = useApp();
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(
    () => (cat === "All" ? dishes : dishes.filter((d) => d.category === cat)),
    [cat, dishes]
  );

  const recommended = useMemo(() => {
    if (!user?.preferences?.length && !user?.dietary?.length) return dishes.slice(0, 3);
    return dishes
      .filter((d) =>
        user.dietary?.some((t) => d.tags.includes(t)) ||
        user.preferences?.some((p) => d.name.toLowerCase().includes(p.toLowerCase()))
      )
      .slice(0, 3);
  }, [user]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Order in</p>
          <h1 className="font-display text-6xl md:text-7xl">The menu.</h1>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-widest">Picked for {user?.fullName?.split(" ")[0] ?? "you"}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommended.map((d) => <MiniCard key={d.id} d={d} onAdd={() => { addToCart({ id: d.id, name: d.name, price: d.price, image: d.image }); toast.success(`${d.name} added`); }} />)}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2 mb-8 sticky top-20 z-30 glass py-3 -mx-2 px-2 rounded-2xl">
          {cats.map((c) => (
            <button
              key={c} onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm transition-all ${cat === c ? "gradient-ember text-background" : "border border-border hover:border-primary"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-24">
          {dishes.length === 0 && (
            <div className="col-span-3 text-center py-24 text-muted-foreground">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-lg">Loading menu items...</p>
              <p className="text-sm mt-1 opacity-60">Connecting to server...</p>
            </div>
          )}
          {filtered.length === 0 && dishes.length > 0 && (
            <div className="col-span-3 text-center py-24 text-muted-foreground">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg">No items in this category.</p>
            </div>
          )}
          {filtered.map((d, i) => {
            const liked = collections.includes(d.id);
            return (
              <motion.article
                layout key={d.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                  <button
                    onClick={() => toggleCollection(d.id)}
                    className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full glass border border-border/50"
                    aria-label="Save to collection"
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
                  </button>
                  <div className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {d.rating}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl">{d.name}</h3>
                    <span className="font-display text-lg text-primary">₹{d.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{d.desc}</p>
                  <div className="flex items-center gap-2">
                    {d.tags.map((t) => <span key={t} className="text-[10px] uppercase tracking-widest border border-border rounded-full px-2 py-0.5">{t}</span>)}
                  </div>
                  <button
                    onClick={() => { addToCart({ id: d.id, name: d.name, price: d.price, image: d.image }); toast.success(`${d.name} added`); }}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm hover:gradient-ember hover:text-background hover:border-transparent transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add to cart
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="pb-24 text-center">
          <Link to="/cart" className="inline-flex rounded-full gradient-ember px-8 py-4 text-background font-medium">Go to cart</Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function MiniCard({ d, onAdd }: { d: Dish; onAdd: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3">
      <img src={d.image} alt={d.name} className="h-16 w-16 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{d.name}</div>
        <div className="text-xs text-muted-foreground">${d.price}</div>
      </div>
      <button onClick={onAdd} className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-background"><Plus className="h-4 w-4"/></button>
    </div>
  );
}
