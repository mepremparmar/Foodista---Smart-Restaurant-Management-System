import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Flame, ChefHat } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { dishes, reviews } from "@/lib/menu-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <Specials />
      <Story />
      <Stats />
      <ReviewsStrip />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  const { user } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden grain">
      <motion.img
        src={heroImg}
        alt="Foodista interior"
        style={{ y, scale: useTransform(scrollYProgress, [0, 1], [1.05, 1.2]) }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-[oklch(0.62_0.18_45)]/30 blur-[140px]"
      />
      <motion.div
        style={{ opacity }}
        className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 flex items-end min-h-[92vh]"
      >
        <div className="space-y-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-widest text-primary"
          >
            <Flame className="h-3.5 w-3.5" /> Now serving the autumn menu
          </motion.div>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight">
            <SplitWord word="Slow" delay={0.3} />{" "}
            <span className="text-gradient-ember italic"><SplitWord word="fire" delay={0.5} /></span>,<br />
            <SplitWord word="fast" delay={0.7} />{" "}
            <SplitWord word="hearts." delay={0.9} />
          </h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            A kitchen that treats every plate like a story — wood smoke, hand-rolled
            pasta, and cocktails that arrive on a cloud. Reserve a table or order in.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="flex flex-wrap gap-4"
          >
            {user ? (
              <>
                <Link to="/reserve" className="group inline-flex items-center gap-2 rounded-full gradient-ember px-7 py-4 text-background font-medium hover:scale-[1.02] transition">
                  Reserve a table <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/menu" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 hover:border-primary transition">
                  Explore the menu
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="group inline-flex items-center gap-2 rounded-full gradient-ember px-7 py-4 text-background font-medium hover:scale-[1.02] transition">
                  Sign up <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 hover:border-primary transition">
                  Sign in
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function SplitWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {word}
      </motion.span>
    </span>
  );
}

function Marquee() {
  const items = ["Wood-fired", "Hand-rolled", "House-smoked", "Local farms", "Open kitchen", "Seasonal", "Slow service"];
  return (
    <div className="border-y border-border/40 py-6 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-3xl text-muted-foreground/60">
            {t} <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Specials() {
  const popular = dishes.filter((d) => d.popular);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Most loved</p>
          <h2 className="font-display text-5xl md:text-6xl">Today's specials</h2>
        </div>
        <Link to="/menu" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          View full menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {popular.map((d, i) => (
          <motion.article
            key={d.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <motion.img
                src={d.image} alt={d.name} loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7 }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-display text-2xl">{d.name}</h3>
              <p className="text-sm text-muted-foreground">{d.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 md:grid-cols-2 items-center">
      <motion.div
        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <img src={interior} alt="Foodista interior" loading="lazy" className="rounded-3xl ring-ember" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -bottom-8 -right-6 glass rounded-2xl border border-border p-5 max-w-[220px]"
        >
          <ChefHat className="h-6 w-6 text-primary mb-2" />
          <p className="text-sm">Chef Aarav cooks the way his grandmother did — with patience and fire.</p>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Our story</p>
        <h2 className="font-display text-5xl">A kitchen that remembers.</h2>
        <p className="text-muted-foreground">
          Foodista began as a five-table room in 2014, with one wood oven and a handful
          of recipes scribbled in a leather notebook. We've grown — but the notebook,
          and the oven, are still here. So is the slow conviction that good food is
          nothing more than good ingredients, treated with respect.
        </p>
        <Link to="/about" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
          Read our story <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}

function Stats() {
  const stats = [
    { num: "10", suf: "yrs", label: "of slow service" },
    { num: "42k", suf: "+", label: "happy diners" },
    { num: "180", suf: "", label: "seasonal dishes" },
    { num: "4.9", suf: "★", label: "average rating" },
  ];
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="font-display text-5xl md:text-6xl text-gradient-ember">
              {s.num}<span className="text-3xl">{s.suf}</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ReviewsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Kind words</p>
        <h2 className="font-display text-5xl">From the guestbook</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border/50 bg-card p-6 space-y-4 hover:border-primary/50 transition"
          >
            <div className="flex gap-1">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm leading-relaxed">"{r.text}"</p>
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl gradient-ember p-12 md:p-20 text-background text-center"
      >
        <div className="absolute inset-0 grain" />
        <h2 className="font-display text-5xl md:text-7xl mb-6 relative">A table is waiting.</h2>
        <p className="max-w-xl mx-auto mb-8 relative opacity-90">
          Tonight or next Saturday — we'll keep your favourite seat warm.
        </p>
        <Link to="/reserve" className="relative inline-flex items-center gap-2 rounded-full bg-background text-foreground px-8 py-4 font-medium hover:scale-105 transition">
          Reserve now <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
