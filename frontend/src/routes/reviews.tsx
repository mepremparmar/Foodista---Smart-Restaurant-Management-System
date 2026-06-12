import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { reviews } from "@/lib/menu-data";
import { motion } from "framer-motion";
import { Star, Quote, PenTool } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [{ title: "Reviews — Foodista" }, { name: "description", content: "What diners say about Foodista." }],
  }),
});

function ReviewsPage() {
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback/public")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data && d.data.reviews) {
          setDbReviews(d.data.reviews);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  const formattedDbReviews = dbReviews.map((r) => ({
    text: r.comment || "Absolutely exceptional dining experience!",
    rating: Number(r.rating),
    name: r.customer_name || "Verified Guest",
    role: "Verified Diner",
  }));

  const all = [...formattedDbReviews, ...reviews, ...reviews.map((r) => ({ ...r, name: r.name + " ✦" }))];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-12 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Customer love</p>
        <h1 className="font-display text-6xl md:text-7xl">4.9 <span className="text-primary">★</span></h1>
        <p className="text-muted-foreground max-w-xl mx-auto">From 2,140 verified diners across Google, Zomato and our guestbook.</p>
        
        <div className="pt-4">
          <Link to="/feedback" className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3 text-background font-medium hover:scale-105 transition">
            Write a Review <PenTool className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {all.map((r, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 6) * 0.05 }}
            className="break-inside-avoid mb-6 rounded-2xl border border-border/50 bg-card p-6 space-y-4 hover:border-primary/40 transition"
          >
            <Quote className="h-6 w-6 text-primary/40" />
            <blockquote className="text-sm leading-relaxed">{r.text}</blockquote>
            <div className="flex gap-1">
              {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-primary text-primary" />)}
            </div>
            <figcaption>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.role}</div>
            </figcaption>
          </motion.figure>
        ))}
      </section>
    </SiteLayout>
  );
}
