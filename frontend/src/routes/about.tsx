import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import interior from "@/assets/interior.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Foodista" },
      { name: "description", content: "The story behind Foodista — a wood-fired kitchen with global instincts." },
    ],
  }),
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-12 text-center">
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our story</motion.p>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0,transition:{delay:0.1}}} className="font-display text-6xl md:text-7xl">
          We started with one oven and one rule: <span className="italic text-gradient-ember">cook honestly</span>.
        </motion.h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          src={interior} alt="Foodista interior" loading="lazy" className="rounded-3xl w-full"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 space-y-8 text-lg leading-relaxed text-muted-foreground">
        <p>
          In 2014, two friends — a chef who couldn't sit still and an architect who
          loved warm rooms — opened a tiny five-table restaurant on Linden Lane. There
          was one wood oven, a stack of family recipes, and a battered playlist of old
          jazz records.
        </p>
        <p>
          A decade on, the room is bigger and the kitchen is louder, but the rule is
          the same. We source from farms we can drive to. We learn the names of our
          regulars. We never rush a sauce.
        </p>
        <p>
          Foodista is what happens when a kitchen treats the dining room like a
          living room — and the menu like a love letter to the season.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-3 gap-8">
        {[
          { num: "01", title: "Source", body: "Farms within 100km, fishermen we know by first name, oils pressed in small batches." },
          { num: "02", title: "Cook", body: "Wood, smoke, time. We don't shortcut the things that take all day." },
          { num: "03", title: "Welcome", body: "A room that feels like home — softly lit, slow paced, joyful." },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-3xl border border-border/50 bg-card p-8 space-y-4"
          >
            <div className="font-display text-5xl text-gradient-ember">{p.num}</div>
            <h3 className="font-display text-2xl">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.body}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <h2 className="font-display text-4xl mb-4">Curious to see for yourself?</h2>
        <Link to="/reserve" className="inline-flex rounded-full gradient-ember px-8 py-4 text-background font-medium">
          Reserve a table
        </Link>
      </section>
    </SiteLayout>
  );
}
