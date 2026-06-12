import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({ meta: [{ title: "FAQ — Foodista" }] }),
});

const faqs = [
  { q: "Do you take walk-ins?", a: "Yes, but the bar is your best bet on weekends. For tables, please reserve." },
  { q: "Are you vegan friendly?", a: "Half our menu is plant-forward and we mark vegan dishes clearly." },
  { q: "Is there a dress code?", a: "Smart casual. We won't turn you away for sneakers, but we love a good jacket." },
  { q: "Can you accommodate allergies?", a: "Always — flag them at booking and we'll plan around them." },
  { q: "Do you have private dining?", a: "Yes, our private room seats up to 10. Email events@foodista.app." },
  { q: "What's the cancellation policy?", a: "Free up to 4 hours before. After that, a small no-show fee per seat." },
  { q: "Do you offer delivery?", a: "Yes — order through our site for direct delivery within 5km." },
  { q: "Are kids welcome?", a: "Absolutely. We have a small kids' menu and high chairs on request." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Good to know</p>
        <h1 className="font-display text-6xl">Questions, answered.</h1>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-24 space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-display text-xl">{f.q}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>
    </SiteLayout>
  );
}
