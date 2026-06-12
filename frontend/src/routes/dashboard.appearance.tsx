import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/dashboard/appearance")({ component: Appearance });

function Appearance() {
  const { theme, setTheme } = useApp();
  const opts = [
    { id: "dark" as const, label: "Ember Dark", desc: "Cinematic, warm, after-hours.", Icon: Moon },
    { id: "light" as const, label: "Cream Day", desc: "Bright parchment, brunch ready.", Icon: Sun },
  ];
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Appearance</p>
        <h1 className="font-display text-5xl">Pick your room.</h1>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {opts.map((o) => {
          const on = theme === o.id;
          return (
            <motion.button key={o.id} whileHover={{ y: -4 }}
              onClick={() => setTheme(o.id)}
              className={`text-left rounded-3xl border p-6 transition-all ${on ? "border-primary ring-ember bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}>
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-ember text-background mb-3"><o.Icon className="h-5 w-5"/></span>
              <div className="font-display text-2xl">{o.label}</div>
              <div className="text-sm text-muted-foreground">{o.desc}</div>
              {on && <div className="text-xs text-primary mt-3 uppercase tracking-widest">Active</div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
